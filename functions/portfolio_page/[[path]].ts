export const onRequestGet = async () =>
	new Response('Tato stranka uz nie je sucastou noveho webu.', {
		status: 410,
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'x-robots-tag': 'noindex, nofollow',
		},
	});
