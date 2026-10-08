# Mahalakshmi Sekar — Developer Portfolio

A bold, colorful, interactive developer portfolio built with **React + Vite**, **React Three Fiber / Three.js** for the 3D hero scene, and **GSAP** for scroll-triggered animations — inspired by the layout energy of jesseermens.nl, restyled with a vibrant violet/magenta/cyan/amber palette.

## Sections

- **Hero** — animated headline reveal + interactive 3D mascot (React Three Fiber / Three.js)
- **Work** — DineFlow, Nathan Lights, LearnLoop project showcase with tilt-on-hover cards
- **About** — bio pulled from your real background
- **Skills** — infinite marquee + grouped skill cards
- **Experience** — timeline (Ethics Tech, NathanDynamix) + education & certifications
- **Services** — what you offer, as 4 cards
- **FAQ** — animated accordion
- **Contact** — form posts to the Spring Boot mail endpoint + direct links

All copy is based on your resume — edit `src/data/content.js` to update anything (projects, experience, skills, contact info) without touching component code.

## Getting started

```bash
npm install
npm run dev       # start local dev server (usually http://localhost:5173)
npm run build      # production build to /dist
npm run preview    # preview the production build locally
```

Requires Node.js 18+.

## Contact form setup

The contact form posts to the Spring Boot backend, which sends through the Resend HTTPS API. Set `RESEND_API_KEY` in Render's backend environment. The default sender is Resend's `onboarding@resend.dev` test sender; for production, verify a domain in Resend and set `RESEND_FROM_EMAIL` to an address on that domain. `PORTFOLIO_CONTACT_RECIPIENT` defaults to the portfolio email. Keep the API key out of source control and frontend variables. The frontend can use `VITE_API_URL` to point at the deployed API; when delivery fails, it offers a prefilled email fallback.

## Project structure

```
src/
  components/     one component + matching .css file per section
  data/content.js  all real content (edit this to update the site)
  index.css        design tokens (colors, type, spacing) + shared utility classes
```

## Customizing

- **Colors / fonts** — edit the CSS variables at the top of `src/index.css` (`--violet`, `--magenta`, `--cyan`, `--amber`, `--font-display`, `--font-body`).
- **Projects, experience, skills, contact info** — all in `src/data/content.js`.
- **3D hero shape** — `src/components/Hero3D.jsx` (swap geometry, colors, distort amount).
- **Deploying** — `npm run build` then deploy the `dist/` folder to Vercel, Netlify, GitHub Pages, or any static host.
