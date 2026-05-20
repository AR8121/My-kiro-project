# Audio Intelligence — Website

Professional e-commerce website for **Audio Intelligence**, a company selling audio plugins and analog hardware.

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, featured products, categories, testimonials, newsletter |
| Products | `products.html` | Full product catalog with filter by category |
| Updates | `updates.html` | Product changelogs and version history |
| About | `about.html` | Company story, values, team |
| Support | `support.html` | Contact form, FAQ accordion, support channels |

## Tech Stack

- Pure HTML5, CSS3, Vanilla JavaScript (no frameworks, no dependencies)
- Google Fonts: Inter + Space Grotesk
- Font Awesome 6 icons
- Cart persisted in `localStorage`

## Features

- 🛒 **Shopping Cart** — slide-out drawer, localStorage persistence
- 🎨 **Dark Pro Theme** — black/gold color system matching premium audio brands
- 📱 **Fully Responsive** — mobile, tablet, desktop
- ✨ **Scroll Animations** — IntersectionObserver fade-up effects
- 🔍 **Product Filtering** — filter by plugins / hardware / bundles / free
- 📋 **Update Changelog** — filterable by product
- ❓ **FAQ Accordion** — animated expand/collapse
- 📧 **Newsletter Form** — with toast notification feedback
- 📬 **Contact Form** — with product selector

## To Deploy

Simply upload all files to any static web host:
- [Netlify](https://netlify.com) — drag and drop the folder
- [Vercel](https://vercel.com) — connect GitHub repo
- [GitHub Pages](https://pages.github.com) — enable in repo Settings

## Customization

- Replace product data in `js/main.js` → `const products = [...]`
- Update contact email in `support.html`
- Add real product images to replace icon placeholders
- Connect a payment processor (Stripe, Paddle) to the checkout button
