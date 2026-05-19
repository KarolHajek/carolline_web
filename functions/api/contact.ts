interface Env {
	CONTACT_RECIPIENT?: string;
	CONTACT_SENDER?: string;
	RESEND_API_KEY?: string;
	TURNSTILE_SECRET_KEY?: string;
}

type ContactPayload = {
	name?: string;
	email?: string;
	phone?: string;
	type?: string;
	inquiryType?: string;
	message?: string;
	turnstileToken?: string;
};

const allowedTypes = new Set(['vseobecny', 'material', 'realizacia']);

function json(body: Record<string, unknown>, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'access-control-allow-origin': '*',
		},
	});
}

async function verifyTurnstile(secret: string, token?: string) {
	if (!token) {
		return false;
	}

	const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			secret,
			response: token,
		}),
	});

	if (!response.ok) {
		return false;
	}

	const data = (await response.json()) as { success?: boolean };
	return data.success === true;
}

async function sendViaResend(apiKey: string, to: string, from: string, payload: Required<Omit<ContactPayload, 'turnstileToken'>>) {
	const subjectMap: Record<string, string> = {
		vseobecny: 'Novy vseobecny dopyt z carolline.sk',
		material: 'Novy dopyt na materialy z carolline.sk',
		realizacia: 'Novy dopyt na realizaciu z carolline.sk',
	};

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			authorization: `Bearer ${apiKey}`,
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			from,
			to,
			subject: subjectMap[payload.inquiryType] ?? subjectMap.vseobecny,
			html: `
				<h1>Novy dopyt z carolline.sk</h1>
				<p><strong>Typ:</strong> ${payload.inquiryType}</p>
				<p><strong>Meno/Firma:</strong> ${payload.name}</p>
				<p><strong>Email:</strong> ${payload.email}</p>
				<p><strong>Telefon:</strong> ${payload.phone || '-'}</p>
				<p><strong>Sprava:</strong></p>
				<p>${payload.message.replaceAll('\n', '<br />')}</p>
			`,
		}),
	});

	return response.ok;
}

export const onRequestOptions = async () =>
	new Response(null, {
		status: 204,
		headers: {
			'access-control-allow-origin': '*',
			'access-control-allow-methods': 'POST, OPTIONS',
			'access-control-allow-headers': 'content-type',
		},
	});

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
	if (!env.RESEND_API_KEY || !env.CONTACT_RECIPIENT) {
		return json(
			{
				message:
					'Formulár je pripravený, ale v Cloudflare Pages ešte chýba CONTACT_RECIPIENT alebo RESEND_API_KEY.',
			},
			503,
		);
	}

	let payload: ContactPayload;

	try {
		payload = (await request.json()) as ContactPayload;
	} catch {
		return json({ message: 'Neplatný formát požiadavky.' }, 400);
	}

	const inquiryType = payload.inquiryType || payload.type || 'vseobecny';

	if (!payload.name || !payload.email || !payload.message || !allowedTypes.has(inquiryType)) {
		return json({ message: 'Prosím vyplňte povinné polia formulára.' }, 400);
	}

	if (env.TURNSTILE_SECRET_KEY) {
		const isValidTurnstile = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, payload.turnstileToken);

		if (!isValidTurnstile) {
			return json({ message: 'Nepodarilo sa overiť antispam ochranu.' }, 400);
		}
	}

	const sent = await sendViaResend(
		env.RESEND_API_KEY,
		env.CONTACT_RECIPIENT,
		env.CONTACT_SENDER || 'CLG <noreply@carolline.sk>',
		{
			name: payload.name,
			email: payload.email,
			phone: payload.phone || '',
			type: inquiryType,
			inquiryType,
			message: payload.message,
		},
	);

	if (!sent) {
		return json({ message: 'Dopyt sa nepodarilo odoslať. Skúste to prosím znova.' }, 502);
	}

	return json({ message: 'Ďakujeme, dopyt bol odoslaný. Ozveme sa čo najskôr.' });
};
