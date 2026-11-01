# Prime Circle — Design System

**Prime Circle** is *a mesa profissional do mercado imobiliário* — the professional table of
the Brazilian real-estate market. A digital infrastructure where brokers, agencies and developers
operate with **autonomy**: valuations from real data (never guesswork), listings with context and
clear controls, and legal certainty from listing to closing.

> Anchor line: *"Você não precisa de mais um grupo. Precisa de uma mesa."*

This design system lets any agent produce on-brand Prime Circle work — sites, app screens, slides,
social, print — that sits **alongside** other systems (e.g. Godoy Prime Realty) and can be chosen
when the work calls for the Prime Circle brand.

---

## Sources
Built from the in-project Prime Circle brand package (v1.0, May 2026):
- `brand-assets/` — original logo SVG/PNG, favicons, social, DTCG tokens, `head-snippet.html`.
- `PRIME-CIRCLE-BRAND-SPEC.md` — the single-file brand brief.
- `Prime Circle - Brand Board.html` / `Prime Circle - Manual de Marca.html` — the 17-panel board and 20-slide manual.
- `pc-connection.jsx`, `pc-artboards-*.jsx` — the connection-mark system and application artboards.

Domain: **primecircle.app.br** · contato@primecircle.app.br · Language: **Português do Brasil**.

---

## CONTENT FUNDAMENTALS — how Prime Circle writes

Voice: **discreta, precisa, decisiva** (discreet, precise, decisive). The reader is a working
professional, addressed as a peer ("entre nós, profissionais"), never as a lead to convert.

- **Facts over adjectives.** Real numbers carry the message: *"Cobertura 340m². R$ 12.8M. Parceria 50/50."* If a line could appear in a classifieds flyer, rewrite it.
- **Data, documented.** *"Avaliação por 12 comparáveis. Não palpite."* / *"Parceria registrada antes do primeiro contato."*
- **Plural & identified.** Every piece of information points back to a named professional. A collective of identified people, never anonymous.
- **No euphoria.** No "imperdível", "imbatível", shouting CAPS, fabricated urgency, or "soluções/experiências únicas".
- **No emoji. Ever.** Not in product, not in social, not next to the mark.
- **Casing:** sentence case for prose; UPPERCASE only for mono labels/eyebrows (with wide tracking). Titles lean on Cormorant italic for the emotional beat; mono for the factual beat (prices, m², IDs, CRECI numbers).
- **Portuguese (BR)** throughout. The `·` middot is the house separator in labels and metadata.

---

## VISUAL FOUNDATIONS

- **Mood:** editorial, dark-first, quietly luxurious — closer to a members' club imprint than a property portal. Restrained, never flashy.
- **Color:** Ink `#0E0E0E` dominant; Gold `#C9A84C` accent on dark, Gold-Deep `#8B7340` accent on light; Ivory `#F5F1E6` warm paper; Sand `#E8E0CC` tertiary. **60·30·10** (Ink / Ivory / Gold). Pick the gold by surface: bright gold on dark, deep gold on light.
- **Type — three voices:** Cormorant Garamond (display, frequently *italic*, `font-weight:500`, tracking `-0.01em`, leading `~0.98`); Manrope (wordmark bold 700 + body + UI); JetBrains Mono (eyebrows, IDs, prices, metadata — UPPERCASE, tracking `0.3–0.4em`).
- **Backgrounds:** flat Ink or flat Ivory blocks — **no gradients, no photos behind text, no textures.** The one decorative motif is **faint concentric gold rings** (`opacity 0.05–0.06`, `stroke-width 1`) bleeding off a corner. Decorative only, never content.
- **Eyebrows:** nearly every title is preceded by a mono, tracked, gold kicker, often with an index/ID (`OPORTUNIDADE · #4128`).
- **Metadata:** dashed-rule spec sheets — mono label left, Cormorant-italic value right, `1px dashed` divider between. A signature pattern.
- **Cards:** flat fills with a hairline border (`rgba(...,0.10)`), radius `10px` on UI; soft large shadow on dark (`0 40px 80px -30px rgba(0,0,0,.7)`), medium on light. Print/premium pieces use **sharp corners**.
- **Borders:** hairline `rgba(245,241,230,0.10)` on dark, `rgba(14,14,14,0.10)` on light; dashed variant for metadata.
- **Buttons:** always **pill** (`border-radius:999px`). One gold-fill primary per view; everything else outline / ghost / mono-chip ("+ NOVA").
- **Radii:** `4 / 6 / 10 / 16` + pill. **Spacing:** 4px grid (`4 8 12 16 24 32 48 64 96`).
- **Motion:** minimal and editorial — short fades and tints (`~140–240ms`, ease `cubic-bezier(.22,.61,.36,1)`). No bounces, no infinite loops on content.
- **Hover:** row/surface gets a subtle Ink-2 tint or slight opacity lift. **Press:** color shift, no shrink. No glow.
- **Transparency/blur:** used sparingly — modal scrims `rgba(0,0,0,.55)`; no frosted-glass aesthetic.
- **Imagery vibe:** when photos appear they are warm, architectural, low-key; never stocky or over-saturated. Text never sits directly on busy imagery.

---

## v2 — MODERNIZAÇÃO (out/2026)

**Princípio: impresso, não gerado.** A referência é material editorial impresso — ficha técnica, planta de arquitetura, relatório anual — nunca o template de landing page de IA.

**Nunca:** halo/gradiente atrás de título · texto com gradiente · cards de vidro com blur · grade de 3 features com ícone em quadrado arredondado · faixa de números inventados · animação em loop, parallax, fade-up em tudo · hero centralizado sobre fundo genérico · renders 3D / imagens geradas.

**Sempre:** grid assimétrico de 12 colunas alinhado à esquerda · linhas finas e fichas tracejadas · dados reais com fonte e data · números em mono tabular · fotografia real e quente · movimento de desenho (uma vez e para) · Ink chapado + grain sutil · hierarquia por escala tipográfica.

- **Escalas OKLCH:** `--pc-gold-50…900` (500 = Gold, 700 = Gold Deep) e `--pc-neutral-50…950` (50 = Ivory, 100 = Sand, 950 = Ink).
- **Superfícies escuras:** `--pc-surface-0…3` (página → seção → card → dialog) com `--pc-elev-1…3` (hairline clara no topo + sombra profunda).
- **Status quentes:** `--pc-success` (sálvia), `--pc-warning` (âmbar), `--pc-danger` (terracota), `--pc-info` (ardósia), cada um com `-bg` e `-deep`.
- **Tipo fluido:** `--pc-fs-hero` clamp(64→168px), leading 0.88, tracking −0.025em; display/title/h1/h2/lead também fluidos. `.pc-hero`, `.pc-num`.
- **Grain:** `.pc-grain` (3,5%) / `.pc-grain-strong` (6%) — somente sobre Ink; nunca sobre fotos ou corpo de texto em Ivory.
- **Foco:** `--pc-focus-ring` (anel duplo dourado), `.pc-focusable` com `:focus-visible`.
- **Movimento:** `--pc-ease-out`, `--pc-dur-slow` 600ms, `--pc-dur-reveal` 900ms. Keyframes `pc-draw`, `pc-rule-extend`, `pc-fade-in`, `pc-toast-in`. Tudo roda uma vez; `prefers-reduced-motion` respeitado.
- **Fotografia:** arquitetura, materiais, luz lateral ou fim de tarde; pessoas reais e identificadas. Grade `.pc-photo` (`--pc-photo-filter`), proteção `--pc-photo-scrim`. Recortes 4:5 feed · 3:2 site · 1:1. Proibido: renders, IA generativa, HDR, céu trocado, drone genérico.
- **Ícones:** componente `<Icon>` (Lucide 0.469 via CDN, traço 1.5). Só funcional — nunca decorativo em caixas.

---

## ICONOGRAPHY
Prime Circle is **glyph-light**. The connection mark itself does most of the iconographic work
(list-row markers, avatars, favicons, card corners). There is **no decorative icon set** and **no emoji**.

- The brand **symbol** is delivered as SVG in `assets/logo/svg/` and reproduced by the `<Mark>` component — always one accent ring + one neutral ring + a center dot; **never** fill both rings.
- For functional UI icons (close ×, chevrons, search) use a thin, minimal line set. If a CDN set is needed, prefer **Lucide** (1.5–2px stroke) to match the hairline aesthetic — and flag the substitution, since the source brand ships no icon font.
- Mono glyphs/separators (`·`, `×`, `+`) stand in for many micro-icons by design.

Logos, favicons and social images live under `assets/` (copied from the original brand package).

---

## VISUAL ASSETS (`assets/`)
- `assets/logo/svg/` — horizontal / vertical / inline lockups + symbols (duotone, mono ink/ivory/gold, filled), on light & dark.
- `assets/logo/png/` — raster lockups & symbols at multiple sizes.
- `assets/favicon/` — `favicon.svg`, PNG favicons, apple-touch, PWA icons, `site.webmanifest`.
- `assets/social/` — `og-image.png` (1200×630), `og-image-square.png` (1200×1200).
- `assets/photography/` — reference shoot **Quintas do Rio** (8 photos, 2000px web JPEGs, ungraded): `qr-fachada`, `qr-entrada`, `qr-mezanino`, `qr-salao`, `qr-suite`, `qr-banho`, `qr-banho-claraboia`, `qr-bancada`. Always render with `.pc-photo` / `filter: var(--pc-photo-filter)` — the grade was calibrated on this set (neutralizes the green interior cast, mutes the sky).

---

## INDEX / manifest

**Root**
- `styles.css` — the entry point consumers link. Imports Google Fonts + all token files.
- `readme.md` — this file. · `SKILL.md` — Agent-Skills wrapper.

**`tokens/`** — `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `texture.css` (all `--pc-*`).

**`components/`** (React primitives, each with `.jsx` + `.d.ts` + `.prompt.md`)
- `brand/` — **Mark**, **Lockup**
- `core/` — **Button**, **Badge**, **Card**, **Eyebrow**, **MetaRow**, **Icon**
- `forms/` — **Input**, **Select**, **Checkbox**, **Switch**
- `navigation/` — **Topbar**, **Tabs**
- `feedback/` — **Dialog**, **Toast**, **Tooltip**
- `data/` — **PropertyCard**, **Stat**, **Table**, **Avatar**
- `motion/` — **DrawnRings**, **CountUp**, **Reveal**

**`ui_kits/dashboard/`** — interactive Prime Circle member workspace (sign-in → demands → partnership).

**`templates/`** — `dashboard/` (Dashboard), `landing/` (Landing page), `deck/` (Apresentação 16:9), `social/` (feed 4:5, story 9:16, 1:1), `email/` (notificação 600px).

**`guidelines/`** — specimen cards feeding the Design System tab (Colors, Type, Spacing, Brand).

---

## Caveats
- **Fonts** are loaded from Google Fonts (Cormorant Garamond, Manrope, JetBrains Mono) via `@import` in `styles.css` — all three are free and Google-hosted, so no binaries are bundled. If you need fully-offline/self-hosted fonts, add the `.woff2` files and `@font-face` rules.
- Functional UI icons beyond the brand mark are **not** part of the source package; use Lucide as the documented substitute.
