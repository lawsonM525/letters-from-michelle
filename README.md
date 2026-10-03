# Letters from Michelle

Michelle’s little post office: a responsive retro desktop window, cream-and-pink palette, envelope illustration, Georgia headings, and live Tally forms.

## Live signup flows

The invitation opens the international penpal form inside the site. Tally collects first name, street address, optional apartment/unit, city, optional state/province/region, optional postal code, and required country. The form explains that a letter or ongoing replies cannot be guaranteed.

The magazine waitlist is a separate opt-in for first name and email. It is available from the invitation, the penpal form, and after a confirmed letter submission. No free-copy checkbox is added.

- Penpal: https://tally.so/r/68alRY
- Magazine waitlist: https://tally.so/r/zxP9JM
- Production: https://letters-from-michelle-taupe.vercel.app/

Both forms use responsive standard embeds with Tally’s dynamic-height widget. A direct link is available if an embed cannot load. Back and close controls let visitors return to the invitation. Returning to a form creates a fresh embed; unfinished values may be lost.

A success state appears only after a Tally.FormSubmitted message from the matching Tally iframe and form ID. The site does not retain, log, or store answers. Submission data lives in Tally; the frontend has no recipient database, admin dashboard, or mailing workflow. The penpal signup does not subscribe anyone to the magazine.

## Run and deploy

Requires Node.js 22.13 or newer.

1. npm ci
2. npx next dev
3. npx next build to check the Vercel production build

Vercel uses the existing Next.js preset with the Build Command override next build, root directory ./, and default output/install settings. The inherited npm run build wrapper targets Vinext/Cloudflare and is not the Vercel build command.

Useful files:

- app/penpal.tsx: invitation, embedded forms, and confirmed success screens
- app/site-config.ts: public form IDs, URLs, and initial embed heights
- app/globals.css: retro styling and responsive layouts
- public/penpal-mail.png: envelope illustration

Keep addresses, email records, credentials, and exports out of Git, public pages, screenshots, and logs. Test the visible forms without submitting responses unless submission testing is explicitly authorized.
