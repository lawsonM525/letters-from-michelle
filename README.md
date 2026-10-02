# Letters from Michelle

A simple mobile-first penpal frontend with a retro desktop window, cream-and-pink palette, the original envelope illustration, and a separate handmade zine waitlist preview.

The flow stays short: one invitation and button, a brief address form, then an optional zine invite. Completing the demo clears the entered values and reveals a small “SEALED / DEMO COMPLETE” stamp automatically. There are no extra game steps, looping animations, or bouncing effects.

## Current status: frontend-only demo

- US mailing addresses only for now. This notice appears on the homepage before the main button and above the address form, so it remains visible when a Tally link replaces the demo.
- The demo fixes the country to United States, requires a state, and accepts 5-digit or ZIP+4 postal codes.
- No database, API, admin dashboard, authentication, analytics, or real signup is implemented.
- The persistent demo notice explains that nothing is sent or saved. Use made-up details when trying the form.
- Form values exist only in React memory while the page is open. Completing the demo clears them. Reloading resets the demo.
- No form values are sent over the network, saved in localStorage, logged, or bundled into source.
- Neither the letter nor the zine buttons submit a real signup.

## Run and edit

Requires Node.js 22.13 or newer.

1. `npm ci`
2. `npm run dev`
3. Open the local URL printed in the terminal.

Useful files:

- `app/penpal.tsx`: homepage, address form, and zine preview interaction
- `app/globals.css`: colors, retro window styling, typography, responsive layout
- `app/site-config.ts`: future Tally link setting
- `app/layout.tsx`: document title and description
- `public/penpal-mail.png`: original envelope illustration
- `public/favicon.svg`: site icon

`npm run build` creates the production bundle. `npm start` previews the built Worker locally. The included Vinext / Cloudflare build scaffolding supports the current hosting workflow. The application itself does not use its optional backend capabilities.

## Connect Tally later

Create and publish the real Tally form first, then set `LETTER_FORM_URL` in `app/site-config.ts` to its exact `https://tally.so/r/...` URL. The main CTA will open that form instead of this local demo. Do not insert a fake ID. No Tally form is connected in this version.

Set up the live Tally form's first-name/address fields and clear consent language. Keep US-only eligibility visible and restrict its address fields to United States, state, and ZIP code. Keep the zine waitlist a separate, explicit opt-in. Configure a thank-you screen and retention/access settings there. Adding the link does not itself build these features or automatically create a waitlist. Confirm the flow with dummy data before inviting real people.

## Privacy and future work

Keep recipient records out of Git, public pages, client JavaScript, screenshots, and logs. A later packed/shipped workflow will need a separate, properly authorized private tool. This repository intentionally contains no recipient information, credentials, live database connection, or deployment-specific identity.

The public frontend source is separate from the private hosted review link. Publishing source code does not make the hosted Site public.
