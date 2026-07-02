# MCQ Supermarket — Custom Theme Build (Setup Guide)

A premium, mobile-first redesign built on top of the **Horizon** theme.
All custom code is namespaced (`mcq-*`) so it never breaks the base theme,
and **no product / price / barcode data is hard-coded** — the product bands
read live Shopify collections, which **LS Retail / LS Central** syncs into
Shopify via the Shopify Connector.

---

## 1. Files delivered & where they live

| File | Folder in the theme | What it is |
|------|--------------------|------------|
| `sections/mcq-homepage.liquid` | `sections/` | Full premium homepage (hero + 2 videos, stats, categories, 3 dynamic product bands, street food, wholesale CTA, rewards, locations, newsletter) |
| `sections/mcq-about.liquid` | `sections/` | About Us (story, values, timeline, CTA) |
| `sections/mcq-wholesale.liquid` | `sections/` | Wholesale inquiry form |
| `sections/mcq-faq.liquid` | `sections/` | FAQ accordion (+ Google FAQ rich-result data) |
| `assets/mcq-custom.css` | `assets/` | All styling (loaded automatically by the sections) |
| `templates/index.json` | `templates/` | Homepage template → uses `mcq-homepage` |
| `templates/page.about.json` | `templates/` | Page template “about” |
| `templates/page.wholesale.json` | `templates/` | Page template “wholesale” |
| `templates/page.faq.json` | `templates/` | Page template “faq” |

They are already in the correct folders in this repo. Push them to your store:

```bash
shopify theme push          # push to the live/selected theme
# or, safer, push to an unpublished copy first:
shopify theme push --unpublished --theme "MCQ Redesign"
```

> The CSS loads itself — each section calls
> `{{ 'mcq-custom.css' | asset_url | stylesheet_tag }}`, so you do **not**
> need to edit `theme.liquid` or `layout`.

---

## 2. One-time setup in the Shopify admin

### a) Create the pages (About / Wholesale / FAQ)
`Online Store → Pages → Add page` for each:

| Page title | Theme template to choose (right-hand “Template” box) |
|------------|------------------------------------------------------|
| About Us | `page.about` |
| Wholesale | `page.wholesale` |
| FAQ | `page.faq` |

The pages come **pre-filled** with MCQ content — edit anything later in
`Online Store → Themes → Customize`.

### b) Point the buttons/menus at the new pages
In the theme editor (`Customize`):
- Homepage → **Wholesale call-to-action** → set *Button link* → the Wholesale page.
- Homepage → **Hero** → set the two button links (Locations / Rewards, etc.).
- `Header` menu (`Online Store → Navigation`): add About / Wholesale / FAQ / Locations.

### c) Connect the product bands to collections
The homepage has 3 dynamic bands. In `Customize → Homepage`:
- **Fresh produce band → Collection** → pick your fresh-produce collection
- **International groceries band → Collection** → pick that collection
- **Weekly specials band → Collection** → pick that collection

Products, images, prices and “Special” badges then appear automatically.
Create the collections as **Automated collections** so LS Retail keeps them
filled (e.g. condition *Product type = Fresh Produce*, or *Tag contains
special*). Nothing about price/stock is typed by hand.

### d) The two videos (already working)
Both clips ship **inside the theme** as `assets/mcq-video-1.mp4` and
`assets/mcq-video-2.mp4`, and the Video band is pre-set to use them — they
**autoplay muted and loop** on the homepage, no setup needed.

To swap a video, `Customize → Homepage → Video band → Video 1/2` and either:
- change the **theme asset filename** (upload a new `.mp4` to `assets/` first), or
- pick a **Shopify-hosted video**, or
- paste a **YouTube / Vimeo URL** (+ optional poster image).

Render priority per slot: Shopify-hosted video → theme asset `.mp4` →
external URL → placeholder.

### e) Wholesale form email
Form submissions use Shopify’s built-in contact form. Set the recipient at
`Settings → Notifications → Customer / Contact` (the store *sender email*
receives them). Fields captured: Business Name, Contact Name, Email, Phone,
ABN, Business Type, Interested Categories, Message.

### f) Footer social icons
`Customize → Footer` → add your social links, or set them in
`Theme settings → Social media`:
- Facebook: `https://www.facebook.com/supermarketmcq`
- Instagram: `https://www.instagram.com/supermarketmcq/`

---

## 3. SEO

Set per-page in `Online Store → Preferences` (homepage) and each page’s
*Search engine listing*:

- **Meta title:** `Supermarket in Western Australia | MCQ Supermarket`
- **Meta description:** `Explore MCQ Supermarket in Western Australia for fresh produce, international groceries, and unbeatable value.`
- **Keywords / focus:** fresh produce, international groceries, Western Australia, MCQ Supermarket

The FAQ section also outputs **FAQPage structured data** automatically for
rich results in Google.

---

## 4. Brand + business details baked in

- Phone: **08 9248 5623**
- Branches: **Malaga, Morley (Coventry Village), Armadale, Subiaco, Mirrabooka** — all WA
- Colours: green `#99C547`, orange `#F7A933`, purple `#8C3493` (editable per section)

---

## 5. Reverting

Everything is namespaced and additive. To roll back the homepage to the
original Horizon layout, restore `templates/index.json` from the first commit:

```bash
git checkout <first-commit> -- templates/index.json
```
