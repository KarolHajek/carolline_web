# CLG / Carolline.sk

Nový B2B web pre `Carol line Group s.r.o.` postavený na `Astro` s obsahom v content collections a deploy modelom `GitHub -> Cloudflare Pages`.

## Stack

- `Astro` pre statický, rýchly a SEO orientovaný web
- `Content Collections` pre správu obsahu služieb, značiek a produktových línií
- `Cloudflare Pages Functions` pre spracovanie kontaktného formulára
- `GitHub Actions` workflow pre build kontrolu pri pushi a pull requestoch

## Lokálny vývoj

```bash
npm install
npm run dev
```

Build produkčného výstupu:

```bash
npm run build
```

## Obsahová štruktúra

- `src/content/pages/` statické stránky ako `o-nas` a `kontakt`
- `src/content/services/` root-level SEO služby ako `/autofolie/` alebo `/reklamne-polepy/`
- `src/content/product-lines/` B2B katalóg materiálov a technických produktov
- `src/content/brands/` značky ako `Avery Dennison` a `3M`
- `src/content/references/` vybrané realizácie
- `src/content/settings/site.json` globálne kontakty, navigácia a trust prvky

## GitHub workflow

Repo je pripravené na verzovanie a deploy z GitHubu:

- workflow súbor: `.github/workflows/ci.yml`
- spúšťa `npm ci` a `npm run build`
- odporúčaný hlavný branch: `main`

Odporúčaný postup:

1. Vytvoriť nový GitHub repozitár.
2. Nastaviť `main` ako produkčný branch.
3. Pripojiť repozitár do `Cloudflare Pages`.
4. Nastaviť build command na `npm run build`.
5. Nastaviť output directory na `dist`.

## Cloudflare Pages a formulár

Formulár používa `functions/api/contact.ts`.

Pre produkčné odosielanie treba v Cloudflare Pages doplniť environment variables:

- `CONTACT_RECIPIENT`
- `RESEND_API_KEY`
- `CONTACT_SENDER`
- `TURNSTILE_SECRET_KEY`

Poznámka:

- frontend formulára je pripravený aj bez týchto hodnôt
- bez env premenných endpoint korektne vráti konfiguračnú chybu, aby bolo jasné, čo chýba

## SEO a migrácia

- nové routy zachovávajú kľúčové service URL
- staré blog URL sú presmerované cez `public/_redirects`
- staré `portfolio_page/*` rieši `410 Gone` cez `functions/portfolio_page/[[path]].ts`
- `robots.txt` a `sitemap-index.xml` sú súčasťou build výstupu

## Ďalší krok pred produkciou

- doplniť originál loga ideálne v `SVG`
- napojiť Cloudflare Pages na finálny GitHub repozitár
- doplniť Turnstile site key do frontendu, ak sa bude používať widget
- potvrdiť finálny recipient email pre dopyty
