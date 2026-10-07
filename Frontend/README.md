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
- **Contact** — form powered by EmailJS + direct links

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

The contact form uses EmailJS so it can send directly from this static frontend without a Gmail app password. Create an EmailJS email service and template, then set these variables in Vercel's project settings (and in `Frontend/.env.local` for local development):

```text
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Use `{{name}}`, `{{email}}`, and `{{message}}` in the EmailJS template. Set the recipient to your portfolio email address. Redeploy Vercel after adding or changing the variables. The public key is intended for browser use; never put a private key or Gmail password in a `VITE_` variable.

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
