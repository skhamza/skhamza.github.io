# Hamza Shaikh, Portfolio

A cinematic personal portfolio built with plain **HTML, CSS and JavaScript**. There is no build step and no dependencies to install.

## Features

- **Dot-particle portrait.** A black-and-white version of my photo assembles from thousands of dots on load, pushes away from the mouse, and scatters as you scroll.
- **3D MacBook-style laptop (pure CSS).** It appears back-first, turns to show its screen, floats, and swings beside each section as you scroll. The screen types out this portfolio's own code.
- **Day and night theme** (the ◐ Theme button), remembered between visits. The accent colour is olive green.
- **Motion on/off switch**, and full support for `prefers-reduced-motion`.
- **Responsive** layout for desktop, tablet and mobile.

## Project structure

```
hamza-portfolio/
├── index.html              all page content
├── README.md
├── css/
│   └── style.css           design tokens, layout, 3D laptop
├── js/
│   ├── portrait-data.js    black-and-white portrait (base64) used by the dots
│   ├── portrait.js         dot-particle animation
│   ├── laptop.js           3D laptop: keyboard, typed code, scroll movement
│   └── main.js             theme, motion toggle, preloader, reveals, counters
└── assets/
    ├── hamza.jpg           colour photo used in the Contact section
    ├── lid-back.jpg        laptop lid texture
    └── favicon.svg
```

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

An internet connection is needed for the Google Fonts (Instrument Serif, Instrument Sans, JetBrains Mono). Without it the site falls back to system fonts.

## Publish on GitHub Pages

1. Create a **public** repository named `skhamza.github.io` on GitHub.
2. Upload everything in this folder. Keep the `css`, `js` and `assets` folders, and keep `index.html` at the top level. Or use git:

   ```bash
   git init
   git add .
   git commit -m "Add portfolio"
   git branch -M main
   git remote add origin https://github.com/skhamza/skhamza.github.io.git
   git push -u origin main
   ```

   Git asks for your GitHub username and a personal access token (not your account password).
3. In the repository open **Settings → Pages**. Under **Build and deployment** set **Source** to *Deploy from a branch*, choose **main** and **/ (root)**, then **Save**.
4. After a minute or two the site is live at **https://skhamza.github.io**.

## Editing the content

| What to change | Where |
|---|---|
| Text, links, email | `index.html` |
| Colours and fonts | CSS variables at the top of `css/style.css`. The olive accent is `--ad` (on dark) and `--al` (on light), given as r,g,b. |
| Text typed on the laptop screen | `CODE` in `js/laptop.js` |
| Contact photo | replace `assets/hamza.jpg` |
| Laptop lid image | replace `assets/lid-back.jpg` (about 1120 × 700 px) |
| Dot portrait | create a new black-and-white cut-out of the photo and replace the data in `js/portrait-data.js` |

## Notes

- Projects currently lists only this portfolio. Add a project by copying the `.pj` block in the Projects section of `index.html`.
- The laptop lid image is a photo of a laptop and includes its logo. Replace `assets/lid-back.jpg` if you prefer a plain lid.
