/* @ds-bundle: {"format":4,"namespace":"DesignSystem_0d6c1f","components":[{"name":"Lockup","sourcePath":"components/brand/Lockup.jsx"},{"name":"Mark","sourcePath":"components/brand/Mark.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"MetaRow","sourcePath":"components/core/MetaRow.jsx"},{"name":"Avatar","sourcePath":"components/data/Avatar.jsx"},{"name":"PropertyCard","sourcePath":"components/data/PropertyCard.jsx"},{"name":"Stat","sourcePath":"components/data/Stat.jsx"},{"name":"Table","sourcePath":"components/data/Table.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"CountUp","sourcePath":"components/motion/CountUp.jsx"},{"name":"DrawnRings","sourcePath":"components/motion/DrawnRings.jsx"},{"name":"Reveal","sourcePath":"components/motion/Reveal.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Topbar","sourcePath":"components/navigation/Topbar.jsx"}],"sourceHashes":{"brand-board-app.jsx":"d726100e984a","components/brand/Lockup.jsx":"0c7fabd700cf","components/brand/Mark.jsx":"686582aef56e","components/core/Badge.jsx":"b33f5652217a","components/core/Button.jsx":"c10efc9dc144","components/core/Card.jsx":"821bb35751ca","components/core/Eyebrow.jsx":"56791e1f4e40","components/core/Icon.jsx":"08a86d4b24e8","components/core/MetaRow.jsx":"872470041ef2","components/data/Avatar.jsx":"d8b4481b84f1","components/data/PropertyCard.jsx":"ee16460f5dcc","components/data/Stat.jsx":"aebdb0b37e89","components/data/Table.jsx":"87b5dbb38764","components/feedback/Dialog.jsx":"283790e1f451","components/feedback/Toast.jsx":"3cc896e7f2e4","components/feedback/Tooltip.jsx":"0fa818820a45","components/forms/Checkbox.jsx":"6ed59ba5dcd1","components/forms/Input.jsx":"321b329c056c","components/forms/Select.jsx":"4f82d3f4eb8c","components/forms/Switch.jsx":"e328e1ffb0c9","components/motion/CountUp.jsx":"57e6d6c615eb","components/motion/DrawnRings.jsx":"6ed84657edd6","components/motion/Reveal.jsx":"9159f63a8707","components/navigation/Tabs.jsx":"49108f76ef64","components/navigation/Topbar.jsx":"754eb990a9dd","deck-stage.js":"d8d952171670","design-canvas.jsx":"c9095ef15594","pc-artboards-apps.jsx":"26b4a27df412","pc-artboards-construction.jsx":"8906cc4fe49f","pc-artboards-logo.jsx":"ebe689ee9d17","pc-artboards-system.jsx":"e7afda972783","pc-connection.jsx":"1951d1398918","ui_kits/dashboard/app.jsx":"737414e40140"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DesignSystem_0d6c1f = window.DesignSystem_0d6c1f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// brand-board-app.jsx
try { (() => {
/* Prime Circle — Brand Board App
   Sistema focado no Connection Mark (escolhido).
*/

function BrandBoard() {
  return /*#__PURE__*/React.createElement(DesignCanvas, {
    title: "Prime Circle \xB7 Connection Mark System",
    subtitle: "Identidade visual focada \xB7 v2.0 \xB7 17 pain\xE9is"
  }, /*#__PURE__*/React.createElement(DCSection, {
    id: "intro",
    title: "Introdu\xE7\xE3o",
    subtitle: "Capa, conceito do s\xEDmbolo & pilares"
  }, /*#__PURE__*/React.createElement(DCArtboard, {
    id: "cover",
    label: "01 \xB7 Cover",
    width: 1600,
    height: 900
  }, /*#__PURE__*/React.createElement(PCArtCover, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "pillars",
    label: "02 \xB7 Quatro promessas",
    width: 1700,
    height: 1000
  }, /*#__PURE__*/React.createElement(PCArtPillars, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "concept",
    label: "03 \xB7 Conceito do s\xEDmbolo",
    width: 1500,
    height: 900
  }, /*#__PURE__*/React.createElement(PCArtConcept, null))), /*#__PURE__*/React.createElement(DCSection, {
    id: "lockups",
    title: "Lockups",
    subtitle: "Tr\xEAs vers\xF5es oficiais para todos os contextos"
  }, /*#__PURE__*/React.createElement(DCArtboard, {
    id: "lockup-h",
    label: "03 \xB7 Lockup horizontal",
    width: 1500,
    height: 800
  }, /*#__PURE__*/React.createElement(PCArtLockupH, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "lockup-v",
    label: "04 \xB7 Lockup vertical",
    width: 1200,
    height: 900
  }, /*#__PURE__*/React.createElement(PCArtLockupV, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "lockup-inline",
    label: "05 \xB7 Lockup inline",
    width: 1400,
    height: 700
  }, /*#__PURE__*/React.createElement(PCArtLockupInline, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "symbol-only",
    label: "06 \xB7 S\xEDmbolo isolado",
    width: 1500,
    height: 900
  }, /*#__PURE__*/React.createElement(PCArtSymbolOnly, null))), /*#__PURE__*/React.createElement(DCSection, {
    id: "rules",
    title: "Constru\xE7\xE3o & regras",
    subtitle: "Grid, prote\xE7\xE3o, variantes em fundos"
  }, /*#__PURE__*/React.createElement(DCArtboard, {
    id: "construction",
    label: "07 \xB7 Constru\xE7\xE3o \xB7 grid",
    width: 1600,
    height: 1050
  }, /*#__PURE__*/React.createElement(PCArtConstruction, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "clearspace",
    label: "08 \xB7 Prote\xE7\xE3o \xB7 redu\xE7\xE3o",
    width: 1600,
    height: 1050
  }, /*#__PURE__*/React.createElement(PCArtClearspace, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "backgrounds",
    label: "09 \xB7 Cores & fundos",
    width: 1700,
    height: 1000
  }, /*#__PURE__*/React.createElement(PCArtOnBackgrounds, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "wrong",
    label: "10 \xB7 Usos incorretos",
    width: 1700,
    height: 1000
  }, /*#__PURE__*/React.createElement(PCArtWrongUses, null))), /*#__PURE__*/React.createElement(DCSection, {
    id: "system",
    title: "Sistema visual",
    subtitle: "Cor & tipografia"
  }, /*#__PURE__*/React.createElement(DCArtboard, {
    id: "colors",
    label: "11 \xB7 Paleta",
    width: 1600,
    height: 1000
  }, /*#__PURE__*/React.createElement(PCArtColors, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "type",
    label: "12 \xB7 Tipografia",
    width: 1700,
    height: 1050
  }, /*#__PURE__*/React.createElement(PCArtTypography, null))), /*#__PURE__*/React.createElement(DCSection, {
    id: "applications",
    title: "Aplica\xE7\xF5es",
    subtitle: "Provas reais em m\xEDdia"
  }, /*#__PURE__*/React.createElement(DCArtboard, {
    id: "card",
    label: "13 \xB7 Cart\xE3o de membro",
    width: 1400,
    height: 800
  }, /*#__PURE__*/React.createElement(PCArtCard, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "social",
    label: "14 \xB7 Instagram \xB7 3 posts",
    width: 1400,
    height: 700
  }, /*#__PURE__*/React.createElement(PCArtSocial, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "appicon",
    label: "15 \xB7 App Icon",
    width: 1200,
    height: 700
  }, /*#__PURE__*/React.createElement(PCArtAppIcon, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "email",
    label: "16 \xB7 Assinatura de e-mail",
    width: 1600,
    height: 950
  }, /*#__PURE__*/React.createElement(PCArtEmailSignature, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "app",
    label: "17 \xB7 Produto \xB7 dashboard",
    width: 1800,
    height: 1000
  }, /*#__PURE__*/React.createElement(PCArtAppPreview, null)), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "poster",
    label: "18 \xB7 P\xF4steres editoriais",
    width: 1400,
    height: 780
  }, /*#__PURE__*/React.createElement(PCArtPoster, null))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(BrandBoard, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "brand-board-app.jsx", error: String((e && e.message) || e) }); }

// components/brand/Mark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Prime Circle "Connection Mark" — two interlocking circles + a center dot.
 * Two parties meeting at a table; the dot is the point of agreement.
 * RULE: never fill both circles — always one accent ring, one neutral ring, + dot.
 */
function Mark({
  size = 100,
  variant = "duotone",
  color = "var(--pc-ink)",
  accent = "var(--pc-gold)",
  strokeWidth = 3,
  ...rest
}) {
  const sw = strokeWidth;
  if (variant === "minimal") {
    return /*#__PURE__*/React.createElement("svg", _extends({
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      fill: "none",
      role: "img",
      "aria-label": "Prime Circle"
    }, rest), /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "50",
      r: "42",
      stroke: color,
      strokeWidth: sw * 1.6
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "50",
      r: "6",
      fill: accent
    }));
  }
  if (variant === "filled") {
    return /*#__PURE__*/React.createElement("svg", _extends({
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      fill: "none",
      role: "img",
      "aria-label": "Prime Circle"
    }, rest), /*#__PURE__*/React.createElement("circle", {
      cx: "36",
      cy: "50",
      r: "30",
      fill: accent
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "64",
      cy: "50",
      r: "30",
      stroke: color,
      strokeWidth: sw,
      fill: "none"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "50",
      r: "4",
      fill: color
    }));
  }
  if (variant === "mono") {
    return /*#__PURE__*/React.createElement("svg", _extends({
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      fill: "none",
      role: "img",
      "aria-label": "Prime Circle"
    }, rest), /*#__PURE__*/React.createElement("circle", {
      cx: "36",
      cy: "50",
      r: "30",
      stroke: color,
      strokeWidth: sw
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "64",
      cy: "50",
      r: "30",
      stroke: color,
      strokeWidth: sw,
      opacity: "0.55"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "50",
      r: "3.5",
      fill: color
    }));
  }
  // duotone (default)
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    fill: "none",
    role: "img",
    "aria-label": "Prime Circle"
  }, rest), /*#__PURE__*/React.createElement("circle", {
    cx: "36",
    cy: "50",
    r: "30",
    stroke: accent,
    strokeWidth: sw
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "64",
    cy: "50",
    r: "30",
    stroke: color,
    strokeWidth: sw
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "3.5",
    fill: accent
  }));
}
Object.assign(__ds_scope, { Mark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Mark.jsx", error: String((e && e.message) || e) }); }

// components/brand/Lockup.jsx
try { (() => {
/**
 * Prime Circle wordmark + lockups. "Prime Circle" in Manrope bold, tight tracking.
 * Mono sublabel below ("REAL ESTATE NETWORK"). Three layouts via `layout`.
 */
function Lockup({
  layout = "horizontal",
  size = 360,
  color = "var(--pc-ink)",
  accent = "var(--pc-gold)",
  sublabel = "REAL ESTATE NETWORK",
  showSublabel = true
}) {
  // On a given neutral color, the sublabel uses the deep gold for light contexts.
  const subColor = accent === "var(--pc-gold)" ? "var(--pc-gold-deep)" : accent;
  const Wordmark = ({
    s,
    align = "flex-start"
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: align,
      gap: s * 0.025
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--pc-font-sans)",
      fontSize: s * 0.42,
      fontWeight: 700,
      letterSpacing: "-0.025em",
      color,
      lineHeight: 1
    }
  }, "Prime Circle"), showSublabel && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: s * 0.085,
      letterSpacing: "0.32em",
      color: subColor,
      textTransform: "uppercase"
    }
  }, sublabel));
  if (layout === "vertical") {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: size * 0.07
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Mark, {
      size: size * 0.48,
      color: color,
      accent: accent,
      strokeWidth: 3
    }), /*#__PURE__*/React.createElement(Wordmark, {
      s: size * 0.55,
      align: "center"
    }));
  }
  if (layout === "inline") {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.05
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Mark, {
      size: size * 0.18,
      color: color,
      accent: accent,
      strokeWidth: 3.5
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--pc-font-sans)",
        fontSize: size * 0.16,
        fontWeight: 700,
        letterSpacing: "-0.025em",
        color,
        lineHeight: 1
      }
    }, "Prime Circle"));
  }

  // horizontal (default)
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.07
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Mark, {
    size: size * 0.32,
    color: color,
    accent: accent,
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement(Wordmark, {
    s: size * 0.5
  }));
}
Object.assign(__ds_scope, { Lockup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Lockup.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Prime Circle badge / tag. Monospace, tracked, pill outline — used for metadata
 * like area, price, partnership split (e.g. "340 m²", "50/50", "4 SUÍTES").
 */
function Badge({
  tone = "accent",
  theme = "dark",
  solid = false,
  children,
  style,
  ...rest
}) {
  const light = theme === "light";
  const accent = light ? "var(--pc-gold-deep)" : "var(--pc-gold)";
  const muted = light ? "var(--pc-text-light-muted)" : "var(--pc-text-muted)";
  const borderMuted = light ? "var(--pc-border-light-strong)" : "var(--pc-border-strong)";
  const color = tone === "accent" ? accent : muted;
  const borderColor = tone === "accent" ? accent : borderMuted;
  const base = {
    display: "inline-flex",
    alignItems: "center",
    fontFamily: "var(--pc-font-mono)",
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    padding: "5px 11px",
    borderRadius: "var(--pc-radius-pill)",
    lineHeight: 1,
    whiteSpace: "nowrap"
  };
  const skin = solid ? {
    background: accent,
    color: "var(--pc-ink)",
    border: "1px solid transparent"
  } : {
    background: "transparent",
    color,
    border: `1px solid ${borderColor}`
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...skin,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Prime Circle button. Restrained, editorial. Gold is reserved for the primary action.
 */
function Button({
  variant = "primary",
  size = "md",
  theme = "dark",
  as = "button",
  children,
  style,
  ...rest
}) {
  const pad = size === "sm" ? "8px 16px" : size === "lg" ? "16px 32px" : "12px 24px";
  const fs = size === "sm" ? 12 : size === "lg" ? 15 : 13;
  const light = theme === "light";
  const accent = light ? "var(--pc-gold-deep)" : "var(--pc-gold)";
  const ink = "var(--pc-ink)";
  const ivory = "var(--pc-ivory)";
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--pc-font-sans)",
    fontWeight: 600,
    fontSize: fs,
    letterSpacing: "0.01em",
    padding: pad,
    borderRadius: "var(--pc-radius-pill)",
    cursor: "pointer",
    transition: "all var(--pc-dur) var(--pc-ease)",
    textDecoration: "none",
    border: "1px solid transparent",
    whiteSpace: "nowrap"
  };
  const variants = {
    primary: {
      background: accent,
      color: ink,
      borderColor: accent
    },
    secondary: {
      background: "transparent",
      color: light ? ink : ivory,
      borderColor: light ? "var(--pc-border-light-strong)" : "var(--pc-border-strong)"
    },
    ghost: {
      background: "transparent",
      color: accent,
      borderColor: "transparent"
    },
    // mono "chip" CTA: monospaced, the recurring "+ NOVA" treatment
    mono: {
      background: "transparent",
      color: accent,
      borderColor: accent,
      fontFamily: "var(--pc-font-mono)",
      fontWeight: 500,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      fontSize: fs - 2
    }
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Prime Circle surface card. Dark-first; pass theme="light" for ivory paper.
 * Optional ring-bleed decoration (faint concentric gold rings off one corner).
 */
function Card({
  theme = "dark",
  elevated = false,
  rings = false,
  padding = 32,
  children,
  style,
  ...rest
}) {
  const light = theme === "light";
  const bg = light ? elevated ? "var(--pc-bg-light-elevated)" : "var(--pc-bg-light)" : elevated ? "var(--pc-bg-elevated)" : "var(--pc-ink)";
  const color = light ? "var(--pc-text-light)" : "var(--pc-text)";
  const border = light ? "var(--pc-border-light)" : "var(--pc-border)";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      overflow: "hidden",
      background: bg,
      color,
      border: `1px solid ${border}`,
      borderRadius: "var(--pc-radius-lg)",
      padding,
      boxShadow: light ? "var(--pc-shadow-md)" : "var(--pc-shadow-dark-lg)",
      ...style
    }
  }, rest), rings && /*#__PURE__*/React.createElement("svg", {
    width: "320",
    height: "320",
    viewBox: "0 0 320 320",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      right: -120,
      bottom: -120,
      pointerEvents: "none"
    }
  }, [150, 116, 82, 48].map(r => /*#__PURE__*/React.createElement("circle", {
    key: r,
    cx: "160",
    cy: "160",
    r: r,
    fill: "none",
    stroke: light ? "var(--pc-gold-deep)" : "var(--pc-gold)",
    strokeWidth: "1",
    opacity: "0.06"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Mono eyebrow label — uppercase, tracked, gold. Sits above titles and section heads.
 */
function Eyebrow({
  theme = "dark",
  children,
  style,
  ...rest
}) {
  const light = theme === "light";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: "0.4em",
      textTransform: "uppercase",
      color: light ? "var(--pc-gold-deep)" : "var(--pc-gold)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LUCIDE_SRC = "https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js";
let loading = null;
function loadLucide() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.lucide) return Promise.resolve(window.lucide);
  if (!loading) {
    loading = new Promise(res => {
      const s = document.createElement("script");
      s.src = LUCIDE_SRC;
      s.onload = () => res(window.lucide);
      s.onerror = () => res(null);
      document.head.appendChild(s);
    });
  }
  return loading;
}

/**
 * Functional UI icon. Lucide (CDN) at a hairline 1.5 stroke, sized to text.
 * Name is the Lucide PascalCase name, e.g. "Search", "ArrowUpRight", "MapPin".
 */
function Icon({
  name,
  size = 18,
  strokeWidth = 1.5,
  color = "currentColor",
  style,
  ...rest
}) {
  const [lib, setLib] = React.useState(typeof window !== "undefined" ? window.lucide : null);
  React.useEffect(() => {
    if (!lib) loadLucide().then(setLib);
  }, []);
  let node = lib && lib.icons && lib.icons[name];
  if (node && node[0] === "svg") node = node[2];
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      display: "inline-block",
      verticalAlign: "middle",
      ...style
    }
  }, rest), node ? node.map(([tag, attrs], i) => React.createElement(tag, {
    key: i,
    ...attrs
  })) : null);
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/MetaRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Dashed metadata row — label (mono) left, value (italic display) right,
 * separated by a dashed rule. The recurring Prime Circle spec-sheet motif.
 */
function MetaRow({
  label,
  value,
  theme = "dark",
  last = false,
  style,
  ...rest
}) {
  const light = theme === "light";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      paddingBottom: 8,
      borderBottom: last ? "none" : light ? "var(--pc-divider-dashed-light)" : "var(--pc-divider-dashed)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: 10,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: light ? "var(--pc-gold-deep)" : "var(--pc-gold-deep)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-display)",
      fontStyle: "italic",
      fontSize: 20,
      color: light ? "var(--pc-text-light)" : "var(--pc-text)"
    }
  }, value));
}
Object.assign(__ds_scope, { MetaRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/MetaRow.jsx", error: String((e && e.message) || e) }); }

// components/data/Avatar.jsx
try { (() => {
/**
 * A named professional. Photo or Cormorant-italic initials inside a hairline ring; optional status dot.
 */
function Avatar({
  name = "",
  src,
  size = 40,
  status,
  ring = "neutral",
  style
}) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const ringC = ring === "accent" ? "var(--pc-gold)" : "var(--pc-border-strong)";
  const dot = {
    online: "var(--pc-success)",
    away: "var(--pc-warning)",
    busy: "var(--pc-danger)"
  }[status];
  return /*#__PURE__*/React.createElement("span", {
    title: name,
    style: {
      position: "relative",
      display: "inline-grid",
      placeItems: "center",
      width: size,
      height: size,
      borderRadius: 999,
      flexShrink: 0,
      background: "var(--pc-surface-3)",
      boxShadow: `0 0 0 1px ${ringC}`,
      color: "var(--pc-ivory)",
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      borderRadius: 999,
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-display)",
      fontStyle: "italic",
      fontWeight: 500,
      fontSize: size * 0.42,
      lineHeight: 1
    }
  }, initials), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 0,
      bottom: 0,
      width: Math.max(8, size * 0.22),
      height: Math.max(8, size * 0.22),
      borderRadius: 999,
      background: dot,
      boxShadow: "0 0 0 2px var(--pc-ink)"
    }
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data/PropertyCard.jsx
try { (() => {
const TONE = {
  success: "var(--pc-success)",
  warning: "var(--pc-warning)",
  danger: "var(--pc-danger)",
  info: "var(--pc-info)",
  accent: "var(--pc-gold)"
};

/**
 * A listing as a spec sheet: photo (or neutral slot), mono ID eyebrow, Cormorant title, dashed spec rows, mono price.
 * specs: [{ label, value }]
 */
function PropertyCard({
  image,
  id,
  title,
  location,
  price,
  specs = [],
  status,
  statusTone = "accent",
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const tc = TONE[statusTone] || TONE.accent;
  return /*#__PURE__*/React.createElement("article", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "grid",
      background: "var(--pc-surface-2)",
      color: "var(--pc-ivory)",
      borderRadius: "var(--pc-radius-lg)",
      overflow: "hidden",
      border: `1px solid ${hover ? "var(--pc-border-strong)" : "var(--pc-border)"}`,
      boxShadow: "var(--pc-elev-2)",
      cursor: onClick ? "pointer" : "default",
      transition: "border-color var(--pc-dur) var(--pc-ease)",
      fontFamily: "var(--pc-font-sans)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "4 / 3",
      background: "var(--pc-surface-3)",
      overflow: "hidden"
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      transform: hover ? "scale(1.025)" : "none",
      transition: "transform var(--pc-dur-reveal) var(--pc-ease-out)"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--pc-font-mono)",
      fontSize: 10,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: "var(--pc-neutral-500)"
    }
  }, "Foto do im\xF3vel"), status && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 14,
      left: 14,
      fontFamily: "var(--pc-font-mono)",
      fontSize: 10,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      padding: "5px 10px",
      borderRadius: 999,
      background: "var(--pc-ink)",
      color: tc,
      border: `1px solid ${tc}`
    }
  }, status)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22,
      display: "grid",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, id && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: 10,
      letterSpacing: "0.32em",
      textTransform: "uppercase",
      color: "var(--pc-gold)",
      marginBottom: 8
    }
  }, id), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--pc-font-display)",
      fontWeight: 500,
      fontSize: 28,
      lineHeight: 1.02,
      letterSpacing: "-0.01em"
    }
  }, title), location && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--pc-neutral-400)",
      marginTop: 6
    }
  }, location)), specs.length > 0 && /*#__PURE__*/React.createElement("div", null, specs.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      padding: "7px 0",
      borderBottom: i < specs.length - 1 ? "1px dashed var(--pc-border-strong)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: 10,
      letterSpacing: "0.26em",
      textTransform: "uppercase",
      color: "var(--pc-gold-deep)"
    }
  }, s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-display)",
      fontStyle: "italic",
      fontSize: 18
    }
  }, s.value)))), price && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      paddingTop: 14,
      borderTop: "1px solid var(--pc-border-strong)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: 10,
      letterSpacing: "0.26em",
      textTransform: "uppercase",
      color: "var(--pc-neutral-400)"
    }
  }, "Valor"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontVariantNumeric: "tabular-nums",
      fontSize: 20,
      color: "var(--pc-gold)"
    }
  }, price))));
}
Object.assign(__ds_scope, { PropertyCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/PropertyCard.jsx", error: String((e && e.message) || e) }); }

// components/data/Table.jsx
try { (() => {
/**
 * Hairline data table. Mono uppercase headers, dashed row rules, mono tabular numbers.
 * columns: [{ key, label, align?, mono?, width?, render?(row) }]
 */
function Table({
  columns = [],
  rows = [],
  onRowClick,
  theme = "dark",
  dense = false,
  style
}) {
  const [hover, setHover] = React.useState(-1);
  const isLight = theme === "light";
  const fg = isLight ? "var(--pc-ink)" : "var(--pc-ivory)";
  const rule = isLight ? "var(--pc-border-light)" : "var(--pc-border)";
  const pad = dense ? "10px 12px" : "16px 12px";
  return /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "var(--pc-font-sans)",
      fontSize: 14,
      color: fg,
      ...style
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      textAlign: c.align || "left",
      width: c.width,
      padding: "0 12px 12px",
      fontFamily: "var(--pc-font-mono)",
      fontWeight: 400,
      fontSize: 10,
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: isLight ? "var(--pc-gold-deep)" : "var(--pc-gold)",
      borderBottom: `1px solid ${isLight ? "var(--pc-border-light-strong)" : "var(--pc-border-strong)"}`
    }
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: r.id ?? i,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(-1),
    onClick: () => onRowClick && onRowClick(r),
    style: {
      cursor: onRowClick ? "pointer" : "default",
      background: hover === i ? isLight ? "rgba(14,14,14,0.03)" : "rgba(245,241,230,0.03)" : "transparent",
      transition: "background var(--pc-dur-fast) var(--pc-ease)"
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      textAlign: c.align || "left",
      padding: pad,
      borderBottom: `1px dashed ${rule}`,
      fontFamily: c.mono ? "var(--pc-font-mono)" : "inherit",
      fontVariantNumeric: c.mono ? "tabular-nums" : "normal",
      fontSize: c.mono ? 13 : 14
    }
  }, c.render ? c.render(r) : r[c.key]))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Table.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
/**
 * Modal dialog on surface-3 with an ink scrim. Mono eyebrow, Cormorant title, actions bottom-right.
 * Closes on Escape and scrim click.
 */
function Dialog({
  open,
  onClose,
  eyebrow,
  title,
  children,
  actions,
  width = 520
}) {
  React.useEffect(() => {
    if (!open) return;
    const k = e => e.key === "Escape" && onClose && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      display: "grid",
      placeItems: "center",
      padding: 24,
      background: "var(--pc-surface-overlay)",
      animation: "pc-fade-in var(--pc-dur) var(--pc-ease) both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: width,
      background: "var(--pc-surface-3)",
      color: "var(--pc-ivory)",
      borderRadius: "var(--pc-radius-xl)",
      border: "1px solid var(--pc-border)",
      boxShadow: "var(--pc-elev-3)",
      padding: 32,
      fontFamily: "var(--pc-font-sans)",
      animation: "pc-toast-in var(--pc-dur-slow) var(--pc-ease-out) both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: 10,
      letterSpacing: "0.34em",
      textTransform: "uppercase",
      color: "var(--pc-gold)",
      marginBottom: 12
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--pc-font-display)",
      fontWeight: 500,
      fontSize: 34,
      lineHeight: 1,
      letterSpacing: "-0.01em"
    }
  }, title)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Fechar",
    className: "pc-focusable",
    style: {
      background: "none",
      border: "1px solid var(--pc-border-strong)",
      color: "var(--pc-ivory)",
      width: 34,
      height: 34,
      borderRadius: 999,
      display: "grid",
      placeItems: "center",
      cursor: "pointer",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "X",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      fontSize: 15,
      lineHeight: 1.6,
      color: "var(--pc-ivory-2)"
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 12,
      marginTop: 28,
      paddingTop: 20,
      borderTop: "1px dashed var(--pc-border-strong)"
    }
  }, actions)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const TONES = {
  neutral: "var(--pc-gold)",
  success: "var(--pc-success)",
  warning: "var(--pc-warning)",
  danger: "var(--pc-danger)",
  info: "var(--pc-info)"
};

/**
 * Short confirmation on surface-3. A 2px tone rule on top, mono label, one line of fact.
 * Position it yourself (e.g. fixed bottom-right).
 */
function Toast({
  tone = "neutral",
  label,
  message,
  onClose,
  style
}) {
  const c = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
      width: 360,
      maxWidth: "100%",
      padding: "16px 16px 16px 18px",
      background: "var(--pc-surface-3)",
      color: "var(--pc-ivory)",
      borderRadius: "var(--pc-radius-lg)",
      border: "1px solid var(--pc-border)",
      borderTop: `2px solid ${c}`,
      boxShadow: "var(--pc-elev-2)",
      fontFamily: "var(--pc-font-sans)",
      animation: "pc-toast-in var(--pc-dur-slow) var(--pc-ease-out) both",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: 10,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: c,
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1.45
    }
  }, message)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Fechar",
    style: {
      background: "none",
      border: 0,
      color: "var(--pc-neutral-400)",
      cursor: "pointer",
      padding: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "X",
    size: 15
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
/**
 * Small mono tooltip on hover/focus. Ivory on dark for contrast. Use for definitions, not instructions.
 */
function Tooltip({
  label,
  side = "top",
  children
}) {
  const [on, setOn] = React.useState(false);
  const pos = side === "bottom" ? {
    top: "calc(100% + 8px)"
  } : {
    bottom: "calc(100% + 8px)"
  };
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setOn(true),
    onMouseLeave: () => setOn(false),
    onFocus: () => setOn(true),
    onBlur: () => setOn(false),
    style: {
      position: "relative",
      display: "inline-flex"
    }
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: "absolute",
      left: "50%",
      ...pos,
      transform: `translateX(-50%) translateY(${on ? 0 : side === "bottom" ? -4 : 4}px)`,
      opacity: on ? 1 : 0,
      pointerEvents: "none",
      whiteSpace: "nowrap",
      zIndex: 50,
      background: "var(--pc-ivory)",
      color: "var(--pc-ink)",
      padding: "6px 10px",
      borderRadius: "var(--pc-radius-sm)",
      fontFamily: "var(--pc-font-mono)",
      fontSize: 10,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      transition: "opacity var(--pc-dur-fast) var(--pc-ease), transform var(--pc-dur-fast) var(--pc-ease)"
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/**
 * Square checkbox (radius 3) with gold fill when checked. Controlled or uncontrolled.
 */
function Checkbox({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  theme = "dark",
  style
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked ?? inner;
  const isLight = theme === "light";
  const accent = isLight ? "var(--pc-gold-deep)" : "var(--pc-gold)";
  const toggle = () => {
    if (disabled) return;
    const v = !on;
    setInner(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      fontFamily: "var(--pc-font-sans)",
      fontSize: 14,
      color: isLight ? "var(--pc-ink)" : "var(--pc-ivory)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "checkbox",
    "aria-checked": on,
    disabled: disabled,
    onClick: toggle,
    className: "pc-focusable",
    style: {
      width: 18,
      height: 18,
      borderRadius: 3,
      padding: 0,
      display: "grid",
      placeItems: "center",
      cursor: "inherit",
      background: on ? accent : "transparent",
      border: `1px solid ${on ? accent : isLight ? "var(--pc-border-light-strong)" : "var(--pc-border-strong)"}`,
      transition: "background var(--pc-dur-fast) var(--pc-ease), border-color var(--pc-dur-fast) var(--pc-ease)"
    }
  }, on && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "Check",
    size: 13,
    strokeWidth: 2.25,
    color: "var(--pc-ink)"
  })), label && /*#__PURE__*/React.createElement("span", {
    onClick: toggle
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Text field with a mono label, optional unit prefix/suffix (R$, m²) and hint/error line.
 * "boxed" for app UI; "line" (bottom rule only) for editorial forms and print-like sheets.
 */
function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  variant = "boxed",
  theme = "dark",
  id,
  style,
  inputStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const isLight = theme === "light";
  const c = {
    text: isLight ? "var(--pc-ink)" : "var(--pc-ivory)",
    label: isLight ? "var(--pc-gold-deep)" : "var(--pc-gold)",
    hint: isLight ? "var(--pc-neutral-600)" : "var(--pc-neutral-400)",
    border: isLight ? "var(--pc-border-light-strong)" : "var(--pc-border-strong)",
    bg: isLight ? "#fff" : "var(--pc-surface-2)",
    ring: isLight ? "var(--pc-focus-ring-light)" : "var(--pc-focus-ring)"
  };
  const fid = id || (label ? "pc-in-" + String(label).toLowerCase().replace(/[^a-z0-9]+/g, "-") : undefined);
  const line = variant === "line";
  const borderColor = error ? "var(--pc-danger)" : focus ? c.label : c.border;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      display: "grid",
      gap: 8,
      fontFamily: "var(--pc-font-sans)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: 10,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: c.label
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: c.text,
      background: line ? "transparent" : c.bg,
      border: line ? "none" : `1px solid ${borderColor}`,
      borderBottom: `1px solid ${borderColor}`,
      borderRadius: line ? 0 : "var(--pc-radius-md)",
      padding: line ? "10px 0" : "0 14px",
      height: line ? "auto" : 46,
      boxShadow: focus && !line ? c.ring : "none",
      transition: "border-color var(--pc-dur) var(--pc-ease), box-shadow var(--pc-dur) var(--pc-ease)"
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: 12,
      color: c.hint
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      background: "transparent",
      border: 0,
      outline: "none",
      color: "inherit",
      fontFamily: line ? "var(--pc-font-display)" : "var(--pc-font-sans)",
      fontStyle: line ? "italic" : "normal",
      fontSize: line ? 22 : 15,
      padding: 0,
      ...inputStyle
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: 12,
      color: c.hint
    }
  }, suffix)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? "var(--pc-danger)" : c.hint
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Native select dressed as a Prime Circle field. Pass options as [{value,label}] or strings.
 */
function Select({
  label,
  hint,
  options = [],
  theme = "dark",
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const isLight = theme === "light";
  const c = {
    text: isLight ? "var(--pc-ink)" : "var(--pc-ivory)",
    label: isLight ? "var(--pc-gold-deep)" : "var(--pc-gold)",
    hint: isLight ? "var(--pc-neutral-600)" : "var(--pc-neutral-400)",
    border: isLight ? "var(--pc-border-light-strong)" : "var(--pc-border-strong)",
    bg: isLight ? "#fff" : "var(--pc-surface-2)",
    ring: isLight ? "var(--pc-focus-ring-light)" : "var(--pc-focus-ring)"
  };
  const fid = id || (label ? "pc-sel-" + String(label).toLowerCase().replace(/[^a-z0-9]+/g, "-") : undefined);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      display: "grid",
      gap: 8,
      fontFamily: "var(--pc-font-sans)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: 10,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: c.label
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fid,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: "none",
      WebkitAppearance: "none",
      width: "100%",
      height: 46,
      padding: "0 40px 0 14px",
      background: c.bg,
      color: c.text,
      fontFamily: "var(--pc-font-sans)",
      fontSize: 15,
      border: `1px solid ${focus ? c.label : c.border}`,
      borderRadius: "var(--pc-radius-md)",
      outline: "none",
      boxShadow: focus ? c.ring : "none",
      cursor: "pointer"
    }
  }, rest), options.map(o => {
    const v = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v.value,
      value: v.value
    }, v.label);
  })), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "ChevronDown",
    size: 16,
    color: c.hint,
    style: {
      position: "absolute",
      right: 14,
      pointerEvents: "none"
    }
  })), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: c.hint
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/**
 * On/off switch. Pill track, ivory knob; gold track when on.
 */
function Switch({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  theme = "dark",
  style
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked ?? inner;
  const isLight = theme === "light";
  const toggle = () => {
    if (disabled) return;
    const v = !on;
    setInner(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      fontFamily: "var(--pc-font-sans)",
      fontSize: 14,
      color: isLight ? "var(--pc-ink)" : "var(--pc-ivory)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": on,
    disabled: disabled,
    onClick: toggle,
    className: "pc-focusable",
    style: {
      position: "relative",
      width: 40,
      height: 22,
      borderRadius: 999,
      padding: 0,
      cursor: "inherit",
      background: on ? isLight ? "var(--pc-gold-deep)" : "var(--pc-gold)" : isLight ? "var(--pc-neutral-200)" : "var(--pc-surface-3)",
      border: `1px solid ${on ? "transparent" : isLight ? "var(--pc-border-light-strong)" : "var(--pc-border-strong)"}`,
      transition: "background var(--pc-dur) var(--pc-ease)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      left: on ? 20 : 2,
      width: 16,
      height: 16,
      borderRadius: 999,
      background: on ? "var(--pc-ink)" : isLight ? "#fff" : "var(--pc-ivory)",
      transition: "left var(--pc-dur) var(--pc-ease-out)"
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    onClick: toggle
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/motion/CountUp.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * A number that settles into its value once, when it scrolls into view. Mono, tabular.
 * Formats in pt-BR. Use for real figures only (prices, m², comparáveis).
 */
function CountUp({
  value = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1400,
  from = 0,
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  const [n, setN] = React.useState(from);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf,
      started = false;
    const run = () => {
      if (started) return;
      started = true;
      const t0 = performance.now();
      const tick = t => {
        const p = Math.min(1, (t - t0) / duration);
        const e = 1 - Math.pow(1 - p, 4);
        setN(from + (value - from) * e);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(es => es.some(x => x.isIntersecting) && run(), {
      threshold: 0.3
    }) : null;
    io ? io.observe(el) : run();
    return () => {
      io && io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration, from]);
  const txt = n.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return /*#__PURE__*/React.createElement("span", _extends({
    ref: ref,
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontVariantNumeric: "tabular-nums",
      ...style
    }
  }, rest), prefix, txt, suffix);
}
Object.assign(__ds_scope, { CountUp });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/motion/CountUp.jsx", error: String((e && e.message) || e) }); }

// components/data/Stat.jsx
try { (() => {
/**
 * A single real figure: mono label, large mono number (optionally counting up), source/caption line.
 * Always give a caption with the source or date — numbers without provenance are off-brand.
 */
function Stat({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  caption,
  delta,
  animate = true,
  size = "md",
  theme = "dark",
  style
}) {
  const isLight = theme === "light";
  const fs = size === "lg" ? 64 : size === "sm" ? 28 : 44;
  const up = typeof delta === "string" ? !delta.trim().startsWith("-") : delta >= 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10,
      paddingTop: 14,
      borderTop: `1px solid ${isLight ? "var(--pc-border-light-strong)" : "var(--pc-border-strong)"}`,
      color: isLight ? "var(--pc-ink)" : "var(--pc-ivory)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: 10,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: isLight ? "var(--pc-gold-deep)" : "var(--pc-gold)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 12
    }
  }, animate && typeof value === "number" ? /*#__PURE__*/React.createElement(__ds_scope.CountUp, {
    value: value,
    prefix: prefix,
    suffix: suffix,
    decimals: decimals,
    style: {
      fontSize: fs,
      lineHeight: 1,
      letterSpacing: "-0.03em"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontVariantNumeric: "tabular-nums",
      fontSize: fs,
      lineHeight: 1,
      letterSpacing: "-0.03em"
    }
  }, prefix, typeof value === "number" ? value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }) : value, suffix), delta != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-mono)",
      fontSize: 12,
      color: up ? "var(--pc-success)" : "var(--pc-danger)"
    }
  }, typeof delta === "number" ? (delta > 0 ? "+" : "") + delta + "%" : delta)), caption && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: isLight ? "var(--pc-neutral-600)" : "var(--pc-neutral-400)"
    }
  }, caption));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Stat.jsx", error: String((e && e.message) || e) }); }

// components/motion/DrawnRings.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * The concentric-ring motif or the connection mark, drawn once like a drafting pen.
 * Decorative only. Plays once on mount; never loops.
 */
function DrawnRings({
  variant = "concentric",
  size = 320,
  rings = 5,
  color = "var(--pc-gold)",
  accent = "var(--pc-gold)",
  neutral = "var(--pc-ivory)",
  strokeWidth = 1,
  opacity = 1,
  duration = 1800,
  delay = 0,
  stagger = 140,
  animate = true,
  style,
  ...rest
}) {
  const draw = (r, i) => {
    const len = Math.ceil(2 * Math.PI * r) + 2;
    return animate ? {
      strokeDasharray: len,
      "--pc-draw-len": len,
      animation: `pc-draw ${duration}ms var(--pc-ease-out) ${delay + i * stagger}ms both`
    } : {};
  };
  if (variant === "mark") {
    return /*#__PURE__*/React.createElement("svg", _extends({
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      fill: "none",
      "aria-hidden": "true",
      style: {
        opacity,
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement("circle", {
      cx: "36",
      cy: "50",
      r: "30",
      stroke: accent,
      strokeWidth: strokeWidth,
      style: draw(30, 0)
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "64",
      cy: "50",
      r: "30",
      stroke: neutral,
      strokeWidth: strokeWidth,
      style: draw(30, 1)
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "50",
      r: "3.5",
      fill: accent,
      style: animate ? {
        animation: `pc-fade-in 400ms var(--pc-ease) ${delay + stagger * 2 + duration * 0.6}ms both`
      } : {}
    }));
  }
  const list = Array.from({
    length: rings
  }, (_, i) => 48 - i * (40 / Math.max(1, rings - 1 || 1)));
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    fill: "none",
    "aria-hidden": "true",
    style: {
      opacity,
      ...style
    }
  }, rest), list.map((r, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: "50",
    cy: "50",
    r: r,
    stroke: color,
    strokeWidth: strokeWidth,
    vectorEffect: "non-scaling-stroke",
    style: {
      ...draw(r, i),
      transform: "rotate(-90deg)",
      transformOrigin: "50% 50%"
    }
  })));
}
Object.assign(__ds_scope, { DrawnRings });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/motion/DrawnRings.jsx", error: String((e && e.message) || e) }); }

// components/motion/Reveal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Reveals its children once when they enter the viewport.
 * "wipe" uncovers left→right like ink on paper; "fade" is opacity only; "rule" draws a gold hairline above.
 */
function Reveal({
  variant = "wipe",
  delay = 0,
  duration = 900,
  as = "div",
  children,
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(es => {
      if (es.some(x => x.isIntersecting)) {
        setOn(true);
        io.disconnect();
      }
    }, {
      threshold: 0.15
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const t = `${duration}ms var(--pc-ease-out) ${delay}ms`;
  const Tag = as;
  if (variant === "rule") {
    return /*#__PURE__*/React.createElement(Tag, _extends({
      ref: ref,
      style: {
        position: "relative",
        paddingTop: 16,
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: "var(--pc-gold)",
        transformOrigin: "left",
        transform: on ? "scaleX(1)" : "scaleX(0)",
        transition: `transform ${t}`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        opacity: on ? 1 : 0,
        transition: `opacity ${duration}ms var(--pc-ease) ${delay + 200}ms`
      }
    }, children));
  }
  const hidden = variant === "fade" ? {
    opacity: 0
  } : {
    clipPath: "inset(0 100% 0 0)"
  };
  const shown = variant === "fade" ? {
    opacity: 1
  } : {
    clipPath: "inset(0 0% 0 0)"
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    ref: ref,
    style: {
      ...(on ? shown : hidden),
      transition: `clip-path ${t}, opacity ${t}`,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Reveal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/motion/Reveal.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/**
 * Mono uppercase tabs with a gold underline on the active item and optional counts.
 */
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  theme = "dark",
  style
}) {
  const [inner, setInner] = React.useState(defaultValue ?? (items[0] && items[0].id));
  const active = value ?? inner;
  const isLight = theme === "light";
  const accent = isLight ? "var(--pc-gold-deep)" : "var(--pc-gold)";
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: "flex",
      gap: 28,
      borderBottom: `1px solid ${isLight ? "var(--pc-border-light)" : "var(--pc-border)"}`,
      ...style
    }
  }, items.map(it => {
    const on = it.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      role: "tab",
      "aria-selected": on,
      className: "pc-focusable",
      onClick: () => {
        setInner(it.id);
        onChange && onChange(it.id);
      },
      style: {
        position: "relative",
        background: "none",
        border: 0,
        padding: "0 0 14px",
        cursor: "pointer",
        display: "inline-flex",
        gap: 8,
        alignItems: "baseline",
        fontFamily: "var(--pc-font-mono)",
        fontSize: 11,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: on ? isLight ? "var(--pc-ink)" : "var(--pc-ivory)" : isLight ? "var(--pc-neutral-500)" : "var(--pc-neutral-400)",
        transition: "color var(--pc-dur) var(--pc-ease)"
      }
    }, it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        color: accent,
        letterSpacing: "0.1em"
      }
    }, String(it.count).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -1,
        height: 1,
        background: accent,
        transformOrigin: "left",
        transform: on ? "scaleX(1)" : "scaleX(0)",
        transition: "transform var(--pc-dur-slow) var(--pc-ease-out)"
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Topbar.jsx
try { (() => {
/**
 * Editorial top bar: mark + wordmark left, mono nav center/left, actions right. Hairline bottom rule.
 */
function Topbar({
  links = [],
  active,
  onNavigate,
  actions,
  theme = "dark",
  sticky = false,
  style
}) {
  const isLight = theme === "light";
  const fg = isLight ? "var(--pc-ink)" : "var(--pc-ivory)";
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 40,
      height: 68,
      padding: "0 32px",
      color: fg,
      background: isLight ? "var(--pc-ivory)" : "var(--pc-ink)",
      borderBottom: `1px solid ${isLight ? "var(--pc-border-light)" : "var(--pc-border)"}`,
      position: sticky ? "sticky" : "relative",
      top: 0,
      zIndex: 10,
      ...style
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate("home");
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: fg,
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Mark, {
    size: 30,
    color: fg,
    accent: isLight ? "var(--pc-gold-deep)" : "var(--pc-gold)",
    strokeWidth: 4
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--pc-font-sans)",
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: "-0.01em"
    }
  }, "Prime Circle")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 28,
      flex: 1
    }
  }, links.map(l => {
    const id = typeof l === "string" ? l : l.id;
    const label = typeof l === "string" ? l : l.label;
    const on = id === active;
    return /*#__PURE__*/React.createElement("a", {
      key: id,
      href: "#",
      className: "pc-focusable",
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(id);
      },
      style: {
        fontFamily: "var(--pc-font-mono)",
        fontSize: 11,
        letterSpacing: "0.26em",
        textTransform: "uppercase",
        textDecoration: "none",
        color: on ? fg : isLight ? "var(--pc-neutral-500)" : "var(--pc-neutral-400)"
      }
    }, label);
  })), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center"
    }
  }, actions));
}
Object.assign(__ds_scope, { Topbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Topbar.jsx", error: String((e && e.message) || e) }); }

// deck-stage.js
try { (() => {
/**
 * <deck-stage> — reusable web component for HTML decks.
 *
 * Handles:
 *  (a) speaker notes — reads <script type="application/json" id="speaker-notes">
 *      and posts {slideIndexChanged: N} to the parent window on nav.
 *  (b) keyboard navigation — ←/→, PgUp/PgDn, Space, Home/End, number keys.
 *  (c) press R to reset to slide 0 (with a tasteful keyboard hint).
 *  (d) bottom-center overlay showing slide count + hints, fades out on idle.
 *  (e) auto-scaling — inner canvas is a fixed design size (default 1920×1080)
 *      scaled with `transform: scale()` to fit the viewport, letterboxed.
 *      Set the `noscale` attribute to render at authored size (1:1) — the
 *      PPTX exporter sets this so its DOM capture sees unscaled geometry.
 *  (f) print — `@media print` lays every slide out as its own page at the
 *      design size, so the browser's Print → Save as PDF produces a clean
 *      one-page-per-slide PDF with no extra setup.
 *  (g) thumbnail rail — resizable left-hand column of per-slide thumbnails
 *      (static clones). Click to navigate; ↑/↓ with a thumbnail focused to
 *      step between slides; drag to reorder; right-click for
 *      Skip / Move up / Move down / Delete (opens a Cancel/Delete confirm
 *      dialog). Drag the rail's right edge to resize; width persists to
 *      localStorage. Skipped slides carry `data-deck-skip`, are dimmed in
 *      the rail, omitted from prev/next navigation, and hidden at print.
 *      The rail is suppressed in presenting mode, in the host's Preview
 *      mode (ViewerMode='none'), on `noscale`, and via the `no-rail`
 *      attribute. Rail mutations dispatch a `deckchange`
 *      CustomEvent on the element: detail = {action, from, to, slide}.
 *
 * Slides are HIDDEN, not unmounted. Non-active slides stay in the DOM with
 * `visibility: hidden` + `opacity: 0`, so their state (videos, iframes,
 * form inputs, React trees) is preserved across navigation.
 *
 * Lifecycle event — the component dispatches a `slidechange` CustomEvent on
 * itself whenever the active slide changes (including the initial mount).
 * The event bubbles and composes out of shadow DOM, so you can listen on
 * the <deck-stage> element or on document:
 *
 *   document.querySelector('deck-stage').addEventListener('slidechange', (e) => {
 *     e.detail.index         // new 0-based index
 *     e.detail.previousIndex // previous index, or -1 on init
 *     e.detail.total         // total slide count
 *     e.detail.slide         // the new active slide element
 *     e.detail.previousSlide // the prior slide element, or null on init
 *     e.detail.reason        // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
 *   });
 *
 * Persistence: none at the deck level. The host app keeps the current slide
 * in its own URL (?slide=) and re-delivers it via location.hash on load, so a
 * bare load with no hash always starts at slide 1.
 *
 * Usage:
 *   <style>deck-stage:not(:defined){visibility:hidden}</style>
 *   <deck-stage width="1920" height="1080">
 *     <section data-label="Title">...</section>
 *     <section data-label="Agenda">...</section>
 *   </deck-stage>
 *   <script src="deck-stage.js"></script>
 *
 * The :not(:defined) rule prevents a flash of the first slide at its
 * authored styles before this script runs and attaches the shadow root.
 *
 * Slides are the direct element children of <deck-stage>. Each slide is
 * automatically tagged with:
 *   - data-screen-label="NN Label"   (1-indexed, for comment flow)
 *   - data-om-validate="no_overflowing_text,no_overlapping_text,slide_sized_text"
 */

(() => {
  const DESIGN_W_DEFAULT = 1920;
  const DESIGN_H_DEFAULT = 1080;
  const OVERLAY_HIDE_MS = 1800;
  const VALIDATE_ATTR = 'no_overflowing_text,no_overlapping_text,slide_sized_text';
  const pad2 = n => String(n).padStart(2, '0');

  // Label precedence: data-label → data-screen-label (number stripped) → first heading → "Slide".
  const getSlideLabel = el => {
    const explicit = el.getAttribute('data-label');
    if (explicit) return explicit;
    const existing = el.getAttribute('data-screen-label');
    if (existing) return existing.replace(/^\s*\d+\s*/, '').trim() || existing;
    const h = el.querySelector('h1, h2, h3, [data-title]');
    const t = h && (h.textContent || '').trim().slice(0, 40);
    if (t) return t;
    return 'Slide';
  };
  const stylesheet = `
    :host {
      position: fixed;
      inset: 0;
      display: block;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      overflow: hidden;
    }
    /* connectedCallback holds this until document.fonts.ready (capped 2s) so
     * the first visible paint has the deck's real typography + final rail
     * layout. opacity (not visibility) so the active slide can't un-hide
     * itself via the ::slotted([data-deck-active]) visibility:visible rule.
     * Only the stage/rail hide — the black :host background stays, so the
     * iframe doesn't flash the page's default white. */
    :host([data-fonts-pending]) .stage,
    :host([data-fonts-pending]) .rail { opacity: 0; pointer-events: none; }

    .stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas {
      position: relative;
      transform-origin: center center;
      flex-shrink: 0;
      background: #fff;
      will-change: transform;
    }

    /* Slides live in light DOM (via <slot>) so authored CSS still applies.
       We absolutely position each slotted child to stack them. */
    ::slotted(*) {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
    ::slotted([data-deck-active]) {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }

    /* Tap zones for mobile — back/forward thirds like Stories.
       Transparent, no visible UI, don't block the overlay. */
    .tapzones {
      position: fixed;
      inset: 0;
      display: flex;
      z-index: 2147482000;
      pointer-events: none;
    }
    .tapzone {
      flex: 1;
      pointer-events: auto;
      -webkit-tap-highlight-color: transparent;
    }
    /* Only activate tap zones on coarse pointers (touch devices). */
    @media (hover: hover) and (pointer: fine) {
      .tapzones { display: none; }
    }

    .overlay {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translate(-50%, 6px) scale(0.92);
      filter: blur(6px);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      background: #000;
      color: #fff;
      border-radius: 999px;
      font-size: 12px;
      font-feature-settings: "tnum" 1;
      letter-spacing: 0.01em;
      opacity: 0;
      pointer-events: none;
      transition: opacity 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease;
      transform-origin: center bottom;
      z-index: 2147483000;
      user-select: none;
    }
    .overlay[data-visible] {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0) scale(1);
      filter: blur(0);
    }

    .btn {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: default;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
      border-radius: 999px;
      color: rgba(255,255,255,0.72);
      transition: background 140ms ease, color 140ms ease;
      -webkit-tap-highlight-color: transparent;
    }
    .btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .btn:active { background: rgba(255,255,255,0.18); }
    .btn:focus { outline: none; }
    .btn:focus-visible { outline: none; }
    .btn::-moz-focus-inner { border: 0; }
    .btn svg { width: 14px; height: 14px; display: block; }
    .btn.reset {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 0 10px 0 12px;
      gap: 6px;
      color: rgba(255,255,255,0.72);
    }
    .btn.reset .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 10px;
      line-height: 1;
      color: rgba(255,255,255,0.88);
      background: rgba(255,255,255,0.12);
      border-radius: 4px;
    }

    .count {
      font-variant-numeric: tabular-nums;
      color: #fff;
      font-weight: 500;
      padding: 0 8px;
      min-width: 42px;
      text-align: center;
      font-size: 12px;
    }
    .count .sep { color: rgba(255,255,255,0.45); margin: 0 3px; font-weight: 400; }
    .count .total { color: rgba(255,255,255,0.55); }

    .divider {
      width: 1px;
      height: 14px;
      background: rgba(255,255,255,0.18);
      margin: 0 2px;
    }

    /* ── Thumbnail rail ──────────────────────────────────────────────────
       Fixed column on the left; each thumbnail is a static deep-clone of
       the light-DOM slide scaled into a 16:9 (or design-aspect) frame. The
       stage re-fits around it (see _fit); hidden during present / noscale
       / print so capture geometry and fullscreen output are unchanged. */
    .rail {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--deck-rail-w, 188px);
      background: #141414;
      border-right: 1px solid rgba(255,255,255,0.08);
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 2147482500;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.18) transparent;
    }
    .rail::-webkit-scrollbar { width: 8px; }
    .rail::-webkit-scrollbar-track { background: transparent; margin: 2px; }
    .rail::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.18);
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    .rail::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.28);
      border: 2px solid transparent;
      background-clip: content-box;
    }
    :host([no-rail]) .rail,
    :host([noscale]) .rail { display: none; }
    .rail[data-presenting] { display: none; }
    /* User-driven show/hide (the TweaksPanel toggle) slides instead of
       popping. Transitions are gated on :host([data-rail-anim]) — set only
       for the 200ms around the toggle — so window-resize and rail-width
       drag (which also call _fit) don't lag behind the cursor. */
    .rail[data-user-hidden] { transform: translateX(-100%); }
    :host([data-rail-anim]) .rail { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .stage { transition: left 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .canvas { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    /* transition shorthand replaces rather than merges — repeat the base
       .overlay opacity/transform/filter transitions so visibility changes
       during the 200ms toggle window still fade instead of popping. */
    :host([data-rail-anim]) .overlay {
      transition: margin-left 200ms cubic-bezier(.3,.7,.4,1),
                  opacity 260ms ease,
                  transform 260ms cubic-bezier(.2,.8,.2,1),
                  filter 260ms ease;
    }
    :host([data-rail-anim]) .tapzones { transition: left 200ms cubic-bezier(.3,.7,.4,1); }

    .thumb {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
      user-select: none;
    }
    .thumb .num {
      width: 16px;
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 500;
      text-align: right;
      color: rgba(255,255,255,0.55);
      padding-top: 2px;
      font-variant-numeric: tabular-nums;
    }
    .thumb .frame {
      position: relative;
      flex: 1;
      min-width: 0;
      aspect-ratio: var(--deck-aspect);
      background: #fff;
      border-radius: 4px;
      outline: 2px solid transparent;
      outline-offset: 0;
      overflow: hidden;
      transition: outline-color 120ms ease;
    }
    .thumb:hover .frame { outline-color: rgba(255,255,255,0.25); }
    .thumb { outline: none; }
    .thumb:focus-visible .frame { outline-color: rgba(255,255,255,0.5); }
    .thumb[data-current] .num { color: #fff; }
    .thumb[data-current] .frame { outline-color: #D97757; }
    .thumb[data-dragging] { opacity: 0.35; }
    .thumb::before {
      content: '';
      position: absolute;
      left: 24px;
      right: 0;
      height: 3px;
      border-radius: 2px;
      background: #D97757;
      opacity: 0;
      pointer-events: none;
    }
    .thumb[data-drop="before"]::before { top: -8px; opacity: 1; }
    .thumb[data-drop="after"]::before { bottom: -8px; opacity: 1; }
    .thumb[data-skip] .frame { opacity: 0.35; }
    .thumb[data-skip] .frame::after {
      content: 'Skipped';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.45);
      color: #fff;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.04em;
    }

    .ctxmenu {
      position: fixed;
      min-width: 150px;
      padding: 4px;
      background: #242424;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 7px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      z-index: 2147483100;
      display: none;
      font-size: 12px;
    }
    .ctxmenu[data-open] { display: block; }
    .ctxmenu button {
      display: block;
      width: 100%;
      appearance: none;
      border: 0;
      background: transparent;
      color: #e8e8e8;
      font: inherit;
      text-align: left;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .ctxmenu button:hover:not(:disabled) { background: rgba(255,255,255,0.08); }
    .ctxmenu button:disabled { opacity: 0.35; cursor: default; }
    .ctxmenu hr {
      border: 0;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 4px 2px;
    }

    .rail-resize {
      position: fixed;
      left: calc(var(--deck-rail-w, 188px) - 3px);
      top: 0;
      bottom: 0;
      width: 6px;
      cursor: col-resize;
      z-index: 2147482600;
      touch-action: none;
    }
    .rail-resize:hover,
    .rail-resize[data-dragging] { background: rgba(255,255,255,0.12); }
    :host([no-rail]) .rail-resize,
    :host([noscale]) .rail-resize,
    .rail[data-presenting] + .rail-resize,
    .rail[data-user-hidden] + .rail-resize { display: none; }

    /* Delete-confirm popup — matches the SPA's ConfirmDialog layout
       (title + message body, depressed footer with Cancel / Delete). */
    .confirm-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 2147483200;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .confirm-backdrop[data-open] { display: flex; }
    .confirm {
      width: 320px;
      max-width: calc(100vw - 32px);
      background: #2a2a2a;
      color: #e8e8e8;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      overflow: hidden;
      font-family: inherit;
      animation: deck-confirm-in 0.18s ease;
    }
    @keyframes deck-confirm-in {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .confirm .body { padding: 20px 20px 16px; }
    .confirm .title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
    .confirm .msg { font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.65); }
    .confirm .footer {
      padding: 14px 20px;
      background: #1f1f1f;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .confirm button {
      appearance: none;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
    }
    .confirm .cancel {
      background: transparent;
      border: 0;
      color: rgba(255,255,255,0.8);
    }
    .confirm .cancel:hover { background: rgba(255,255,255,0.08); }
    .confirm .danger {
      background: #c96442;
      border: 1px solid rgba(0,0,0,0.15);
      color: #fff;
      box-shadow: 0 1px 3px rgba(166,50,68,0.3), 0 2px 6px rgba(166,50,68,0.18);
    }
    .confirm .danger:hover { background: #b5563a; }

    /* ── Print: one page per slide, no chrome ────────────────────────────
       The screen layout stacks every slide at inset:0 inside a scaled
       canvas; for print we want them in document flow at the authored
       design size so the browser paginates one slide per sheet. The
       @page size is set from the width/height attributes via the inline
       <style id="deck-stage-print-page"> that connectedCallback injects
       into <head> (the @page at-rule has no effect inside shadow DOM). */
    @media print {
      :host {
        position: static;
        inset: auto;
        background: none;
        overflow: visible;
        color: inherit;
      }
      .stage { position: static; display: block; }
      .canvas {
        transform: none !important;
        width: auto !important;
        height: auto !important;
        background: none;
        will-change: auto;
      }
      ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        width: var(--deck-design-w) !important;
        height: var(--deck-design-h) !important;
        box-sizing: border-box !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto;
        break-after: page;
        page-break-after: always;
        break-inside: avoid;
        overflow: hidden;
      }
      /* :last-child alone isn't enough once data-deck-skip hides the
         trailing slide(s) — the last *visible* slide still carries
         break-after:page and prints a blank sheet. _markLastVisible()
         maintains data-deck-last-visible on the last non-skipped slide. */
      ::slotted(*:last-child),
      ::slotted([data-deck-last-visible]) {
        break-after: auto;
        page-break-after: auto;
      }
      ::slotted([data-deck-skip]) { display: none !important; }
      .overlay, .tapzones, .rail, .rail-resize, .ctxmenu, .confirm-backdrop { display: none !important; }
    }
  `;
  class DeckStage extends HTMLElement {
    static get observedAttributes() {
      return ['width', 'height', 'noscale', 'no-rail'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._index = 0;
      this._slides = [];
      this._notes = [];
      this._hideTimer = null;
      this._mouseIdleTimer = null;
      this._menuIndex = -1;
      this._onKey = this._onKey.bind(this);
      this._onResize = this._onResize.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onTapBack = this._onTapBack.bind(this);
      this._onTapForward = this._onTapForward.bind(this);
      this._onMessage = this._onMessage.bind(this);
      // Capture-phase close so a click anywhere dismisses the menu, but
      // ignore clicks that land inside the menu itself — otherwise the
      // capture handler runs before the menu's own (bubble) handler and
      // clears _menuIndex out from under it.
      this._onDocClick = e => {
        if (this._menu && e.composedPath && e.composedPath().includes(this._menu)) return;
        this._closeMenu();
      };
    }
    get designWidth() {
      return parseInt(this.getAttribute('width'), 10) || DESIGN_W_DEFAULT;
    }
    get designHeight() {
      return parseInt(this.getAttribute('height'), 10) || DESIGN_H_DEFAULT;
    }
    connectedCallback() {
      // Presenter-view popup loads deckUrl?_snthumb=...#N for its prev/cur/
      // next thumbnails — the rail has no business rendering inside those
      // (wrong scale, and it offsets the stage so the thumb shows a gutter).
      if (/[?&]_snthumb=/.test(location.search)) this.setAttribute('no-rail', '');
      this._render();
      this._loadNotes();
      this._syncPrintPageRule();
      window.addEventListener('keydown', this._onKey);
      window.addEventListener('resize', this._onResize);
      window.addEventListener('mousemove', this._onMouseMove, {
        passive: true
      });
      window.addEventListener('message', this._onMessage);
      window.addEventListener('click', this._onDocClick, true);
      // Initial collection + layout happens via slotchange, which fires on mount.
      this._enableRail();
      // Hold the stage hidden until webfonts are ready so the first visible
      // paint has the deck's real typography — the :not(:defined) guard in
      // the page HTML only covers custom-element upgrade, not font load.
      // Capped so a 404'd font URL can't blank the deck indefinitely.
      this.setAttribute('data-fonts-pending', '');
      const reveal = () => this.removeAttribute('data-fonts-pending');
      // rAF first: fonts.ready is a pre-resolved promise until layout has
      // resolved the slotted text's font-family and pushed a FontFace into
      // 'loading'. Reading it here in connectedCallback (parse-time) would
      // settle the race in a microtask before any font fetch starts.
      requestAnimationFrame(() => {
        Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 2000))]).then(reveal, reveal);
      });
    }
    _enableRail() {
      // Idempotent — older host builds still post __omelette_rail_enabled.
      // no-rail guard keeps the observers/stylesheet walk off the cheap path
      // for presenter-popup thumbnail iframes (up to 9 per view).
      if (this._railEnabled || this.hasAttribute('no-rail')) return;
      this._railEnabled = true;
      // Per-viewer preference — restored alongside rail width. Default on;
      // only a stored '0' (from the TweaksPanel toggle) hides it.
      this._railVisible = true;
      try {
        if (localStorage.getItem('deck-stage.railVisible') === '0') this._railVisible = false;
      } catch (e) {}
      // Live thumbnail updates: watch the light-DOM slides for content
      // edits and re-clone just the affected thumb(s), debounced. Ignore
      // the data-deck-* / data-screen-label / data-om-validate attributes
      // this component itself writes so nav and skip don't trigger
      // spurious refreshes.
      const OWN_ATTRS = /^data-(deck-|screen-label$|om-validate$)/;
      this._liveDirty = new Set();
      this._liveObserver = new MutationObserver(records => {
        for (const r of records) {
          if (r.type === 'attributes' && OWN_ATTRS.test(r.attributeName || '')) continue;
          let n = r.target;
          while (n && n.parentElement !== this) n = n.parentElement;
          if (n && this._slideSet && this._slideSet.has(n)) this._liveDirty.add(n);
        }
        if (this._liveDirty.size && !this._liveTimer) {
          this._liveTimer = setTimeout(() => {
            this._liveTimer = null;
            this._liveDirty.forEach(s => this._refreshThumb(s));
            this._liveDirty.clear();
          }, 200);
        }
      });
      this._liveObserver.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      // Lazy thumbnail materialization — clone the slide only when its
      // frame scrolls into (or near) the rail viewport. rootMargin gives
      // ~4 thumbs of pre-load so fast scrolling doesn't flash blanks.
      this._railObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting && e.target.__deckThumb) {
            this._materialize(e.target.__deckThumb);
          }
        });
      }, {
        root: this._rail,
        rootMargin: '400px 0px'
      });
      // Tweaks typically change CSS vars / attrs OUTSIDE <deck-stage>
      // (on <html>, <body>, a wrapper div, or a <style> tag), which
      // _liveObserver can't see. Re-snapshot author CSS (constructable
      // sheet is shared by reference, so one replaceSync updates every
      // thumb shadow root) and re-sync each thumb host's attrs + custom
      // properties. In-slide DOM mutations are _liveObserver's job.
      // Debounced so slider drags don't thrash.
      this._onTweakChange = () => {
        clearTimeout(this._tweakTimer);
        this._tweakTimer = setTimeout(() => {
          this._snapshotAuthorCss();
          // One getComputedStyle for the whole batch — each
          // getPropertyValue read below reuses the same computed style
          // as long as nothing invalidates layout between thumbs.
          const cs = getComputedStyle(this);
          (this._thumbs || []).forEach(t => {
            if (t.host) this._syncThumbHostAttrs(t.host, cs);
          });
        }, 120);
      };
      window.addEventListener('tweakchange', this._onTweakChange);
      this._snapshotAuthorCss();
      // Build the rail now that it's enabled — slotchange already fired,
      // so _renderRail's early-return skipped the initial build.
      this._syncRailHidden();
      this._renderRail();
      this._fit();
    }

    /** Snapshot document stylesheets into a constructable sheet that each
     *  thumbnail's nested shadow root adopts — so author CSS styles the
     *  cloned slide content without touching this component's chrome.
     *  Cross-origin sheets throw on .cssRules — skip them. Re-callable:
     *  the existing constructable sheet is reused via replaceSync so every
     *  already-adopted shadow root picks up the fresh CSS without re-adopt. */
    _snapshotAuthorCss() {
      // :root in an adopted sheet inside a shadow root matches nothing
      // (only the document root qualifies), so author rules like
      // `:root[data-voice="modern"] .serif` never reach the clones.
      // Rewrite :root → :host and mirror <html>'s data-*/class/lang onto
      // each thumb host (see _syncThumbHostAttrs) so the same selectors
      // match inside the thumbnail's shadow tree.
      const authorCss = Array.from(document.styleSheets).map(sh => {
        try {
          return Array.from(sh.cssRules).map(r => r.cssText).join('\n');
        } catch (e) {
          return '';
        }
      }).join('\n')
      // The shadow host is featureless outside the functional :host(...)
      // form, so any compound on :root — [attr], .class, #id, :pseudo —
      // must become :host(<compound>) not :host<compound>. Same for the
      // html type selector (Tailwind class-strategy dark mode emits
      // html.dark; Pico uses html[data-theme]), which has nothing to
      // match inside the thumb's shadow tree.
      .replace(/:root((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)/g, ':host($1)').replace(/:root\b/g, ':host').replace(/(^|[\s,>~+(}])html((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)(?![-\w])/g, '$1:host($2)').replace(/(^|[\s,>~+(}])html(?![-\w])/g, '$1:host');
      // Every custom property the author references. _syncThumbHostAttrs
      // mirrors each one's *computed* value at <deck-stage> onto the
      // thumb host so the live value wins over the :host default above
      // regardless of which ancestor the tweak wrote to (<html>, <body>,
      // a wrapper div, or the deck-stage element itself all inherit
      // down to getComputedStyle(this)).
      this._authorVars = new Set(authorCss.match(/--[\w-]+/g) || []);
      try {
        if (!this._adoptedSheet) this._adoptedSheet = new CSSStyleSheet();
        this._adoptedSheet.replaceSync(authorCss);
      } catch (e) {
        this._adoptedSheet = null;
        this._authorCss = authorCss;
      }
    }
    _syncThumbHostAttrs(host, cs) {
      const de = document.documentElement;
      // setAttribute overwrites but can't delete — an attr removed from
      // <html> (toggleAttribute off, classList emptied) would linger on
      // the host and :host([data-*]) / :host(.foo) rules would keep
      // matching. Remove stale mirrored attrs first; iterate backward
      // because removeAttribute mutates the live NamedNodeMap.
      for (let i = host.attributes.length - 1; i >= 0; i--) {
        const n = host.attributes[i].name;
        if ((n.startsWith('data-') || n === 'class' || n === 'lang') && !de.hasAttribute(n)) {
          host.removeAttribute(n);
        }
      }
      for (const a of de.attributes) {
        if (a.name.startsWith('data-') || a.name === 'class' || a.name === 'lang') {
          host.setAttribute(a.name, a.value);
        }
      }
      // The :root→:host rewrite in _snapshotAuthorCss pins each custom
      // property to its stylesheet default on the thumb host, shadowing
      // the live value that would otherwise inherit. Tweaks can write the
      // live value on any ancestor — <html>, <body>, a wrapper div, the
      // deck-stage element — so read it as the *computed* value at
      // <deck-stage> (which sees the whole inheritance chain) rather than
      // trying to guess which element the author wrote to. Inline on the
      // host beats the :host{} rule. remove-stale covers vars dropped
      // from the stylesheet between snapshots.
      const vars = this._authorVars || new Set();
      for (let i = host.style.length - 1; i >= 0; i--) {
        const p = host.style[i];
        if (p.startsWith('--') && !vars.has(p)) host.style.removeProperty(p);
      }
      const live = cs || getComputedStyle(this);
      vars.forEach(p => {
        const v = live.getPropertyValue(p);
        if (v) host.style.setProperty(p, v.trim());else host.style.removeProperty(p);
      });
    }
    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKey);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('message', this._onMessage);
      window.removeEventListener('click', this._onDocClick, true);
      if (this._hideTimer) clearTimeout(this._hideTimer);
      if (this._mouseIdleTimer) clearTimeout(this._mouseIdleTimer);
      if (this._liveTimer) clearTimeout(this._liveTimer);
      if (this._tweakTimer) clearTimeout(this._tweakTimer);
      if (this._railAnimTimer) clearTimeout(this._railAnimTimer);
      if (this._scaleRaf) cancelAnimationFrame(this._scaleRaf);
      if (this._liveObserver) this._liveObserver.disconnect();
      if (this._railObserver) this._railObserver.disconnect();
      if (this._onTweakChange) window.removeEventListener('tweakchange', this._onTweakChange);
    }
    attributeChangedCallback() {
      if (this._canvas) {
        this._canvas.style.width = this.designWidth + 'px';
        this._canvas.style.height = this.designHeight + 'px';
        this._canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
        this._canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
        if (this._rail) {
          this._rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
        }
        this._fit();
        this._scaleThumbs();
        this._syncPrintPageRule();
      }
    }
    _render() {
      const style = document.createElement('style');
      style.textContent = stylesheet;
      const stage = document.createElement('div');
      stage.className = 'stage';
      const canvas = document.createElement('div');
      canvas.className = 'canvas';
      canvas.style.width = this.designWidth + 'px';
      canvas.style.height = this.designHeight + 'px';
      canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
      canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
      const slot = document.createElement('slot');
      slot.addEventListener('slotchange', this._onSlotChange);
      canvas.appendChild(slot);
      stage.appendChild(canvas);

      // Tap zones (mobile): left third = back, right third = forward.
      const tapzones = document.createElement('div');
      tapzones.className = 'tapzones export-hidden';
      tapzones.setAttribute('aria-hidden', 'true');
      tapzones.setAttribute('data-noncommentable', '');
      const tzBack = document.createElement('div');
      tzBack.className = 'tapzone tapzone--back';
      const tzMid = document.createElement('div');
      tzMid.className = 'tapzone tapzone--mid';
      tzMid.style.pointerEvents = 'none';
      const tzFwd = document.createElement('div');
      tzFwd.className = 'tapzone tapzone--fwd';
      tzBack.addEventListener('click', this._onTapBack);
      tzFwd.addEventListener('click', this._onTapForward);
      tapzones.append(tzBack, tzMid, tzFwd);

      // Overlay: compact, solid black, with clickable controls.
      const overlay = document.createElement('div');
      overlay.className = 'overlay export-hidden';
      overlay.setAttribute('role', 'toolbar');
      overlay.setAttribute('aria-label', 'Deck controls');
      overlay.setAttribute('data-noncommentable', '');
      overlay.innerHTML = `
        <button class="btn prev" type="button" aria-label="Previous slide" title="Previous (←)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <span class="count" aria-live="polite"><span class="current">1</span><span class="sep">/</span><span class="total">1</span></span>
        <button class="btn next" type="button" aria-label="Next slide" title="Next (→)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>
        </button>
        <span class="divider"></span>
        <button class="btn reset" type="button" aria-label="Reset to first slide" title="Reset (R)">Reset<span class="kbd">R</span></button>
      `;
      overlay.querySelector('.prev').addEventListener('click', () => this._advance(-1, 'click'));
      overlay.querySelector('.next').addEventListener('click', () => this._advance(1, 'click'));
      overlay.querySelector('.reset').addEventListener('click', () => this._go(0, 'click'));

      // Thumbnail rail + context menu. Thumbnails are populated in
      // _renderRail() after _collectSlides().
      const rail = document.createElement('div');
      rail.className = 'rail export-hidden';
      rail.setAttribute('data-noncommentable', '');
      rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
      // Edge auto-scroll while dragging a thumb near the rail's top/bottom
      // so off-screen drop targets are reachable. Native dragover fires
      // continuously while the pointer is stationary, so a per-event nudge
      // (ramped by edge proximity) is enough — no rAF loop needed.
      rail.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        const r = rail.getBoundingClientRect();
        const EDGE = 40;
        const dt = e.clientY - r.top;
        const db = r.bottom - e.clientY;
        if (dt < EDGE) rail.scrollTop -= Math.ceil((EDGE - dt) / 3);else if (db < EDGE) rail.scrollTop += Math.ceil((EDGE - db) / 3);
      });
      const menu = document.createElement('div');
      menu.className = 'ctxmenu export-hidden';
      menu.setAttribute('data-noncommentable', '');
      menu.innerHTML = `
        <button type="button" data-act="skip">Skip slide</button>
        <button type="button" data-act="up">Move up</button>
        <button type="button" data-act="down">Move down</button>
        <hr>
        <button type="button" data-act="delete">Delete slide</button>
      `;
      menu.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        const i = this._menuIndex;
        this._closeMenu();
        if (act === 'skip') this._toggleSkip(i);else if (act === 'up') this._moveSlide(i, i - 1);else if (act === 'down') this._moveSlide(i, i + 1);else if (act === 'delete') this._openConfirm(i);
      });
      menu.addEventListener('contextmenu', e => e.preventDefault());

      // Rail resize handle — drag to set --deck-rail-w, persisted to
      // localStorage so the width survives reloads.
      const resize = document.createElement('div');
      resize.className = 'rail-resize export-hidden';
      resize.setAttribute('data-noncommentable', '');
      resize.addEventListener('pointerdown', e => {
        e.preventDefault();
        resize.setPointerCapture(e.pointerId);
        resize.setAttribute('data-dragging', '');
        const move = ev => this._setRailWidth(ev.clientX);
        const up = () => {
          resize.removeEventListener('pointermove', move);
          resize.removeEventListener('pointerup', up);
          resize.removeEventListener('pointercancel', up);
          resize.removeAttribute('data-dragging');
          try {
            localStorage.setItem('deck-stage.railWidth', String(this._railPx));
          } catch (err) {}
        };
        resize.addEventListener('pointermove', move);
        resize.addEventListener('pointerup', up);
        resize.addEventListener('pointercancel', up);
      });

      // Delete-confirm dialog — mirrors the SPA's ConfirmDialog layout.
      const confirm = document.createElement('div');
      confirm.className = 'confirm-backdrop export-hidden';
      confirm.setAttribute('data-noncommentable', '');
      confirm.innerHTML = `
        <div class="confirm" role="dialog" aria-modal="true">
          <div class="body">
            <div class="title">Delete slide?</div>
            <div class="msg">This slide will be removed from the deck.</div>
          </div>
          <div class="footer">
            <button type="button" class="cancel">Cancel</button>
            <button type="button" class="danger">Delete</button>
          </div>
        </div>
      `;
      confirm.addEventListener('click', e => {
        if (e.target === confirm) this._closeConfirm();
      });
      confirm.querySelector('.cancel').addEventListener('click', () => this._closeConfirm());
      confirm.querySelector('.danger').addEventListener('click', () => {
        const i = this._confirmIndex;
        this._closeConfirm();
        this._deleteSlide(i);
      });
      this._root.append(style, rail, resize, stage, tapzones, overlay, menu, confirm);
      this._canvas = canvas;
      this._slot = slot;
      this._overlay = overlay;
      this._tapzones = tapzones;
      this._rail = rail;
      this._resize = resize;
      this._menu = menu;
      this._confirm = confirm;
      this._countEl = overlay.querySelector('.current');
      this._totalEl = overlay.querySelector('.total');

      // Restore persisted rail width.
      let rw = 188;
      try {
        const s = localStorage.getItem('deck-stage.railWidth');
        if (s) rw = parseInt(s, 10) || rw;
      } catch (err) {}
      this._setRailWidth(rw);
      this._syncRailHidden();
    }
    _setRailWidth(px) {
      const w = Math.max(120, Math.min(360, Math.round(px)));
      this._railPx = w;
      this.style.setProperty('--deck-rail-w', w + 'px');
      this._fit();
      // _scaleThumbs forces a sync layout (frame.offsetWidth) then writes
      // N transforms. During a resize drag this runs per-pointermove;
      // coalesce to one per frame.
      if (!this._scaleRaf) {
        this._scaleRaf = requestAnimationFrame(() => {
          this._scaleRaf = null;
          this._scaleThumbs();
        });
      }
    }

    /** @page must live in the document stylesheet — it's a no-op inside
     *  shadow DOM. Inject/update a single <head> style tag so the print
     *  sheet matches the design size and Save-as-PDF yields one slide per
     *  page with no margins. */
    _syncPrintPageRule() {
      const id = 'deck-stage-print-page';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
        document.head.appendChild(tag);
      }
      tag.textContent = '@page { size: ' + this.designWidth + 'px ' + this.designHeight + 'px; margin: 0; } ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; overflow: visible !important; height: auto !important; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }';
    }
    _onSlotChange() {
      // Rail mutations (delete/move) already reconcile synchronously and
      // emit slidechange with reason 'api'; skip the async slotchange that
      // would otherwise re-broadcast with reason 'init'.
      if (this._squelchSlotChange) {
        this._squelchSlotChange = false;
        return;
      }
      this._collectSlides();
      this._restoreIndex();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'init'
      });
      this._fit();
    }
    _collectSlides() {
      const assigned = this._slot.assignedElements({
        flatten: true
      });
      this._slides = assigned.filter(el => {
        // Skip template/style/script nodes even if someone slots them.
        const tag = el.tagName;
        return tag !== 'TEMPLATE' && tag !== 'SCRIPT' && tag !== 'STYLE';
      });
      this._slideSet = new Set(this._slides);
      this._slides.forEach((slide, i) => {
        const n = i + 1;
        slide.setAttribute('data-screen-label', `${pad2(n)} ${getSlideLabel(slide)}`);

        // Validation attribute for comment flow / auto-checks.
        if (!slide.hasAttribute('data-om-validate')) {
          slide.setAttribute('data-om-validate', VALIDATE_ATTR);
        }
        slide.setAttribute('data-deck-slide', String(i));
      });
      if (this._totalEl) this._totalEl.textContent = String(this._slides.length || 1);
      if (this._index >= this._slides.length) this._index = Math.max(0, this._slides.length - 1);
      this._markLastVisible();
      this._renderRail();
    }

    /** Tag the last non-skipped slide so print CSS can drop its
     *  break-after (see the @media print comment above — :last-child
     *  alone matches a hidden skipped slide). */
    _markLastVisible() {
      let last = null;
      this._slides.forEach(s => {
        s.removeAttribute('data-deck-last-visible');
        if (!s.hasAttribute('data-deck-skip')) last = s;
      });
      if (last) last.setAttribute('data-deck-last-visible', '');
    }
    _loadNotes() {
      const tag = document.getElementById('speaker-notes');
      if (!tag) {
        this._notes = [];
        return;
      }
      try {
        const parsed = JSON.parse(tag.textContent || '[]');
        if (Array.isArray(parsed)) this._notes = parsed;
      } catch (e) {
        console.warn('[deck-stage] Failed to parse #speaker-notes JSON:', e);
        this._notes = [];
      }
    }
    _restoreIndex() {
      // The host's ?slide= param is delivered as a #<int> hash (1-indexed) on
      // the iframe src. No hash → slide 1; the deck itself keeps no position
      // state across loads.
      const h = (location.hash || '').match(/^#(\d+)$/);
      if (h) {
        const n = parseInt(h[1], 10) - 1;
        if (n >= 0 && n < this._slides.length) this._index = n;
      }
    }
    _applyIndex({
      showOverlay = true,
      broadcast = true,
      reason = 'init'
    } = {}) {
      if (!this._slides.length) return;
      const prev = this._prevIndex == null ? -1 : this._prevIndex;
      const curr = this._index;
      // Keep the iframe's own hash in sync so an in-iframe location.reload()
      // (reload banner path in viewer-handle.ts) lands on the current slide,
      // not the stale deep-link hash from initial load.
      try {
        history.replaceState(null, '', '#' + (curr + 1));
      } catch (e) {}
      this._slides.forEach((s, i) => {
        if (i === curr) s.setAttribute('data-deck-active', '');else s.removeAttribute('data-deck-active');
      });
      if (this._countEl) this._countEl.textContent = String(curr + 1);
      // Follow-scroll on every navigation (init deep-link, keyboard, click,
      // tap, external goTo) — the only time we *don't* want the rail to
      // track current is after a rail-internal mutation, where _renderRail
      // has already restored the user's scroll position and yanking back to
      // current would undo it.
      this._syncRail(reason !== 'mutation');
      if (broadcast) {
        // (1) Legacy: host-window postMessage for speaker-notes renderers.
        try {
          window.postMessage({
            slideIndexChanged: curr,
            deckTotal: this._slides.length,
            deckSkipped: this._skippedIndices()
          }, '*');
        } catch (e) {}

        // (2) In-page CustomEvent on the <deck-stage> element itself.
        //     Bubbles and composes out of shadow DOM so slide code can listen:
        //       document.querySelector('deck-stage').addEventListener('slidechange', e => {
        //         e.detail.index, e.detail.previousIndex, e.detail.total, e.detail.slide, e.detail.reason
        //       });
        const detail = {
          index: curr,
          previousIndex: prev,
          total: this._slides.length,
          slide: this._slides[curr] || null,
          previousSlide: prev >= 0 ? this._slides[prev] || null : null,
          reason: reason // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
        };
        this.dispatchEvent(new CustomEvent('slidechange', {
          detail,
          bubbles: true,
          composed: true
        }));
      }
      this._prevIndex = curr;
      if (showOverlay) this._flashOverlay();
    }
    _flashOverlay() {
      // Host posts __omelette_presenting while in fullscreen/tab presentation
      // mode — suppress the nav footer entirely (both hover and slide-change
      // flash) so the audience sees clean slides.
      if (!this._overlay || this._presenting) return;
      this._overlay.setAttribute('data-visible', '');
      if (this._hideTimer) clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => {
        this._overlay.removeAttribute('data-visible');
      }, OVERLAY_HIDE_MS);
    }
    _railWidth() {
      // State-based, no offsetWidth: the first _fit() can run before the
      // rail has had layout on some load paths, and a 0 there paints the
      // slide full-width for one frame before the post-slotchange _fit()
      // corrects it.
      if (!this._railEnabled || !this._railVisible || this.hasAttribute('no-rail') || this.hasAttribute('noscale') || this._presenting || this._previewMode) return 0;
      return this._railPx || 0;
    }
    _fit() {
      if (!this._canvas) return;
      const stage = this._canvas.parentElement;
      // PPTX export sets noscale so the DOM capture sees authored-size
      // geometry — the scaled canvas is in shadow DOM, so the exporter's
      // resetTransformSelector can't reach .canvas.style.transform directly.
      if (this.hasAttribute('noscale')) {
        this._canvas.style.transform = 'none';
        if (stage) stage.style.left = '0';
        if (this._overlay) this._overlay.style.marginLeft = '0';
        if (this._tapzones) this._tapzones.style.left = '0';
        return;
      }
      const rw = this._railWidth();
      if (stage) stage.style.left = rw + 'px';
      // Overlay is centred on the viewport via left:50% + translate(-50%);
      // marginLeft shifts the centre by rw/2 so it lands in the middle of
      // the [rw, innerWidth] stage region. Tapzones just inset from rw.
      if (this._overlay) this._overlay.style.marginLeft = rw / 2 + 'px';
      if (this._tapzones) this._tapzones.style.left = rw + 'px';
      const vw = window.innerWidth - rw;
      const vh = window.innerHeight;
      const s = Math.min(vw / this.designWidth, vh / this.designHeight);
      this._canvas.style.transform = `scale(${s})`;
    }
    _onResize() {
      this._fit();
    }
    _onMouseMove() {
      // Keep overlay visible while mouse moves; hide after idle.
      this._flashOverlay();
    }
    _onMessage(e) {
      const d = e.data;
      if (d && typeof d.__omelette_presenting === 'boolean') {
        this._presenting = d.__omelette_presenting;
        if (this._presenting && this._overlay) {
          this._overlay.removeAttribute('data-visible');
          if (this._hideTimer) clearTimeout(this._hideTimer);
        }
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Host's Preview segment (ViewerMode='none'): the rail's drag-reorder /
      // right-click skip-delete affordances are editing chrome, so hide it
      // while the user is just looking at the deck. Same hard-hide path as
      // presenting; independent of the user's _railVisible preference so
      // returning to Edit restores whatever they had.
      if (d && typeof d.__omelette_preview_mode === 'boolean') {
        if (d.__omelette_preview_mode === this._previewMode) return;
        this._previewMode = d.__omelette_preview_mode;
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Per-viewer show/hide, driven by the TweaksPanel's auto-injected
      // "Thumbnail rail" toggle (or any author script). Independent of
      // whether the Tweaks panel itself is open — closing the panel
      // doesn't change rail visibility. Persists alongside rail width.
      if (d && d.type === '__deck_rail_visible' && typeof d.on === 'boolean') {
        if (d.on === this._railVisible) return;
        this._railVisible = d.on;
        try {
          localStorage.setItem('deck-stage.railVisible', d.on ? '1' : '0');
        } catch (e) {}
        // Arm the transition, commit it, then flip state — otherwise the
        // browser coalesces both writes and nothing animates on show.
        this.setAttribute('data-rail-anim', '');
        void (this._rail && this._rail.offsetHeight);
        this._syncRailHidden();
        this._fit();
        this._scaleThumbs();
        clearTimeout(this._railAnimTimer);
        this._railAnimTimer = setTimeout(() => this.removeAttribute('data-rail-anim'), 220);
      }
      if (d && d.type === '__omelette_rail_enabled') this._enableRail();
    }
    _syncRailHidden() {
      if (!this._rail) return;
      // data-presenting is the hard hide (display:none) for flag-off,
      // presentation mode, and the host's Preview segment — instant, no
      // transition. data-user-hidden is the soft hide (translateX(-100%))
      // for the viewer's rail toggle, so show/hide slides under
      // :host([data-rail-anim]).
      const hard = !this._railEnabled || this._presenting || this._previewMode;
      if (hard) this._rail.setAttribute('data-presenting', '');else this._rail.removeAttribute('data-presenting');
      if (!this._railVisible) this._rail.setAttribute('data-user-hidden', '');else this._rail.removeAttribute('data-user-hidden');
      // translateX hide leaves thumbs (tabIndex=0) in the tab order —
      // inert keeps them unfocusable while the rail is off-screen.
      this._rail.inert = hard || !this._railVisible;
    }
    _onTapBack(e) {
      e.preventDefault();
      this._advance(-1, 'tap');
    }
    _onTapForward(e) {
      e.preventDefault();
      this._advance(1, 'tap');
    }
    _onKey(e) {
      // Ignore when the user is typing.
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      // Confirm dialog swallows nav keys while open; Escape cancels. Enter
      // is left to the focused button's native activation so Tab→Cancel
      // →Enter activates Cancel, not the window-level confirm path.
      if (this._confirm && this._confirm.hasAttribute('data-open')) {
        if (e.key === 'Escape') {
          this._closeConfirm();
          e.preventDefault();
        }
        return;
      }
      if (e.key === 'Escape' && this._menu && this._menu.hasAttribute('data-open')) {
        this._closeMenu();
        e.preventDefault();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;
      let handled = true;
      if (key === 'ArrowRight' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
        this._advance(1, 'keyboard');
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        this._advance(-1, 'keyboard');
      } else if (key === 'Home') {
        this._go(0, 'keyboard');
      } else if (key === 'End') {
        this._go(this._slides.length - 1, 'keyboard');
      } else if (key === 'r' || key === 'R') {
        this._go(0, 'keyboard');
      } else if (/^[0-9]$/.test(key)) {
        // 1..9 jump to that slide; 0 jumps to 10.
        const n = key === '0' ? 9 : parseInt(key, 10) - 1;
        if (n < this._slides.length) this._go(n, 'keyboard');
      } else {
        handled = false;
      }
      if (handled) {
        e.preventDefault();
        this._flashOverlay();
      }
    }
    _go(i, reason = 'api') {
      if (!this._slides.length) return;
      const clamped = Math.max(0, Math.min(this._slides.length - 1, i));
      if (clamped === this._index) {
        this._flashOverlay();
        return;
      }
      this._index = clamped;
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason
      });
    }

    /** Step forward/back skipping any slide marked data-deck-skip. Falls
     *  back to _go's clamp-at-ends behaviour (flash overlay) when there's
     *  nothing further in that direction. */
    _advance(dir, reason) {
      if (!this._slides.length) return;
      let i = this._index + dir;
      while (i >= 0 && i < this._slides.length && this._slides[i].hasAttribute('data-deck-skip')) {
        i += dir;
      }
      if (i < 0 || i >= this._slides.length) {
        this._flashOverlay();
        return;
      }
      this._go(i, reason);
    }

    // ── Thumbnail rail ────────────────────────────────────────────────────
    //
    // Thumbs are keyed by slide element and reused across _renderRail()
    // calls, so a reorder/delete is an O(changed) DOM shuffle instead of an
    // O(N) teardown-and-re-clone. Each thumb starts as a lightweight shell
    // (num + empty frame); the clone is materialized lazily by an
    // IntersectionObserver when the frame scrolls into (or near) view, so
    // only visible-ish slides pay the clone + image-decode cost.

    _renderRail() {
      if (!this._rail || !this._railEnabled) {
        this._thumbs = [];
        return;
      }
      // FLIP: record each *materialized* thumb's top before the reconcile.
      // Off-screen (non-materialized) thumbs don't need the animation and
      // skipping their getBoundingClientRect saves a forced layout per
      // off-screen thumb on large decks.
      const prevTops = new Map();
      (this._thumbs || []).forEach(({
        thumb,
        slide,
        host
      }) => {
        if (host) prevTops.set(slide, thumb.getBoundingClientRect().top);
      });
      const st = this._rail.scrollTop;

      // Reconcile: reuse thumbs that already exist for a slide, create
      // shells for new slides, drop thumbs for removed slides.
      const bySlide = new Map();
      (this._thumbs || []).forEach(t => bySlide.set(t.slide, t));
      const next = [];
      this._slides.forEach(slide => {
        let t = bySlide.get(slide);
        if (t) bySlide.delete(slide);else t = this._makeThumb(slide);
        next.push(t);
      });
      // Orphans — slides removed since last render.
      bySlide.forEach(t => {
        if (this._railObserver) this._railObserver.unobserve(t.frame);
        t.thumb.remove();
      });
      // Put thumbs into document order to match _slides. insertBefore on
      // an already-correctly-placed node is a no-op, so this is cheap
      // when nothing moved.
      next.forEach((t, i) => {
        const want = t.thumb;
        const at = this._rail.children[i];
        if (at !== want) this._rail.insertBefore(want, at || null);
        t.i = i;
        t.num.textContent = String(i + 1);
        if (t.slide.hasAttribute('data-deck-skip')) t.thumb.setAttribute('data-skip', '');else t.thumb.removeAttribute('data-skip');
      });
      this._thumbs = next;
      this._rail.scrollTop = st;
      if (prevTops.size) {
        const moved = [];
        this._thumbs.forEach(({
          thumb,
          slide
        }) => {
          const old = prevTops.get(slide);
          if (old == null) return;
          const dy = old - thumb.getBoundingClientRect().top;
          if (Math.abs(dy) < 1) return;
          thumb.style.transition = 'none';
          thumb.style.transform = `translateY(${dy}px)`;
          moved.push(thumb);
        });
        if (moved.length) {
          // Commit the inverted positions before flipping the transition
          // on — otherwise the browser coalesces both style writes and
          // nothing animates.
          void this._rail.offsetHeight;
          moved.forEach(t => {
            t.style.transition = 'transform 180ms cubic-bezier(.2,.7,.3,1)';
            t.style.transform = '';
          });
          setTimeout(() => moved.forEach(t => {
            t.style.transition = '';
          }), 220);
        }
      }
      requestAnimationFrame(() => this._scaleThumbs());
      this._syncRail(false);
    }

    /** Create a lightweight thumb shell for one slide. The clone is
     *  materialized later by the IntersectionObserver. Event handlers
     *  look up the thumb's *current* index (via _thumbs.indexOf) so the
     *  same element can be reused across reorders. */
    _makeThumb(slide) {
      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      thumb.tabIndex = 0;
      const num = document.createElement('div');
      num.className = 'num';
      const frame = document.createElement('div');
      frame.className = 'frame';
      thumb.append(num, frame);
      const entry = {
        thumb,
        num,
        frame,
        slide,
        clone: null,
        host: null,
        i: -1
      };
      // entry.i is refreshed on every _renderRail reconcile pass, so
      // handlers read the thumb's current position without an O(N) scan.
      const idx = () => entry.i;
      thumb.addEventListener('click', () => this._go(idx(), 'click'));
      // ↑/↓ step through the rail when a thumb has focus. _go clamps at the
      // ends and _applyIndex→_syncRail scrolls the new current thumb into
      // view; we move focus to it (preventScroll — _syncRail already
      // scrolled) so a held key walks the whole list. stopPropagation keeps
      // this out of the window-level _onKey nav handler.
      thumb.addEventListener('keydown', e => {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        e.preventDefault();
        e.stopPropagation();
        this._go(idx() + (e.key === 'ArrowDown' ? 1 : -1), 'keyboard');
        const cur = this._thumbs && this._thumbs[this._index];
        if (cur) cur.thumb.focus({
          preventScroll: true
        });
      });
      thumb.addEventListener('contextmenu', e => {
        e.preventDefault();
        this._openMenu(idx(), e.clientX, e.clientY);
      });
      thumb.draggable = true;
      thumb.addEventListener('dragstart', e => {
        this._dragFrom = idx();
        thumb.setAttribute('data-dragging', '');
        e.dataTransfer.effectAllowed = 'move';
        try {
          e.dataTransfer.setData('text/plain', String(this._dragFrom));
        } catch (err) {}
      });
      thumb.addEventListener('dragend', () => {
        thumb.removeAttribute('data-dragging');
        this._clearDrop();
        this._dragFrom = null;
      });
      thumb.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const r = thumb.getBoundingClientRect();
        this._setDrop(idx(), e.clientY < r.top + r.height / 2 ? 'before' : 'after');
      });
      thumb.addEventListener('drop', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        const i = idx();
        const r = thumb.getBoundingClientRect();
        let to = e.clientY >= r.top + r.height / 2 ? i + 1 : i;
        if (this._dragFrom < to) to--;
        const from = this._dragFrom;
        this._clearDrop();
        this._dragFrom = null;
        if (to !== from) this._moveSlide(from, to);
      });
      if (this._railObserver) this._railObserver.observe(frame);
      frame.__deckThumb = entry;
      return entry;
    }

    /** Lazily build the clone for a thumb that has scrolled into view. */
    _materialize(entry) {
      if (entry.host) return;
      const dw = this.designWidth,
        dh = this.designHeight;
      let clone = entry.slide.cloneNode(true);
      clone.removeAttribute('id');
      clone.removeAttribute('data-deck-active');
      clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      // Neuter heavy media; replace <video> with its poster so the box
      // keeps a visual. <iframe>/<audio> become empty placeholders.
      clone.querySelectorAll('iframe, audio, object, embed').forEach(el => {
        el.removeAttribute('src');
        el.removeAttribute('srcdoc');
        el.removeAttribute('data');
        el.innerHTML = '';
      });
      clone.querySelectorAll('video').forEach(el => {
        if (!el.poster) {
          el.removeAttribute('src');
          el.innerHTML = '';
          return;
        }
        const img = document.createElement('img');
        img.src = el.poster;
        img.alt = '';
        img.style.cssText = el.style.cssText + ';object-fit:cover;width:100%;height:100%;';
        img.className = el.className;
        el.replaceWith(img);
      });
      // Images: defer decode and let the browser pick the smallest
      // srcset candidate for the ~140px thumb. Same-URL clones reuse the
      // slide's decoded bitmap (URL-keyed cache), so the remaining cost
      // is paint/composite — lazy+async keeps that off the main thread.
      clone.querySelectorAll('img').forEach(el => {
        el.loading = 'lazy';
        el.decoding = 'async';
        if (el.srcset) el.sizes = (this._railPx || 188) + 'px';
      });
      // Custom elements inside the slide would have their
      // connectedCallback fire when the clone is appended. Replace them
      // with inert boxes so a component-heavy deck doesn't run N copies
      // of each component's mount logic in the rail. Children are
      // preserved so layout-wrapper elements (<my-column><h2>…</h2>)
      // still show their authored content; the querySelectorAll NodeList
      // is static, so nested custom elements in the moved subtree are
      // still visited on later iterations.
      const neuter = el => {
        const box = document.createElement('div');
        box.style.cssText = (el.getAttribute('style') || '') + ';background:rgba(0,0,0,0.06);border:1px dashed rgba(0,0,0,0.15);';
        box.className = el.className;
        // Preserve theming/i18n hooks so [data-*] / :lang() / [dir]
        // descendant selectors still match the neutered root.
        for (const a of el.attributes) {
          const n = a.name;
          if (n.startsWith('data-') || n.startsWith('aria-') || n === 'lang' || n === 'dir' || n === 'role' || n === 'title') {
            box.setAttribute(n, a.value);
          }
        }
        while (el.firstChild) box.appendChild(el.firstChild);
        return box;
      };
      // querySelectorAll('*') returns descendants only — a custom-element
      // slide root (<my-slide>…</my-slide>) would slip through and upgrade
      // on append. Swap the root first.
      if (clone.tagName.includes('-')) clone = neuter(clone);
      clone.querySelectorAll('*').forEach(el => {
        if (el.tagName.includes('-')) el.replaceWith(neuter(el));
      });
      clone.style.cssText += ';position:absolute;top:0;left:0;transform-origin:0 0;' + 'pointer-events:none;width:' + dw + 'px;height:' + dh + 'px;' + 'box-sizing:border-box;overflow:hidden;visibility:visible;opacity:1;';
      const host = document.createElement('div');
      host.style.cssText = 'position:absolute;inset:0;';
      this._syncThumbHostAttrs(host);
      const sr = host.attachShadow({
        mode: 'open'
      });
      if (this._adoptedSheet) sr.adoptedStyleSheets = [this._adoptedSheet];else {
        const st = document.createElement('style');
        st.textContent = this._authorCss || '';
        sr.appendChild(st);
      }
      sr.appendChild(clone);
      entry.frame.appendChild(host);
      entry.host = host;
      entry.clone = clone;
      if (this._thumbScale) clone.style.transform = 'scale(' + this._thumbScale + ')';
      // Once materialized the IO callback is a no-op early-return —
      // unobserve so scroll doesn't keep firing it.
      if (this._railObserver) this._railObserver.unobserve(entry.frame);
    }

    /** Re-clone a single thumb (live-update path). No-op if the thumb
     *  hasn't been materialized yet — it'll pick up current content when
     *  it scrolls into view. */
    _refreshThumb(slide) {
      const entry = (this._thumbs || []).find(t => t.slide === slide);
      if (!entry || !entry.host) return;
      entry.host.remove();
      entry.host = entry.clone = null;
      this._materialize(entry);
    }
    _scaleThumbs() {
      if (!this._thumbs || !this._thumbs.length) return;
      // Every frame is the same width; if it reads 0 the rail is
      // display:none (noscale / no-rail / presenting / print) — leave the
      // clones as-is and re-run when the rail is revealed.
      const fw = this._thumbs[0].frame.offsetWidth;
      if (!fw) return;
      this._thumbScale = fw / this.designWidth;
      this._thumbs.forEach(({
        clone
      }) => {
        if (clone) clone.style.transform = 'scale(' + this._thumbScale + ')';
      });
    }
    _setDrop(i, where) {
      // dragover fires at pointer-event rate; touch only the previous
      // and new target rather than sweeping all N thumbs.
      const t = this._thumbs && this._thumbs[i];
      if (this._dropOn && this._dropOn !== t) {
        this._dropOn.thumb.removeAttribute('data-drop');
      }
      if (t) t.thumb.setAttribute('data-drop', where);
      this._dropOn = t || null;
    }
    _clearDrop() {
      if (this._dropOn) this._dropOn.thumb.removeAttribute('data-drop');
      this._dropOn = null;
    }
    _syncRail(follow) {
      if (!this._thumbs) return;
      this._thumbs.forEach(({
        thumb
      }, i) => {
        if (i === this._index) {
          thumb.setAttribute('data-current', '');
          if (follow && typeof thumb.scrollIntoView === 'function') {
            thumb.scrollIntoView({
              block: 'nearest'
            });
          }
        } else {
          thumb.removeAttribute('data-current');
        }
      });
    }
    _openMenu(i, x, y) {
      if (!this._menu) return;
      this._menuIndex = i;
      const slide = this._slides[i];
      const skip = slide && slide.hasAttribute('data-deck-skip');
      this._menu.querySelector('[data-act="skip"]').textContent = skip ? 'Unskip slide' : 'Skip slide';
      this._menu.querySelector('[data-act="up"]').disabled = i <= 0;
      this._menu.querySelector('[data-act="down"]').disabled = i >= this._slides.length - 1;
      this._menu.querySelector('[data-act="delete"]').disabled = this._slides.length <= 1;
      // Place, then clamp to viewport after it's measurable.
      this._menu.style.left = x + 'px';
      this._menu.style.top = y + 'px';
      this._menu.setAttribute('data-open', '');
      const r = this._menu.getBoundingClientRect();
      const nx = Math.min(x, window.innerWidth - r.width - 4);
      const ny = Math.min(y, window.innerHeight - r.height - 4);
      this._menu.style.left = Math.max(4, nx) + 'px';
      this._menu.style.top = Math.max(4, ny) + 'px';
    }
    _closeMenu() {
      if (this._menu) this._menu.removeAttribute('data-open');
      this._menuIndex = -1;
    }
    _openConfirm(i) {
      if (!this._confirm) return;
      this._confirmIndex = i;
      this._confirm.querySelector('.title').textContent = 'Delete slide ' + (i + 1) + '?';
      this._confirm.setAttribute('data-open', '');
      const btn = this._confirm.querySelector('.danger');
      if (btn && btn.focus) btn.focus();
    }
    _closeConfirm() {
      if (this._confirm) this._confirm.removeAttribute('data-open');
      this._confirmIndex = -1;
    }
    _emitDeckChange(detail) {
      this.dispatchEvent(new CustomEvent('deckchange', {
        detail,
        bubbles: true,
        composed: true
      }));
    }
    _deleteSlide(i) {
      const slide = this._slides[i];
      if (!slide || this._slides.length <= 1) return;
      const wasCurrent = i === this._index;
      if (i < this._index || wasCurrent && i === this._slides.length - 1) this._index--;
      this._squelchSlotChange = true;
      slide.remove();
      this._emitDeckChange({
        action: 'delete',
        from: i,
        slide
      });
      this._collectSlides();
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason: 'mutation'
      });
    }
    _toggleSkip(i) {
      const slide = this._slides[i];
      if (!slide) return;
      const on = !slide.hasAttribute('data-deck-skip');
      if (on) slide.setAttribute('data-deck-skip', '');else slide.removeAttribute('data-deck-skip');
      if (this._thumbs && this._thumbs[i]) {
        if (on) this._thumbs[i].thumb.setAttribute('data-skip', '');else this._thumbs[i].thumb.removeAttribute('data-skip');
      }
      this._markLastVisible();
      this._emitDeckChange({
        action: on ? 'skip' : 'unskip',
        from: i,
        slide
      });
      // Re-broadcast so the presenter popup's prev/next thumbnails re-pick
      // the nearest non-skipped slide without waiting for a nav event.
      try {
        window.postMessage({
          slideIndexChanged: this._index,
          deckTotal: this._slides.length,
          deckSkipped: this._skippedIndices()
        }, '*');
      } catch (e) {}
    }
    _skippedIndices() {
      const out = [];
      for (let i = 0; i < this._slides.length; i++) {
        if (this._slides[i].hasAttribute('data-deck-skip')) out.push(i);
      }
      return out;
    }
    _moveSlide(i, j) {
      if (j < 0 || j >= this._slides.length || j === i) return;
      const slide = this._slides[i];
      const ref = j < i ? this._slides[j] : this._slides[j].nextSibling;
      // Track the active slide across the reorder so the same content
      // stays on screen.
      const cur = this._index;
      if (cur === i) this._index = j;else if (i < cur && j >= cur) this._index = cur - 1;else if (i > cur && j <= cur) this._index = cur + 1;
      this._squelchSlotChange = true;
      this.insertBefore(slide, ref);
      this._emitDeckChange({
        action: 'move',
        from: i,
        to: j,
        slide
      });
      this._collectSlides();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'mutation'
      });
    }

    // Public API ------------------------------------------------------------

    /** Current slide index (0-based). */
    get index() {
      return this._index;
    }
    /** Total slide count. */
    get length() {
      return this._slides.length;
    }
    /** Programmatically navigate. */
    goTo(i) {
      this._go(i, 'api');
    }
    next() {
      this._advance(1, 'api');
    }
    prev() {
      this._advance(-1, 'api');
    }
    reset() {
      this._go(0, 'api');
    }
  }
  if (!customElements.get('deck-stage')) {
    customElements.define('deck-stage', DeckStage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "deck-stage.js", error: String((e && e.message) || e) }); }

// design-canvas.jsx
try { (() => {
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
  // isolation:isolate contains artboard content's z-indexes so a
  // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
  // the .dc-menu popover that drops into the top of the card.
  '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}',
  // Per-artboard header: grip + label on the left, delete/expand on the
  // right. Single flex row; when the artboard's on-screen width is too
  // narrow for both the label yields (ellipsis, then hidden entirely below
  // ~4ch via the container query) and the buttons stay on the row.
  '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;', '  display:flex;align-items:center;container-type:inline-size}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}', '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;', '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
  // Below ~4ch of label room: hide the label entirely, and drop the grip to
  // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
  // until the card is moused.
  '@container (max-width: 110px){', '  .dc-labeltext{display:none}', '  .dc-grip{opacity:0}', '  [data-dc-slot]:hover .dc-grip{opacity:1}', '}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}', '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}', '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}', '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}', '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;', '  font:inherit;transition:background .12s,color .12s}', '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
  // Slot hosting an open menu floats above later siblings (which otherwise
  // paint on top — same z-index:auto, later DOM order) so the popup isn't
  // clipped by the next card.
  '[data-dc-slot]:has(.dc-menu){z-index:10}', '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;', '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}', '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;', '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;', '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}', '.dc-menu button:hover{background:rgba(0,0,0,.05)}', '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}', '.dc-menu .dc-danger{color:#c96442}', '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
  // Chrome (titles / labels / buttons) counter-scales against the viewport
  // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
  // DCViewport on every transform update and inherits to all descendants —
  // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
  // it the same way.
  //
  // The header uses transform:scale (out-of-flow, so layout impact doesn't
  // matter) with its world-space width set to card-width / inv-zoom so that
  // after counter-scaling its on-screen width exactly matches the card's —
  // that's what lets the container query + text-overflow behave against the
  // card's visible edge at every zoom level.
  //
  // The section head uses CSS zoom instead of transform so its layout box
  // grows with the counter-scale, pushing the card row down — otherwise the
  // constant-screen-size title would overflow into the (shrinking) world-
  // space gap and overlap the artboard headers at low zoom.
  '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));', '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}', '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// Recursively unwrap React.Fragment so <>…</> grouping doesn't hide
// DCSection/DCArtboard children from the type-based walks below.
function dcFlatten(children) {
  const out = [];
  React.Children.forEach(children, c => {
    if (c && c.type === React.Fragment) out.push(...dcFlatten(c.props.children));else out.push(c);
  });
  return out;
}

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Fragments are flattened; wrapping in other
  // elements still opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  dcFlatten(children).forEach(sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    dcFlatten(sec.props.children).forEach(ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? persisted.hidden || [] : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  // Persist viewport across reloads so the user lands back where they were
  // after an agent edit or browser refresh. The sandbox origin is already
  // per-project; pathname keeps multiple canvas files in one project apart.
  const tfKey = 'dc-viewport:' + location.pathname;
  const saveT = React.useRef(0);
  const lastPostedScale = React.useRef();
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Exposed for zoom-invariant chrome (labels, buttons, TweaksPanel).
    el.style.setProperty('--dc-inv-zoom', String(1 / scale));
    // Keep the host toolbar's % readout in sync with the canvas scale. Pan
    // ticks leave scale unchanged — skip the cross-frame post for those.
    if (lastPostedScale.current !== scale) {
      lastPostedScale.current = scale;
      window.parent.postMessage({
        type: '__dc_zoom',
        scale
      }, '*');
    }
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    }, 200);
  }, [tfKey]);
  React.useLayoutEffect(() => {
    const flush = () => {
      clearTimeout(saveT.current);
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    };
    try {
      const s = JSON.parse(localStorage.getItem(tfKey) || 'null');
      if (s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.scale)) {
        tf.current = {
          x: s.x,
          y: s.y,
          scale: Math.min(maxScale, Math.max(minScale, s.scale))
        };
        apply();
      }
    } catch {}
    // Flush on pagehide and unmount so a reload within the 200ms debounce
    // window doesn't drop the last pan/zoom.
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // --dc-inv-zoom consumers (.dc-sectionhead's CSS zoom, each section's
      // marginBottom) reflow on every scale change, vertically shifting the
      // world layout — so a world point mathematically pinned under the cursor
      // drifts as you zoom (content creeps up on zoom-in, down on zoom-out).
      // Anchor the DOM element under the cursor instead: record its screen Y,
      // apply the transform + --dc-inv-zoom, then cancel whatever vertical
      // drift the reflow introduced so it stays put on screen.
      let marker = null,
        markerY0 = 0;
      if (k !== 1) {
        const hit = document.elementFromPoint(cx, cy);
        marker = hit && hit.closest ? hit.closest('[data-dc-slot],[data-dc-section]') : null;
        if (marker) markerY0 = marker.getBoundingClientRect().top;
      }
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
      if (marker) {
        // A pure zoom around (cx, cy) maps screen Y → cy + (Y - cy) * k. Any
        // departure after the --dc-inv-zoom reflow is the layout drift.
        const drift = marker.getBoundingClientRect().top - (cy + (markerY0 - cy) * k);
        if (Math.abs(drift) > 0.1) {
          t.y -= drift;
          apply();
        }
      }
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if ((e.ctrlKey || e.metaKey) && !isMouseWheel(e)) {
        // trackpad pinch, or ctrl/cmd + smooth-scroll mouse. Notched
        // wheels fall through to the fixed-step branch below.
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    // Host-driven zoom (toolbar % menu). Zooms around viewport centre so the
    // visible midpoint stays fixed — matching the host's iframe-zoom feel.
    const onHostMsg = e => {
      const d = e.data;
      if (d && d.type === '__dc_set_zoom' && typeof d.scale === 'number') {
        const r = vp.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, d.scale / tf.current.scale);
      } else if (d && d.type === '__dc_probe') {
        // Host's [readyGen] reset asks whether a canvas is present; it
        // fires on the iframe's native 'load', which for canvases with
        // images/fonts is after our mount-time announce, so re-announce.
        // Clear the pan-tick guard so apply() re-posts the current scale
        // even if it's unchanged — the host just reset dcScale to 1.
        window.parent.postMessage({
          type: '__dc_present'
        }, '*');
        lastPostedScale.current = undefined;
        apply();
      }
    };
    window.addEventListener('message', onHostMsg);
    // Announce canvas mode so the host toolbar proxies its % control here
    // instead of scaling the iframe element (which would just shrink the
    // viewport window of an infinite canvas). The apply() that follows emits
    // the initial __dc_zoom so the toolbar % is correct before first pinch.
    // lastPostedScale reset mirrors the __dc_probe handler: the layout
    // effect's restore-path apply() may already have posted the restored
    // scale (before __dc_present), so clear the guard to re-post it in order.
    window.parent.postMessage({
      type: '__dc_present'
    }, '*');
    lastPostedScale.current = undefined;
    apply();
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('message', onHostMsg);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(dcFlatten(children));
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const sec = ctx && sid && ctx.section(sid) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map(a => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? sec.hidden || [] : [];
  const srcOrder = allIds.filter(k => !hidden.includes(k));
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-sectionhead",
    style: {
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onDelete: () => ctx && ctx.patchSection(sid, x => ({
      hidden: [...(x.srcKey === srcKey ? x.hidden || [] : []), k],
      srcKey
    })),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}

// Per-artboard export (kind: 'png' | 'html'). Both paths share the same
// self-contained clone: computed styles baked in, @font-face / <img> /
// inline-style background-image urls inlined as data URIs. PNG wraps the
// clone in foreignObject→canvas at 3× the artboard's natural width×height
// (same pipeline the host uses for page captures); HTML wraps it in a
// minimal standalone document. Both are independent of viewport zoom.
async function dcExport(node, w, h, name, kind) {
  try {
    await document.fonts.ready;
  } catch {}
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);

  // Collect @font-face rules. ss.cssRules throws SecurityError on
  // cross-origin sheets (e.g. fonts.googleapis.com) — in that case fetch
  // the CSS text directly (those endpoints send ACAO:*) and regex-extract
  // the blocks. @import and @media/@supports are walked so nested
  // @font-face rules aren't missed.
  const fontRules = [],
    pending = [],
    seen = new Set();
  const scrapeCss = href => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(fetch(href).then(r => r.text()).then(css => {
      for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
        css: m,
        base: href
      });
      for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
    }).catch(() => {}));
  };
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
        css: r.cssText,
        base
      });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
        const ibase = r.styleSheet.href || base;
        try {
          walk(r.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (r.cssRules) walk(r.cssRules, base);
    }
  };
  for (const ss of document.styleSheets) {
    const base = ss.href || location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();
  const fontCss = (await Promise.all(fontRules.map(async rule => {
    let out = rule.css,
      m;
    const re = /url\((['"]?)([^'")]+)\1\)/g;
    while (m = re.exec(rule.css)) {
      if (m[2].indexOf('data:') === 0) continue;
      let abs;
      try {
        abs = new URL(m[2], rule.base).href;
      } catch {
        continue;
      }
      out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
    }
    return out;
  }))).join('\n');
  const cloneStyled = src => {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
      if (src.tagName === 'CANVAS') try {
        const im = document.createElement('img');
        im.src = src.toDataURL();
        im.setAttribute('style', txt);
        return im;
      } catch {}
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };
  const clone = cloneStyled(node);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  // Drop the card's own shadow/radius so the export is a flush w×h rect;
  // the artboard's own background (if any) is already in the computed style.
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  const jobs = [];
  clone.querySelectorAll('img').forEach(el => {
    const s = el.getAttribute('src');
    if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(el.src).then(d => el.setAttribute('src', d)));
  });
  [clone, ...clone.querySelectorAll('*')].forEach(el => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while (m = re.exec(bg)) {
      const tok = m[0],
        url = m[1];
      if (url.indexOf('data:') === 0) continue;
      jobs.push(toDataURL(url).then(d => {
        el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
      }));
    }
  });
  await Promise.all(jobs);
  const xml = new XMLSerializer().serializeToString(clone);
  const save = (blob, ext) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  if (kind === 'html') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title>' + (fontCss ? '<style>' + fontCss + '</style>' : '') + '</head><body style="margin:0">' + xml + '</body></html>';
    return save(new Blob([html], {
      type: 'text/html'
    }), 'html');
  }

  // PNG: the SVG's own width/height must be the output resolution — an
  // <img>-loaded SVG rasterizes at its intrinsic size, so sizing it at 1×
  // and ctx.scale()-ing up would just upscale a 1× bitmap. viewBox maps the
  // w×h foreignObject onto the px·w × px·h SVG canvas so the browser renders
  // the HTML at full resolution.
  const px = 3;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const cv = document.createElement('canvas');
  cv.width = w * px;
  cv.height = h * px;
  cv.getContext('2d').drawImage(img, 0, 0);
  cv.toBlob(blob => save(blob, 'png'), 'image/png');
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus,
  onDelete
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // ⋯ menu: close on any outside pointerdown. Two-click delete lives inside
  // the menu — first click arms the row, second commits; closing disarms.
  React.useEffect(() => {
    if (!menuOpen) {
      setConfirming(false);
      return;
    }
    const off = e => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);
  const doExport = kind => {
    setMenuOpen(false);
    if (!cardRef.current) return;
    const name = String(label || id || 'artboard').replace(/[^\w\s.-]+/g, '_');
    dcExport(cardRef.current, width, height, name, kind).catch(e => console.error('[design-canvas] export failed:', e));
  };

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-header",
    "data-noncommentable": "",
    style: {
      color: DC.label
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-btns"
  }, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dc-kebab",
    title: "More",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2.5",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "6",
    r: "1.1"
  }))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "dc-menu",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('png')
  }, "Download PNG"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('html')
  }, "Download HTML"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "dc-danger",
    onClick: () => {
      if (confirming) {
        setMenuOpen(false);
        onDelete();
      } else setConfirming(true);
    }
  }, confirming ? 'Click again to delete' : 'Delete'))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    // Sections whose artboards are all deleted have slotIds:[] — step past
    // them to the next non-empty section so ↑/↓ doesn't dead-end.
    const n = sectionOrder.length;
    for (let i = 1; i < n; i++) {
      const ns = sectionOrder[((secIdx + d * i) % n + n) % n];
      const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
      if (first) {
        ctx.setFocus(`${ns}/${first}`);
        return;
      }
    }
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.filter(sid => sectionMeta[sid].slotIds.length).map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design-canvas.jsx", error: String((e && e.message) || e) }); }

// pc-artboards-apps.jsx
try { (() => {
/* Prime Circle — Artboards · Part 4: Applications */

const D_INK = '#0E0E0E';
const D_INK_2 = '#1C1C1C';
const D_INK_3 = '#171513';
const D_GOLD = '#C9A84C';
const D_GOLD_D = '#8B7340';
const D_IVORY = '#F5F1E6';
const D_IVORY_2 = '#E8E0CC';

/* Business card */
function PCArtCard() {
  const Front = () => /*#__PURE__*/React.createElement("div", {
    style: {
      width: 520,
      height: 325,
      borderRadius: 8,
      boxShadow: '0 40px 80px -30px rgba(0,0,0,0.7), 0 12px 30px -10px rgba(0,0,0,0.5)',
      overflow: 'hidden',
      position: 'relative',
      background: D_INK,
      color: D_IVORY
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      padding: '36px 36px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      letterSpacing: '0.4em',
      color: D_GOLD
    }
  }, "EST \xB7 MMXXIV"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 64,
    color: D_IVORY,
    accent: D_GOLD,
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: '-0.025em'
    }
  }, "Prime Circle"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      letterSpacing: '0.4em',
      color: D_GOLD
    }
  }, "REAL ESTATE NETWORK")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      letterSpacing: '0.3em',
      color: D_GOLD_D
    }
  }, "S\xC3O PAULO \xB7 BR"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      letterSpacing: '0.3em',
      color: D_GOLD_D
    }
  }, "PRIMECIRCLE.APP.BR"))));
  const Back = () => /*#__PURE__*/React.createElement("div", {
    style: {
      width: 520,
      height: 325,
      borderRadius: 8,
      boxShadow: '0 40px 80px -30px rgba(0,0,0,0.7), 0 12px 30px -10px rgba(0,0,0,0.5)',
      overflow: 'hidden',
      position: 'relative',
      background: D_IVORY,
      color: D_INK
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      padding: '30px 32px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      letterSpacing: '0.4em',
      color: D_GOLD_D
    }
  }, "CRECI-SP \xB7 184.392-F"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 34,
      fontStyle: 'italic',
      fontWeight: 500,
      lineHeight: 1
    }
  }, "Helena Vasconcelos"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 11,
      marginTop: 6,
      color: '#444',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, "Corretora \xB7 Im\xF3veis Residenciais")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 11,
      lineHeight: 1.7
    }
  }, /*#__PURE__*/React.createElement("div", null, "helena@primecircle.app.br"), /*#__PURE__*/React.createElement("div", null, "+55 11 9 8723\xB74109"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      color: D_GOLD_D,
      letterSpacing: '0.2em',
      marginTop: 6
    }
  }, "PRIMECIRCLE.APP.BR")), /*#__PURE__*/React.createElement(PCMark, {
    size: 50,
    color: D_INK,
    accent: D_GOLD_D,
    strokeWidth: 3.5
  }))));
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: D_INK_3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl"
  }, "12 \xB7 CART\xC3O DE MEMBRO"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr"
  }, "85 \xD7 55 mm \xB7 ALGOD\xC3O 350g"), /*#__PURE__*/React.createElement("div", {
    className: "corner br"
  }, "HOT STAMPING OURO"), /*#__PURE__*/React.createElement("div", {
    style: {
      transform: 'rotate(-4deg)'
    }
  }, /*#__PURE__*/React.createElement(Front, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      transform: 'rotate(3deg)'
    }
  }, /*#__PURE__*/React.createElement(Back, null)));
}

/* Instagram posts */
function PCArtSocial() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: D_INK_3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 32,
      padding: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl"
  }, "13 \xB7 INSTAGRAM"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr"
  }, "FEED \xB7 1080 \xD7 1080"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380,
      height: 380,
      background: D_INK,
      color: D_IVORY,
      borderRadius: 10,
      padding: 32,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.4em',
      color: D_GOLD
    }
  }, "OPORTUNIDADE \xB7 #4128"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 44,
      fontStyle: 'italic',
      lineHeight: 1.05,
      marginTop: 16,
      fontWeight: 500
    }
  }, "Cobertura", /*#__PURE__*/React.createElement("br", null), "Vila Nova", /*#__PURE__*/React.createElement("br", null), "Concei\xE7\xE3o."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.2em',
      padding: '5px 11px',
      border: `1px solid ${D_GOLD}`,
      color: D_GOLD,
      borderRadius: 99
    }
  }, "340 m\xB2"), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.2em',
      padding: '5px 11px',
      border: `1px solid ${D_GOLD}`,
      color: D_GOLD,
      borderRadius: 99
    }
  }, "4 SU\xCDTES"), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.2em',
      padding: '5px 11px',
      border: `1px solid ${D_GOLD}`,
      color: D_GOLD,
      borderRadius: 99
    }
  }, "R$ 12.8M")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 26,
      left: 32,
      right: 32,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      letterSpacing: '0.4em',
      color: D_GOLD_D
    }
  }, "PARCERIA \xB7 50/50"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 11,
      marginTop: 4,
      color: D_IVORY_2
    }
  }, "Aberta at\xE9 12\xB706")), /*#__PURE__*/React.createElement(PCMark, {
    size: 40,
    color: D_IVORY,
    accent: D_GOLD,
    strokeWidth: 4
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380,
      height: 380,
      background: D_IVORY,
      color: D_INK,
      borderRadius: 10,
      padding: 32,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.4em',
      color: D_GOLD_D
    }
  }, "MANIFESTO \xB7 03"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 34,
      fontStyle: 'italic',
      lineHeight: 1.1,
      marginTop: 24,
      fontWeight: 500
    }
  }, "\"Voc\xEA n\xE3o precisa de mais um grupo. ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: D_GOLD_D
    }
  }, "Precisa de uma mesa."), "\""), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 26,
      left: 32,
      right: 32,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.3em',
      color: D_GOLD_D
    }
  }, "PRIME CIRCLE"), /*#__PURE__*/React.createElement(PCMark, {
    size: 40,
    color: D_INK,
    accent: D_GOLD_D,
    strokeWidth: 4
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380,
      height: 380,
      background: D_GOLD,
      color: D_INK,
      borderRadius: 10,
      padding: 32,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.4em'
    }
  }, "CADASTRO \xB7 PROFISSIONAL"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 38,
      fontStyle: 'italic',
      lineHeight: 1.05,
      marginTop: 18,
      fontWeight: 500
    }
  }, "Bem-vinda", /*#__PURE__*/React.createElement("br", null), "ao C\xEDrculo,", /*#__PURE__*/React.createElement("br", null), "Helena."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 13,
      marginTop: 14,
      maxWidth: 280,
      lineHeight: 1.55
    }
  }, "Sua mesa de trabalho profissional est\xE1 pronta. 12.347 corretores ativos."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 26,
      left: 32,
      right: 32,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      letterSpacing: '0.3em'
    }
  }, "PROFISSIONAL \xB7 00237"), /*#__PURE__*/React.createElement(PCMark, {
    size: 40,
    color: D_INK,
    accent: D_INK,
    strokeWidth: 4,
    variant: "mono"
  }))));
}

/* App icon scale */
function PCArtAppIcon() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: D_IVORY_2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl",
    style: {
      color: D_INK
    }
  }, "14 \xB7 APP ICON"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr",
    style: {
      color: D_INK
    }
  }, "iOS \xB7 ANDROID \xB7 FAVICON"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(PCIconTile, {
    size: 220,
    bg: D_INK,
    color: D_IVORY,
    accent: D_GOLD
  }), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.32em',
      color: D_GOLD_D
    }
  }, "PRIM\xC1RIO \xB7 1024px")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 18
    }
  }, [128, 96, 64, 40, 24].map(sz => /*#__PURE__*/React.createElement("div", {
    key: sz,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(PCIconTile, {
    size: sz,
    bg: D_INK,
    color: D_IVORY,
    accent: D_GOLD
  }), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      color: '#444'
    }
  }, sz, "px")))));
}

/* Email signature */
function PCArtEmailSignature() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: D_IVORY,
      color: D_INK,
      padding: '56px 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl",
    style: {
      color: D_INK
    }
  }, "15 \xB7 ASSINATURA DE E-MAIL"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr",
    style: {
      color: D_INK
    }
  }, "HTML \xB7 MOBILE-FIRST"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.4em',
      color: D_GOLD_D
    }
  }, "E-MAIL \xB7 ASSINATURA"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 56,
      fontStyle: 'italic',
      fontWeight: 500,
      marginTop: 6
    }
  }, "Termina cada conversa.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 32,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: `1px solid ${D_INK}11`,
      borderRadius: 8,
      padding: 32,
      boxShadow: '0 20px 40px -20px rgba(14,14,14,0.18)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${D_INK}11`,
      paddingBottom: 18,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 13,
      color: '#555'
    }
  }, "Para: contato@construtora-xyz.com"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 13,
      color: '#555',
      marginTop: 4
    }
  }, "Assunto: Encontramos o comprador.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 15,
      lineHeight: 1.6,
      color: '#1c1c1c'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "Marina, bom dia."), /*#__PURE__*/React.createElement("p", null, "Movimentei o caso 4128 com um membro do C\xEDrculo \u2014 proposta cheia, condi\xE7\xF5es alinhadas. Conversamos hoje \xE0s 16h?"), /*#__PURE__*/React.createElement("p", null, "Helena")), /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 0,
      borderTop: `1px solid ${D_INK}11`,
      margin: '28px 0 22px'
    }
  }), /*#__PURE__*/React.createElement("table", {
    cellPadding: "0",
    cellSpacing: "0",
    style: {
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      paddingRight: 20,
      verticalAlign: 'top'
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 64,
    color: D_INK,
    accent: D_GOLD_D,
    strokeWidth: 3
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      verticalAlign: 'top',
      borderLeft: `1px solid ${D_INK}22`,
      paddingLeft: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontStyle: 'italic',
      fontSize: 22,
      fontWeight: 500,
      color: D_INK
    }
  }, "Helena Vasconcelos"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 11,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#666',
      marginTop: 2
    }
  }, "Senior Partner \xB7 Prime Circle"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 12,
      color: '#333',
      marginTop: 10,
      lineHeight: 1.7
    }
  }, "helena@primecircle.app.br \xB7 +55 11 9 8723\xB74109"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: D_GOLD_D,
      letterSpacing: '0.32em',
      marginTop: 6
    }
  }, "PRIMECIRCLE.APP.BR")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: `1px solid ${D_INK}11`,
      borderRadius: 6,
      padding: '18px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.32em',
      color: D_GOLD_D
    }
  }, "FORMATO"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 22,
      fontStyle: 'italic',
      marginTop: 2
    }
  }, "Tabela HTML \u2014 render universal")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: `1px solid ${D_INK}11`,
      borderRadius: 6,
      padding: '18px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.32em',
      color: D_GOLD_D
    }
  }, "S\xCDMBOLO"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 22,
      fontStyle: 'italic',
      marginTop: 2
    }
  }, "PCMark 64px \xB7 duotone ink + ouro antigo")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: `1px solid ${D_INK}11`,
      borderRadius: 6,
      padding: '18px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.32em',
      color: D_GOLD_D
    }
  }, "TIPOGRAFIA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 22,
      fontStyle: 'italic',
      marginTop: 2
    }
  }, "Nome em Cormorant it\xE1lico \xB7 resto em Manrope")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: `1px solid ${D_INK}11`,
      borderRadius: 6,
      padding: '18px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.32em',
      color: D_GOLD_D
    }
  }, "REGRA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 22,
      fontStyle: 'italic',
      marginTop: 2
    }
  }, "Sem links sociais inline \xB7 sem cita\xE7\xE3o motivacional")))));
}

/* App / dashboard preview */
function PCArtAppPreview() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: D_INK_3,
      color: D_IVORY,
      padding: '48px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl"
  }, "16 \xB7 PRODUTO DIGITAL"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr"
  }, "DASHBOARD \xB7 DESKTOP"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.4em',
      color: D_GOLD
    }
  }, "PRODUTO"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 48,
      fontStyle: 'italic',
      fontWeight: 500,
      marginTop: 4
    }
  }, "O C\xEDrculo, na tela.")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: D_INK,
      borderRadius: 10,
      boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6)',
      overflow: 'hidden',
      border: `1px solid ${D_IVORY}11`,
      height: 'calc(100% - 200px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px 20px',
      borderBottom: `1px solid ${D_IVORY}10`,
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(PCLockupInline, {
    size: 140,
    color: D_IVORY,
    accent: D_GOLD
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 24,
      display: 'flex',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 12,
      color: D_GOLD,
      fontWeight: 600
    }
  }, "Demandas"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 12,
      color: D_IVORY_2,
      opacity: 0.6
    }
  }, "Ofertas"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 12,
      color: D_IVORY_2,
      opacity: 0.6
    }
  }, "Parcerias"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 12,
      color: D_IVORY_2,
      opacity: 0.6
    }
  }, "Membros")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      letterSpacing: '0.3em',
      color: D_GOLD_D
    }
  }, "HV \xB7 #00237"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: D_GOLD,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: D_INK,
      fontWeight: 700,
      fontSize: 11
    }
  }, "HV"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 20,
      padding: 24,
      height: 'calc(100% - 60px)',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 500,
      lineHeight: 1
    }
  }, "Demandas abertas"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 13,
      color: D_IVORY_2,
      marginTop: 4
    }
  }, "12 vis\xEDveis a voc\xEA \xB7 3 novas hoje")), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.3em',
      color: D_GOLD,
      padding: '8px 14px',
      border: `1px solid ${D_GOLD}`,
      borderRadius: 99
    }
  }, "+ NOVA")), [{
    id: '#4128',
    t: 'Cobertura · Vila Nova Conceição',
    a: '340 m² · R$ 12.8M',
    tags: ['50/50', '8 membros']
  }, {
    id: '#4126',
    t: 'Apto · Jardins · vista parque',
    a: '220 m² · R$ 7.5M',
    tags: ['60/40', '4 membros']
  }, {
    id: '#4124',
    t: 'Casa térrea · Alto de Pinheiros',
    a: '480 m² · R$ 18M',
    tags: ['50/50', '11 membros']
  }].map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px 18px',
      borderBottom: `1px solid ${D_IVORY}10`,
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 28,
    color: D_IVORY,
    accent: D_GOLD,
    strokeWidth: 4
  }), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.3em',
      color: D_GOLD_D,
      width: 60
    }
  }, r.id), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 14,
      fontWeight: 600
    }
  }, r.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 12,
      color: D_IVORY_2,
      opacity: 0.7,
      marginTop: 2
    }
  }, r.a)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, r.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "mono",
    style: {
      fontSize: 9,
      letterSpacing: '0.2em',
      padding: '4px 8px',
      border: `1px solid ${D_IVORY}22`,
      color: D_IVORY_2,
      borderRadius: 99
    }
  }, t)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: D_INK_2,
      borderRadius: 6,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.32em',
      color: D_GOLD
    }
  }, "SEU C\xCDRCULO"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 28,
      fontStyle: 'italic',
      fontWeight: 500,
      lineHeight: 1
    }
  }, "237 membros ativos"), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${D_IVORY}10`,
      paddingTop: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 12,
      color: D_IVORY_2
    }
  }, "Neg\xF3cios fechados \xB7 m\xEAs"), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 12,
      color: D_GOLD
    }
  }, "R$ 84.3M")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 12,
      color: D_IVORY_2
    }
  }, "Parcerias em curso"), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 12,
      color: D_GOLD
    }
  }, "17")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 12,
      color: D_IVORY_2
    }
  }, "Suas indica\xE7\xF5es"), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 12,
      color: D_GOLD
    }
  }, "4")))))));
}

/* Editorial poster / print ad */
function PCArtPoster() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: D_INK_3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48,
      padding: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl"
  }, "17 \xB7 P\xD4STER EDITORIAL"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr"
  }, "A3 \xB7 AN\xDANCIO IMPRESSO"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380,
      height: 540,
      background: D_INK,
      color: D_IVORY,
      borderRadius: 6,
      padding: '40px 36px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 40px 80px -30px rgba(0,0,0,0.8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 52,
    color: D_IVORY,
    accent: D_GOLD,
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.4em',
      color: D_GOLD,
      textAlign: 'right'
    }
  }, "EDI\xC7\xC3O \xB7 04", /*#__PURE__*/React.createElement("br", null), "MAIO \xB7 2026")), /*#__PURE__*/React.createElement("div", {
    className: "display italic",
    style: {
      fontSize: 60,
      fontStyle: 'italic',
      lineHeight: 0.98,
      marginTop: 48,
      fontWeight: 500
    }
  }, "O mercado imobili\xE1rio ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: D_GOLD
    }
  }, "deixa de ser informal.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 14,
      lineHeight: 1.5,
      color: D_IVORY_2,
      marginTop: 32,
      maxWidth: 300
    }
  }, "Prime Circle \xE9 a infraestrutura digital de corretores, imobili\xE1rias e construtoras. Hoje, 12.347 profissionais trabalham aqui."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 36,
      left: 36,
      right: 36,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.4em',
      color: D_GOLD_D
    }
  }, "PRIME \xB7 CIRCLE"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.4em',
      color: D_GOLD_D
    }
  }, "PRIMECIRCLE.APP.BR"))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380,
      height: 540,
      background: D_IVORY,
      color: D_INK,
      borderRadius: 6,
      padding: '40px 36px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 40px 80px -30px rgba(0,0,0,0.8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 52,
    color: D_INK,
    accent: D_GOLD_D,
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.4em',
      color: D_GOLD_D,
      textAlign: 'right'
    }
  }, "CADASTRO \xB7 PROFISSIONAL")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 80,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.4em',
      color: D_GOLD_D
    }
  }, "BEM-VINDA AO C\xCDRCULO"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 56,
      fontStyle: 'italic',
      lineHeight: 1.0,
      marginTop: 18,
      fontWeight: 500
    }
  }, "Helena."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 1,
      background: D_GOLD_D,
      margin: '28px auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 18,
      fontStyle: 'italic',
      color: '#2a2722',
      maxWidth: 280,
      margin: '0 auto',
      lineHeight: 1.55
    }
  }, "Sua mesa profissional est\xE1 pronta em primecircle.app.br/login")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 36,
      left: 36,
      right: 36,
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.4em',
      color: D_GOLD_D
    }
  }, "PROFISSIONAL \xB7 00237"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.4em',
      color: D_GOLD_D
    }
  }, "EST \xB7 MMXXIV"))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380,
      height: 540,
      background: D_GOLD,
      color: D_INK,
      borderRadius: 6,
      padding: '40px 36px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 40px 80px -30px rgba(0,0,0,0.8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 52,
    color: D_INK,
    accent: D_INK,
    strokeWidth: 3,
    variant: "mono"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.4em',
      color: D_INK,
      textAlign: 'right'
    }
  }, "OPORTUNIDADE", /*#__PURE__*/React.createElement("br", null), "#4128")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 54,
      fontStyle: 'italic',
      lineHeight: 0.98,
      fontWeight: 500
    }
  }, "Cobertura", /*#__PURE__*/React.createElement("br", null), "Vila Nova", /*#__PURE__*/React.createElement("br", null), "Concei\xE7\xE3o.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: `1px dashed ${D_INK}33`,
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.3em'
    }
  }, "\xC1REA"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontStyle: 'italic',
      fontSize: 20
    }
  }, "340 m\xB2")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: `1px dashed ${D_INK}33`,
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.3em'
    }
  }, "SU\xCDTES"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontStyle: 'italic',
      fontSize: 20
    }
  }, "4")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.3em'
    }
  }, "VALOR"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontStyle: 'italic',
      fontSize: 20
    }
  }, "R$ 12.8M"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 36,
      left: 36,
      right: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.4em'
    }
  }, "PARCERIA 50/50 \xB7 ABERTA AT\xC9 12\xB706"))));
}
Object.assign(window, {
  PCArtCard,
  PCArtSocial,
  PCArtAppIcon,
  PCArtEmailSignature,
  PCArtAppPreview,
  PCArtPoster
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "pc-artboards-apps.jsx", error: String((e && e.message) || e) }); }

// pc-artboards-construction.jsx
try { (() => {
/* Prime Circle — Artboards · Part 2: Construction, clearspace, variants */

const B_INK = '#0E0E0E';
const B_INK_2 = '#1C1C1C';
const B_GOLD = '#C9A84C';
const B_GOLD_D = '#8B7340';
const B_IVORY = '#F5F1E6';
const B_IVORY_2 = '#E8E0CC';

/* Symbol only — the mark in isolation, multiple sizes */
function PCArtSymbolOnly() {
  const cell = (label, child, bg, fg) => /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      color: fg,
      padding: '40px 20px',
      borderRadius: 6,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center'
    }
  }, child), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.3em',
      opacity: 0.75
    }
  }, label));
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: '#171513',
      color: B_IVORY,
      padding: '56px 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl"
  }, "05 \xB7 S\xCDMBOLO ISOLADO"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr"
  }, "SEM WORDMARK"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.4em',
      color: B_GOLD
    }
  }, "S\xCDMBOLO ISOLADO"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 54,
      fontStyle: 'italic',
      fontWeight: 500,
      marginTop: 6
    }
  }, "A marca, sem o nome."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 15,
      color: B_IVORY_2,
      marginTop: 10,
      maxWidth: 880,
      lineHeight: 1.55
    }
  }, "Quando o contexto j\xE1 identifica a marca \u2014 app icon, avatar de rede social, watermark, monograma\xE7\xE3o. Limite m\xEDnimo: 24px.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 14,
      height: 'calc(100% - 220px)'
    }
  }, cell('DUOTONE · OURO + INK', /*#__PURE__*/React.createElement(PCMark, {
    size: 180,
    color: B_INK,
    accent: B_GOLD,
    strokeWidth: 3
  }), B_IVORY, B_INK), cell('MONO · OURO', /*#__PURE__*/React.createElement(PCMark, {
    size: 180,
    variant: "mono",
    color: B_GOLD,
    strokeWidth: 3
  }), B_INK, B_GOLD), cell('FILLED · BOLD', /*#__PURE__*/React.createElement(PCMark, {
    size: 180,
    variant: "filled",
    color: B_INK,
    accent: B_GOLD,
    strokeWidth: 3
  }), B_IVORY_2, B_INK), cell('INVERSO · MARFIM', /*#__PURE__*/React.createElement(PCMark, {
    size: 180,
    variant: "mono",
    color: B_IVORY,
    strokeWidth: 3
  }), B_INK_2, B_IVORY)));
}

/* Construction grid — how the mark is built */
function PCArtConstruction() {
  const g = (x1, y1, x2, y2, c = '#C9A84C') => /*#__PURE__*/React.createElement("line", {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    stroke: c,
    strokeWidth: "0.3"
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: B_IVORY,
      color: B_INK,
      padding: '56px 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl",
    style: {
      color: B_INK
    }
  }, "06 \xB7 CONSTRU\xC7\xC3O"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr",
    style: {
      color: B_INK
    }
  }, "GRID \xB7 GEOMETRIA"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.4em',
      color: B_GOLD_D
    }
  }, "CONSTRU\xC7\xC3O"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 72,
      fontStyle: 'italic',
      fontWeight: 500,
      marginTop: 6
    }
  }, "Geometria do s\xEDmbolo.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center',
      height: 'calc(100% - 220px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "100%",
    style: {
      maxHeight: 480
    }
  }, [...Array(11)].map((_, i) => /*#__PURE__*/React.createElement("g", {
    key: 'v' + i
  }, g(i * 20, 0, i * 20, 200, '#0E0E0E1A'))), [...Array(11)].map((_, i) => /*#__PURE__*/React.createElement("g", {
    key: 'h' + i
  }, g(0, i * 20, 200, i * 20, '#0E0E0E1A'))), /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "40",
    width: "60",
    height: "60",
    stroke: B_GOLD_D,
    strokeWidth: "0.5",
    strokeDasharray: "3 3",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "62",
    y: "40",
    width: "60",
    height: "60",
    stroke: B_GOLD_D,
    strokeWidth: "0.5",
    strokeDasharray: "3 3",
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "36",
    cy: "70",
    r: "1.5",
    fill: B_GOLD_D
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "92",
    cy: "70",
    r: "1.5",
    fill: B_GOLD_D
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(28 20)"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "36",
    cy: "50",
    r: "30",
    stroke: B_INK,
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "64",
    cy: "50",
    r: "30",
    stroke: B_INK,
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "3.5",
    fill: B_GOLD_D
  })), /*#__PURE__*/React.createElement("text", {
    x: "36",
    y: "160",
    textAnchor: "middle",
    fontSize: "6",
    fill: B_GOLD_D,
    fontFamily: "'JetBrains Mono',monospace",
    letterSpacing: "0.1em"
  }, "R = 3X"), /*#__PURE__*/React.createElement("text", {
    x: "92",
    y: "160",
    textAnchor: "middle",
    fontSize: "6",
    fill: B_GOLD_D,
    fontFamily: "'JetBrains Mono',monospace",
    letterSpacing: "0.1em"
  }, "R = 3X"), /*#__PURE__*/React.createElement("text", {
    x: "64",
    y: "180",
    textAnchor: "middle",
    fontSize: "6",
    fill: B_GOLD_D,
    fontFamily: "'JetBrains Mono',monospace",
    letterSpacing: "0.1em"
  }, "DIST. CENTROS = 2.8X"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.3em',
      color: B_GOLD_D
    }
  }, "UNIDADE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 24,
      fontStyle: 'italic',
      marginTop: 4
    }
  }, "X = 1/10 da largura total")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.3em',
      color: B_GOLD_D
    }
  }, "RAIO DOS C\xCDRCULOS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 24,
      fontStyle: 'italic',
      marginTop: 4
    }
  }, "3X cada")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.3em',
      color: B_GOLD_D
    }
  }, "DIST\xC2NCIA ENTRE CENTROS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 24,
      fontStyle: 'italic',
      marginTop: 4
    }
  }, "2.8X \u2014 sobreposi\xE7\xE3o de 1.2X")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.3em',
      color: B_GOLD_D
    }
  }, "PONTO CENTRAL"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 24,
      fontStyle: 'italic',
      marginTop: 4
    }
  }, "R = 0.35X \u2014 sempre cheio, no acento")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.3em',
      color: B_GOLD_D
    }
  }, "STROKE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 24,
      fontStyle: 'italic',
      marginTop: 4
    }
  }, "0.3X \u2014 escala proporcional")))));
}

/* Clearspace + minimum sizes */
function PCArtClearspace() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: B_INK,
      color: B_IVORY,
      padding: '56px 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl"
  }, "07 \xB7 \xC1REA DE PROTE\xC7\xC3O"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr"
  }, "REDU\xC7\xC3O M\xCDNIMA"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.4em',
      color: B_GOLD
    }
  }, "RESPIRO & LEGIBILIDADE"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 72,
      fontStyle: 'italic',
      fontWeight: 500,
      marginTop: 6
    }
  }, "Espa\xE7o & tamanho m\xEDnimo.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 48,
      height: 'calc(100% - 220px)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.3em',
      color: B_GOLD,
      marginBottom: 14
    }
  }, "\xC1REA DE PROTE\xC7\xC3O \xB7 X"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: B_INK_2,
      padding: '56px 40px',
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 14,
      border: `1px dashed ${B_GOLD}88`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      position: 'absolute',
      top: 18,
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: 11,
      color: B_GOLD,
      letterSpacing: '0.3em'
    }
  }, "\u2195 X"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      position: 'absolute',
      left: 18,
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: 11,
      color: B_GOLD,
      letterSpacing: '0.3em'
    }
  }, "\u2194 X"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(PCLockupHorizontal, {
    size: 520,
    color: B_IVORY,
    accent: B_GOLD
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 14,
      color: B_IVORY_2,
      marginTop: 14,
      lineHeight: 1.55
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: B_GOLD
    }
  }, "X"), " equivale \xE0 altura do s\xEDmbolo. Mantenha esta margem livre de qualquer outro elemento gr\xE1fico ou texto.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.3em',
      color: B_GOLD,
      marginBottom: 14
    }
  }, "REDU\xC7\xC3O M\xCDNIMA"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: B_INK_2,
      padding: 20,
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(PCLockupHorizontal, {
    size: 220,
    color: B_IVORY,
    accent: B_GOLD,
    showSublabel: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontStyle: 'italic',
      fontSize: 20
    }
  }, "Lockup horizontal"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: B_GOLD,
      letterSpacing: '0.2em',
      marginTop: 4
    }
  }, "M\xCDN. 160px \xB7 32mm"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: B_INK_2,
      padding: 20,
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(PCLockupInline, {
    size: 200,
    color: B_IVORY,
    accent: B_GOLD
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontStyle: 'italic',
      fontSize: 20
    }
  }, "Lockup inline"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: B_GOLD,
      letterSpacing: '0.2em',
      marginTop: 4
    }
  }, "M\xCDN. 120px \xB7 24mm"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: B_INK_2,
      padding: 20,
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 64,
    color: B_IVORY,
    accent: B_GOLD,
    strokeWidth: 4
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontStyle: 'italic',
      fontSize: 20
    }
  }, "S\xEDmbolo isolado"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: B_GOLD,
      letterSpacing: '0.2em',
      marginTop: 4
    }
  }, "M\xCDN. 24px \xB7 6mm")))))));
}

/* On backgrounds — color treatments matrix */
function PCArtOnBackgrounds() {
  const tile = (label, child, bg, border) => /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      border,
      borderRadius: 6,
      padding: '30px 24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 230,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, child), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.32em',
      opacity: 0.7,
      color: 'inherit'
    }
  }, label));
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: B_IVORY,
      color: B_INK,
      padding: '56px 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl",
    style: {
      color: B_INK
    }
  }, "08 \xB7 CORES & FUNDOS"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr",
    style: {
      color: B_INK
    }
  }, "MATRIZ DE USO"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.4em',
      color: B_GOLD_D
    }
  }, "VARIA\xC7\xD5ES & FUNDOS"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 64,
      fontStyle: 'italic',
      fontWeight: 500,
      marginTop: 6
    }
  }, "Onde a marca pode pousar.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 14
    }
  }, tile('SOBRE PRETO · DUOTONE', /*#__PURE__*/React.createElement(PCLockupHorizontal, {
    size: 280,
    color: B_IVORY,
    accent: B_GOLD
  }), B_INK, 'none'), tile('SOBRE MARFIM · DUOTONE', /*#__PURE__*/React.createElement(PCLockupHorizontal, {
    size: 280,
    color: B_INK,
    accent: B_GOLD_D
  }), B_IVORY, `1px solid ${B_INK}22`), tile('SOBRE OURO · MONO INK', /*#__PURE__*/React.createElement(PCLockupHorizontal, {
    size: 280,
    color: B_INK,
    accent: B_INK
  }), B_GOLD, 'none'), tile('SOBRE AREIA · MONO INK', /*#__PURE__*/React.createElement(PCLockupHorizontal, {
    size: 280,
    color: B_INK,
    accent: B_INK
  }), B_IVORY_2, 'none'), tile('SÍMBOLO · OURO', /*#__PURE__*/React.createElement(PCMark, {
    size: 100,
    color: B_GOLD,
    accent: B_GOLD,
    strokeWidth: 3,
    variant: "mono"
  }), B_INK, 'none'), tile('SÍMBOLO · INK', /*#__PURE__*/React.createElement(PCMark, {
    size: 100,
    color: B_INK,
    accent: B_GOLD_D,
    strokeWidth: 3
  }), B_IVORY, `1px solid ${B_INK}22`), tile('SÍMBOLO · INK MONO', /*#__PURE__*/React.createElement(PCMark, {
    size: 100,
    color: B_INK,
    accent: B_INK,
    strokeWidth: 3,
    variant: "mono"
  }), B_GOLD, 'none'), tile('SÍMBOLO · IVORY MONO', /*#__PURE__*/React.createElement(PCMark, {
    size: 100,
    color: B_IVORY,
    accent: B_IVORY,
    strokeWidth: 3,
    variant: "mono"
  }), B_INK_2, 'none')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 14,
      color: '#2a2722',
      marginTop: 20,
      lineHeight: 1.55,
      maxWidth: 1100
    }
  }, "Sobre fundo escuro: duotone ouro + marfim. Sobre fundo claro: duotone ink + ouro antigo. Sobre fundo ouro: monocrom\xE1tico em ink. ", /*#__PURE__*/React.createElement("strong", null, "Nunca"), " usar duotone gold-on-gold ou ink-on-ink."));
}
Object.assign(window, {
  PCArtSymbolOnly,
  PCArtConstruction,
  PCArtClearspace,
  PCArtOnBackgrounds
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "pc-artboards-construction.jsx", error: String((e && e.message) || e) }); }

// pc-artboards-logo.jsx
try { (() => {
/* Prime Circle — Artboards · Part 1: Logo & lockups */

const A_INK = '#0E0E0E';
const A_INK_2 = '#1C1C1C';
const A_GOLD = '#C9A84C';
const A_GOLD_D = '#8B7340';
const A_IVORY = '#F5F1E6';
const A_IVORY_2 = '#E8E0CC';

/* Cover */
function PCArtCover() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: A_INK,
      color: A_IVORY
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl"
  }, "PRIME \xB7 CIRCLE"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr"
  }, "BRAND BOARD \xB7 v2.0"), /*#__PURE__*/React.createElement("div", {
    className: "corner bl"
  }, "CONNECTION MARK SYSTEM"), /*#__PURE__*/React.createElement("div", {
    className: "corner br"
  }, "17 PAIN\xC9IS"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 48,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 180,
    color: A_IVORY,
    accent: A_GOLD,
    strokeWidth: 2.4
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 12,
      letterSpacing: '0.45em',
      color: A_GOLD
    }
  }, "SISTEMA DE IDENTIDADE VISUAL \xB7 v2.0"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 152,
      lineHeight: 0.92,
      fontWeight: 500,
      marginTop: 20,
      letterSpacing: '-0.01em'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "Prime"), " Circle"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 36,
      fontStyle: 'italic',
      color: A_GOLD,
      marginTop: 14,
      fontWeight: 400
    }
  }, "a mesa profissional do mercado imobili\xE1rio.")), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.45em',
      opacity: 0.55
    }
  }, "CORRETORES \xB7 IMOBILI\xC1RIAS \xB7 CONSTRUTORAS")));
}

/* Conceito — o porquê */
function PCArtConcept() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: A_IVORY,
      color: A_INK,
      padding: '56px 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl",
    style: {
      color: A_INK
    }
  }, "01 \xB7 CONCEITO"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr",
    style: {
      color: A_INK
    }
  }, "O PORQU\xCA DO S\xCDMBOLO"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.4em',
      color: A_GOLD_D
    }
  }, "CONCEITO"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 88,
      fontStyle: 'italic',
      fontWeight: 500,
      marginTop: 8,
      lineHeight: 0.98
    }
  }, "Dois c\xEDrculos.", /*#__PURE__*/React.createElement("br", null), "Um ponto.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 420,
    color: A_INK,
    accent: A_GOLD_D,
    strokeWidth: 3
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.3em',
      color: A_GOLD_D
    }
  }, "C\xCDRCULO ESQUERDO"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 30,
      fontStyle: 'italic',
      fontWeight: 500,
      marginTop: 4
    }
  }, "O profissional com a oferta.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.3em',
      color: A_GOLD_D
    }
  }, "C\xCDRCULO DIREITO"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 30,
      fontStyle: 'italic',
      fontWeight: 500,
      marginTop: 4
    }
  }, "O profissional com a demanda.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.3em',
      color: A_GOLD_D
    }
  }, "INTERSE\xC7\xC3O"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 30,
      fontStyle: 'italic',
      fontWeight: 500,
      marginTop: 4,
      color: A_GOLD_D
    }
  }, "A intelig\xEAncia que vira neg\xF3cio.")))));
}

/* Pilares — Quatro promessas */
function PCArtPillars() {
  const Pillar = ({
    n,
    title,
    body,
    icon
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: `1px solid ${A_INK}11`,
      borderRadius: 8,
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 340,
      boxShadow: '0 20px 40px -25px rgba(14,14,14,0.15)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.32em',
      color: A_GOLD_D
    }
  }, n), icon), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "display italic",
    style: {
      fontSize: 38,
      lineHeight: 1,
      fontWeight: 500
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 14,
      color: '#2a2722',
      marginTop: 12,
      lineHeight: 1.55
    }
  }, body)));
  const IconAutonomy = /*#__PURE__*/React.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 100 100",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "42",
    stroke: A_INK,
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "10",
    fill: A_GOLD
  }));
  const IconData = /*#__PURE__*/React.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 100 100",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "60",
    width: "14",
    height: "30",
    fill: A_GOLD
  }), /*#__PURE__*/React.createElement("rect", {
    x: "35",
    y: "40",
    width: "14",
    height: "50",
    fill: A_INK
  }), /*#__PURE__*/React.createElement("rect", {
    x: "56",
    y: "22",
    width: "14",
    height: "68",
    fill: A_GOLD
  }), /*#__PURE__*/React.createElement("rect", {
    x: "77",
    y: "48",
    width: "14",
    height: "42",
    fill: A_INK
  }));
  const IconProcess = /*#__PURE__*/React.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 100 100",
    fill: "none"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "50",
    x2: "82",
    y2: "50",
    stroke: A_INK,
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "22",
    cy: "50",
    r: "8",
    fill: A_GOLD
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "8",
    fill: A_INK
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "78",
    cy: "50",
    r: "8",
    stroke: A_INK,
    strokeWidth: "2.5",
    fill: A_IVORY
  }));
  const IconLegal = /*#__PURE__*/React.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 100 100",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 30 46 Q 30 20 50 20 Q 70 20 70 46",
    stroke: A_INK,
    strokeWidth: "3",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "22",
    y: "46",
    width: "56",
    height: "40",
    rx: "3",
    stroke: A_INK,
    strokeWidth: "3",
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "64",
    r: "5",
    fill: A_GOLD
  }), /*#__PURE__*/React.createElement("line", {
    x1: "50",
    y1: "64",
    x2: "50",
    y2: "74",
    stroke: A_GOLD,
    strokeWidth: "2.5"
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: A_IVORY,
      color: A_INK,
      padding: '56px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl",
    style: {
      color: A_INK
    }
  }, "02 \xB7 QUATRO PROMESSAS"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr",
    style: {
      color: A_INK
    }
  }, "PILARES DA PLATAFORMA"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.4em',
      color: A_GOLD_D
    }
  }, "QUATRO PROMESSAS"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 72,
      fontStyle: 'italic',
      fontWeight: 500,
      marginTop: 6,
      lineHeight: 0.98
    }
  }, "O que entregamos."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontSize: 20,
      fontStyle: 'italic',
      color: '#2a2722',
      marginTop: 12,
      maxWidth: 1100,
      lineHeight: 1.4
    }
  }, "Quatro pilares que separam Prime Circle de grupos, classificados e listas avulsas \u2014 e que sustentam todas as decis\xF5es da plataforma.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Pillar, {
    n: "01",
    title: "Autonomia.",
    body: "O corretor trabalha com suas pr\xF3prias ferramentas \u2014 pipeline, ofertas, demandas, parceiros \u2014 sem depender de grupos, sem perder tempo em ru\xEDdo.",
    icon: IconAutonomy
  }), /*#__PURE__*/React.createElement(Pillar, {
    n: "02",
    title: "Dados reais.",
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Avalia\xE7\xF5es por compar\xE1veis e hist\xF3rico transacional verificado. ", /*#__PURE__*/React.createElement("em", null, "N\xE3o achismo. N\xE3o an\xFAncio fict\xEDcio.")),
    icon: IconData
  }), /*#__PURE__*/React.createElement(Pillar, {
    n: "03",
    title: "Processos claros.",
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Cada parceria com regras expl\xEDcitas. Comiss\xE3o, prazo, exclusividade e responsabilidade registrados ", /*#__PURE__*/React.createElement("em", null, "antes"), " do neg\xF3cio come\xE7ar."),
    icon: IconProcess
  }), /*#__PURE__*/React.createElement(Pillar, {
    n: "04",
    title: "Seguran\xE7a jur\xEDdica.",
    body: "Contratos, registros e documenta\xE7\xE3o centralizados. Auditoria de cada movimento, do an\xFAncio ao fechamento.",
    icon: IconLegal
  })));
}
function PCArtLockupH() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: A_IVORY,
      color: A_INK
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl",
    style: {
      color: A_INK
    }
  }, "02 \xB7 LOCKUP PRIM\xC1RIO"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr",
    style: {
      color: A_INK
    }
  }, "HORIZONTAL"), /*#__PURE__*/React.createElement("div", {
    className: "corner br",
    style: {
      color: A_INK
    }
  }, "USO PADR\xC3O \xB7 80% DAS APLICA\xC7\xD5ES"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(PCLockupHorizontal, {
    size: 760,
    color: A_INK,
    accent: A_GOLD_D
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 48,
      bottom: 80,
      maxWidth: 340
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 30,
      fontStyle: 'italic',
      lineHeight: 1.05
    }
  }, "Lockup prim\xE1rio"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.3em',
      marginTop: 6,
      color: A_GOLD_D
    }
  }, "HORIZONTAL \xB7 DEFAULT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.55,
      marginTop: 12,
      color: '#2a2722'
    }
  }, "A vers\xE3o padr\xE3o. Use sempre que houver espa\xE7o horizontal \u2014 cabe\xE7alho de site, papelaria, assinatura de e-mail, dashboard.")));
}

/* Lockup vertical */
function PCArtLockupV() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: A_INK,
      color: A_IVORY
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl"
  }, "03 \xB7 LOCKUP VERTICAL"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr"
  }, "EMPILHADO \xB7 CENTRADO"), /*#__PURE__*/React.createElement("div", {
    className: "corner br"
  }, "CAPAS \xB7 STORIES \xB7 CART\xD5ES"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(PCLockupVertical, {
    size: 420,
    color: A_IVORY,
    accent: A_GOLD
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 48,
      bottom: 80,
      maxWidth: 340
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 30,
      fontStyle: 'italic',
      lineHeight: 1.05,
      color: A_GOLD
    }
  }, "Lockup vertical"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.3em',
      marginTop: 6,
      color: A_GOLD
    }
  }, "STACKED \xB7 CENTERED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.55,
      marginTop: 12,
      color: A_IVORY_2
    }
  }, "Quando o espa\xE7o \xE9 mais alto que largo \u2014 Instagram Stories, posters, cart\xF5es de membro, abertura de apresenta\xE7\xE3o.")));
}

/* Lockup inline */
function PCArtLockupInline() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: A_IVORY_2,
      color: A_INK
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl",
    style: {
      color: A_INK
    }
  }, "04 \xB7 LOCKUP INLINE"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr",
    style: {
      color: A_INK
    }
  }, "LINHA \xDANICA"), /*#__PURE__*/React.createElement("div", {
    className: "corner br",
    style: {
      color: A_INK
    }
  }, "NAV \xB7 E-MAIL \xB7 RODAP\xC9"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(PCLockupInline, {
    size: 520,
    color: A_INK,
    accent: A_GOLD_D
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 48,
      bottom: 80,
      maxWidth: 340
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 30,
      fontStyle: 'italic',
      lineHeight: 1.05
    }
  }, "Lockup inline"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.3em',
      marginTop: 6,
      color: A_GOLD_D
    }
  }, "SINGLE LINE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.55,
      marginTop: 12,
      color: '#2a2722'
    }
  }, "Para espa\xE7os horizontais bem apertados: barras de navega\xE7\xE3o, rodap\xE9s, headers de e-mail, app bar.")));
}
Object.assign(window, {
  PCArtCover,
  PCArtConcept,
  PCArtPillars,
  PCArtLockupH,
  PCArtLockupV,
  PCArtLockupInline
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "pc-artboards-logo.jsx", error: String((e && e.message) || e) }); }

// pc-artboards-system.jsx
try { (() => {
/* Prime Circle — Artboards · Part 3: System (wrong uses, colors, type) */

const C_INK = '#0E0E0E';
const C_INK_2 = '#1C1C1C';
const C_GOLD = '#C9A84C';
const C_GOLD_D = '#8B7340';
const C_IVORY = '#F5F1E6';
const C_IVORY_2 = '#E8E0CC';

/* Wrong uses */
function PCArtWrongUses() {
  const Don = ({
    label,
    desc,
    children
  }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '1',
      background: C_IVORY,
      border: `1px solid ${C_INK}22`,
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, children, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 14,
      right: 14,
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: C_GOLD,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: C_INK,
      fontWeight: 700,
      fontSize: 16
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.3em',
      color: C_GOLD_D,
      marginTop: 12
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 13,
      marginTop: 4,
      color: '#2a2722',
      lineHeight: 1.4
    }
  }, desc));
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: C_IVORY,
      color: C_INK,
      padding: '56px 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tl",
    style: {
      color: C_INK
    }
  }, "09 \xB7 USOS INCORRETOS"), /*#__PURE__*/React.createElement("div", {
    className: "corner tr",
    style: {
      color: C_INK
    }
  }, "O QUE N\xC3O FAZER"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.4em',
      color: C_GOLD_D
    }
  }, "USOS INCORRETOS"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 64,
      fontStyle: 'italic',
      fontWeight: 500,
      marginTop: 6
    }
  }, "N\xE3o, por favor.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Don, {
    label: "N\xC3O DEFORMAR",
    desc: "N\xE3o esticar, comprimir nem alterar propor\xE7\xE3o."
  }, /*#__PURE__*/React.createElement("svg", {
    width: "220",
    height: "100",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "36",
    cy: "50",
    r: "30",
    stroke: C_INK,
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "64",
    cy: "50",
    r: "30",
    stroke: C_GOLD_D,
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "3.5",
    fill: C_GOLD_D
  }))), /*#__PURE__*/React.createElement(Don, {
    label: "N\xC3O ROTACIONAR",
    desc: "A marca sempre na horizontal."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: 'rotate(18deg)'
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 140,
    color: C_INK,
    accent: C_GOLD_D,
    strokeWidth: 3
  }))), /*#__PURE__*/React.createElement(Don, {
    label: "N\xC3O RECOLORIR",
    desc: "Cores apenas do sistema oficial."
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 140,
    color: "#3b82f6",
    accent: "#ef4444",
    strokeWidth: 3
  })), /*#__PURE__*/React.createElement(Don, {
    label: "SEM EFEITOS",
    desc: "Sem sombras, brilhos nem contornos extras."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      filter: 'drop-shadow(8px 8px 0 #ef4444) drop-shadow(0 0 16px #C9A84C)'
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 140,
    color: C_INK,
    accent: C_GOLD_D,
    strokeWidth: 3
  }))), /*#__PURE__*/React.createElement(Don, {
    label: "N\xC3O FECHAR O AR",
    desc: "Sempre respeitar a \xE1rea de prote\xE7\xE3o."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 100,
    color: C_INK,
    accent: C_GOLD_D,
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: 30,
      fontWeight: 700,
      letterSpacing: '-0.02em'
    }
  }, "Prime Circle"))), /*#__PURE__*/React.createElement(Don, {
    label: "N\xC3O INVERTER CORES",
    desc: "Acento sempre no c\xEDrculo da esquerda."
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 140,
    color: C_GOLD_D,
    accent: C_INK,
    strokeWidth: 3
  })), /*#__PURE__*/React.createElement(Don, {
    label: "N\xC3O ALTERAR PESO",
    desc: "N\xE3o usar strokes finos ou exagerados."
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: 140,
    color: C_INK,
    accent: C_GOLD_D,
    strokeWidth: 0.6
  })), /*#__PURE__*/React.createElement(Don, {
    label: "N\xC3O PREENCHER AMBOS",
    desc: "Os dois c\xEDrculos devem permanecer abertos."
  }, /*#__PURE__*/React.createElement("svg", {
    width: "140",
    height: "140",
    viewBox: "0 0 100 100",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "36",
    cy: "50",
    r: "30",
    fill: C_INK
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "64",
    cy: "50",
    r: "30",
    fill: C_GOLD_D
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "3.5",
    fill: C_IVORY
  })))));
}

/* Color palette */
function PCArtColors() {
  const swatches = [{
    name: 'Prime Ink',
    hex: '#0E0E0E',
    rgb: '14·14·14',
    cmyk: '0·0·0·100',
    role: 'PRIMÁRIA · FUNDO',
    dark: true
  }, {
    name: 'Ouro Prime',
    hex: '#C9A84C',
    rgb: '201·168·76',
    cmyk: '0·16·62·21',
    role: 'ACENTO · ASSINATURA',
    dark: false
  }, {
    name: 'Ouro Antigo',
    hex: '#8B7340',
    rgb: '139·115·64',
    cmyk: '0·17·54·46',
    role: 'SECUNDÁRIA · DETALHE',
    dark: true
  }, {
    name: 'Marfim',
    hex: '#F5F1E6',
    rgb: '245·241·230',
    cmyk: '0·2·6·4',
    role: 'FUNDO CLARO · PAPEL',
    dark: false
  }, {
    name: 'Grafite',
    hex: '#1C1C1C',
    rgb: '28·28·28',
    cmyk: '0·0·0·89',
    role: 'TEXTO · SUPERFÍCIE',
    dark: true
  }, {
    name: 'Areia',
    hex: '#E8E0CC',
    rgb: '232·224·204',
    cmyk: '0·3·12·9',
    role: 'TERCIÁRIA · BLOCOS',
    dark: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: C_INK,
      color: C_IVORY,
      padding: '56px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tr"
  }, "10 \xB7 PALETA \xB7 06 CORES"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.4em',
      color: C_GOLD
    }
  }, "SISTEMA DE COR"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 60,
      fontStyle: 'italic',
      lineHeight: 1,
      marginTop: 8,
      fontWeight: 500
    }
  }, "Preto, ouro, papel."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: C_IVORY_2,
      marginTop: 12,
      maxWidth: 680,
      lineHeight: 1.6
    }
  }, "Tr\xEAs temperaturas. Preto carrega autoridade. Ouro distingue. Marfim concede respiro. Acentos para hierarquia e dados.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, swatches.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.hex,
    style: {
      background: s.hex,
      color: s.dark ? C_IVORY : C_INK,
      padding: '22px 22px 18px',
      borderRadius: 6,
      height: 210,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: s.hex === C_INK ? `1px solid ${C_IVORY}22` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.32em',
      opacity: 0.75
    }
  }, s.role), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 30,
      fontStyle: 'italic',
      fontWeight: 500,
      lineHeight: 1
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.16em',
      marginTop: 12,
      opacity: 0.85
    }
  }, /*#__PURE__*/React.createElement("div", null, "HEX ", s.hex), /*#__PURE__*/React.createElement("div", null, "RGB ", s.rgb), /*#__PURE__*/React.createElement("div", null, "CMYK ", s.cmyk)))))));
}

/* Typography */
function PCArtTypography() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ab",
    style: {
      background: C_IVORY,
      color: C_INK,
      padding: '56px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "corner tr",
    style: {
      color: C_INK
    }
  }, "11 \xB7 TIPOGRAFIA \xB7 SISTEMA"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.4em',
      color: C_GOLD_D
    }
  }, "HIERARQUIA"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 64,
      fontStyle: 'italic',
      lineHeight: 1,
      marginTop: 6,
      fontWeight: 500
    }
  }, "Tr\xEAs vozes.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `2px solid ${C_INK}`,
      paddingTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.32em',
      color: C_GOLD_D
    }
  }, "DISPLAY"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 88,
      lineHeight: 1,
      marginTop: 14,
      fontWeight: 500
    }
  }, "Aa"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 18,
      marginTop: 14
    }
  }, "Cormorant Garamond"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: '#555',
      marginTop: 4,
      letterSpacing: '0.18em'
    }
  }, "400 \xB7 500 \xB7 600 \xB7 IT\xC1LICO"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 14,
      marginTop: 14,
      lineHeight: 1.4,
      color: '#2a2722'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "T\xEDtulos, capas, momentos editoriais."))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `2px solid ${C_INK}`,
      paddingTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.32em',
      color: C_GOLD_D
    }
  }, "WORDMARK \xB7 INTERFACE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: 88,
      lineHeight: 1,
      marginTop: 14,
      fontWeight: 700,
      letterSpacing: '-0.03em'
    }
  }, "Aa"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: 18,
      marginTop: 14,
      fontWeight: 600
    }
  }, "Manrope"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: '#555',
      marginTop: 4,
      letterSpacing: '0.18em'
    }
  }, "300 \xB7 400 \xB7 500 \xB7 600 \xB7 700 \xB7 800"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: 14,
      marginTop: 14,
      lineHeight: 1.5,
      color: '#2a2722'
    }
  }, "Wordmark da marca, bot\xF5es, corpo, navega\xE7\xE3o e dados.")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `2px solid ${C_INK}`,
      paddingTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.32em',
      color: C_GOLD_D
    }
  }, "LABEL \xB7 DADO"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 88,
      lineHeight: 1,
      marginTop: 14,
      fontWeight: 500
    }
  }, "Aa"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 18,
      marginTop: 14,
      fontWeight: 500
    }
  }, "JetBrains Mono"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: '#555',
      marginTop: 4,
      letterSpacing: '0.18em'
    }
  }, "300 \xB7 400 \xB7 500 \xB7 600"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 12,
      marginTop: 14,
      lineHeight: 1.6,
      color: '#2a2722',
      letterSpacing: '0.05em'
    }
  }, "C\xD3DIGOS \xB7 IDs \xB7 LABELS \xB7 METADADOS"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48,
      borderTop: `1px solid ${C_INK}22`,
      paddingTop: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.32em',
      color: C_GOLD_D,
      marginBottom: 18
    }
  }, "ESCALA \xB7 APRESENTA\xC7\xC3O"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 36,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 96,
      lineHeight: 1,
      fontStyle: 'italic',
      fontWeight: 500
    }
  }, "Display 96"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 56,
      lineHeight: 1,
      fontWeight: 500
    }
  }, "Title 56"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: 24,
      lineHeight: 1,
      fontWeight: 600
    }
  }, "Subtitle 24"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: 16,
      lineHeight: 1,
      fontWeight: 400
    }
  }, "Body 16"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: '0.32em'
    }
  }, "LABEL \xB7 11"))));
}
Object.assign(window, {
  PCArtWrongUses,
  PCArtColors,
  PCArtTypography
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "pc-artboards-system.jsx", error: String((e && e.message) || e) }); }

// pc-connection.jsx
try { (() => {
/* Prime Circle — Connection Mark system
   The chosen identity: two interlocking circles + center dot.
   Variations for every context.
*/

const PC_GOLD = '#C9A84C';
const PC_GOLD_DEEP = '#8B7340';
const PC_INK = '#0E0E0E';
const PC_INK_2 = '#1C1C1C';
const PC_IVORY = '#F5F1E6';
const PC_IVORY_2 = '#E8E0CC';

/* ============================================
   CORE SYMBOL — two interlocking circles + dot
   Renders as a standalone <svg>.
   Variants:
     - 'duotone'  : two colors (mark + accent), default
     - 'mono'     : all one color (use `color`)
     - 'filled'   : one solid disc + one outline (bold variant)
     - 'minimal'  : just one circle + dot (for tiny sizes ≤24px)
============================================ */
function PCMark({
  size = 100,
  variant = 'duotone',
  color = PC_INK,
  accent = PC_GOLD,
  strokeWidth = 3
}) {
  const sw = strokeWidth;
  if (variant === 'minimal') {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      fill: "none"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "50",
      r: "42",
      stroke: color,
      strokeWidth: sw * 1.6
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "50",
      r: "6",
      fill: accent === color ? color : accent
    }));
  }
  if (variant === 'filled') {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      fill: "none"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "36",
      cy: "50",
      r: "30",
      fill: accent
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "64",
      cy: "50",
      r: "30",
      stroke: color,
      strokeWidth: sw,
      fill: "none"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "50",
      r: "4",
      fill: color
    }));
  }
  if (variant === 'mono') {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      fill: "none"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "36",
      cy: "50",
      r: "30",
      stroke: color,
      strokeWidth: sw
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "64",
      cy: "50",
      r: "30",
      stroke: color,
      strokeWidth: sw,
      opacity: "0.55"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "50",
      r: "3.5",
      fill: color
    }));
  }
  // duotone (default)
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "36",
    cy: "50",
    r: "30",
    stroke: accent,
    strokeWidth: sw
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "64",
    cy: "50",
    r: "30",
    stroke: color,
    strokeWidth: sw
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "3.5",
    fill: accent
  }));
}

/* ============================================
   WORDMARK only — clean type lockup
   Sizes via `size` (logical px). Optional sublabel.
============================================ */
function PCWordmark({
  size = 200,
  color = PC_INK,
  accent = PC_GOLD_DEEP,
  sublabel = 'REAL ESTATE NETWORK',
  showSublabel = true,
  align = 'left'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      gap: size * 0.025
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: size * 0.42,
      fontWeight: 700,
      letterSpacing: '-0.025em',
      color,
      lineHeight: 1
    }
  }, "Prime Circle"), showSublabel && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"JetBrains Mono",monospace',
      fontSize: size * 0.085,
      letterSpacing: '0.32em',
      color: accent,
      textTransform: 'uppercase'
    }
  }, sublabel));
}

/* ============================================
   LOCKUP — primary horizontal
   Mark left + wordmark right.
============================================ */
function PCLockupHorizontal({
  size = 360,
  color = PC_INK,
  accent = PC_GOLD,
  sublabel,
  showSublabel = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.07
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: size * 0.32,
    color: color,
    accent: accent,
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement(PCWordmark, {
    size: size * 0.5,
    color: color,
    accent: accent === PC_GOLD ? PC_GOLD_DEEP : accent,
    sublabel: sublabel,
    showSublabel: showSublabel
  }));
}

/* ============================================
   LOCKUP — vertical / stacked
   Mark above, wordmark centered below.
============================================ */
function PCLockupVertical({
  size = 320,
  color = PC_INK,
  accent = PC_GOLD,
  sublabel = 'REAL ESTATE NETWORK',
  showSublabel = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: size * 0.07
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: size * 0.48,
    color: color,
    accent: accent,
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement(PCWordmark, {
    size: size * 0.55,
    color: color,
    accent: accent === PC_GOLD ? PC_GOLD_DEEP : accent,
    sublabel: sublabel,
    showSublabel: showSublabel,
    align: "center"
  }));
}

/* ============================================
   LOCKUP — single line / inline
   For tight horizontal spaces: nav bars, email signatures.
============================================ */
function PCLockupInline({
  size = 220,
  color = PC_INK,
  accent = PC_GOLD
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.05
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: size * 0.18,
    color: color,
    accent: accent,
    strokeWidth: 3.5
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Manrope",sans-serif',
      fontSize: size * 0.16,
      fontWeight: 700,
      letterSpacing: '-0.025em',
      color,
      lineHeight: 1
    }
  }, "Prime Circle"));
}

/* ============================================
   ICON TILE — app icon / avatar / favicon
   Rounded square with mark centered.
============================================ */
function PCIconTile({
  size = 128,
  bg = PC_INK,
  color = PC_IVORY,
  accent = PC_GOLD,
  radius = 0.22
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      background: bg,
      borderRadius: size * radius,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(PCMark, {
    size: size * 0.6,
    color: color,
    accent: accent,
    strokeWidth: size <= 32 ? 6 : 3,
    variant: size <= 24 ? 'minimal' : 'duotone'
  }));
}
Object.assign(window, {
  PCMark,
  PCWordmark,
  PCLockupHorizontal,
  PCLockupVertical,
  PCLockupInline,
  PCIconTile,
  PC_GOLD,
  PC_GOLD_DEEP,
  PC_INK,
  PC_INK_2,
  PC_IVORY,
  PC_IVORY_2
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "pc-connection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/app.jsx
try { (() => {
/* Prime Circle — Dashboard UI kit
   Interactive recreation of the member "table": sign-in → open demands → join a partnership.
   Composes the brand language (mark, eyebrow, mono data, dashed meta rows). */

const {
  useState
} = React;
const C = {
  ink: "#0E0E0E",
  ink2: "#1C1C1C",
  ink3: "#171513",
  gold: "#C9A84C",
  goldD: "#8B7340",
  ivory: "#F5F1E6",
  ivory2: "#E8E0CC",
  border: "rgba(245,241,230,0.10)",
  borderS: "rgba(245,241,230,0.22)"
};
function Mark({
  size = 28,
  color = C.ivory,
  accent = C.gold,
  sw = 3
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "36",
    cy: "50",
    r: "30",
    stroke: accent,
    strokeWidth: sw
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "64",
    cy: "50",
    r: "30",
    stroke: color,
    strokeWidth: sw
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "3.5",
    fill: accent
  }));
}
function InlineLockup({
  size = 150
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.05
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    size: size * 0.18,
    sw: 3.5
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Manrope',sans-serif",
      fontWeight: 700,
      fontSize: size * 0.16,
      letterSpacing: "-0.025em",
      color: C.ivory,
      lineHeight: 1
    }
  }, "Prime Circle"));
}
const DEMANDS = [{
  id: "#4128",
  t: "Cobertura · Vila Nova Conceição",
  area: "340 m²",
  price: "R$ 12.8M",
  suites: "4 suítes",
  split: "50/50",
  members: 8,
  neigh: "Vila Nova Conceição",
  date: "12·06"
}, {
  id: "#4126",
  t: "Apto · Jardins · vista parque",
  area: "220 m²",
  price: "R$ 7.5M",
  suites: "3 suítes",
  split: "60/40",
  members: 4,
  neigh: "Jardins",
  date: "09·06"
}, {
  id: "#4124",
  t: "Casa térrea · Alto de Pinheiros",
  area: "480 m²",
  price: "R$ 18M",
  suites: "5 suítes",
  split: "50/50",
  members: 11,
  neigh: "Alto de Pinheiros",
  date: "15·06"
}, {
  id: "#4120",
  t: "Studio · Pinheiros · investidor",
  area: "48 m²",
  price: "R$ 920K",
  suites: "1 suíte",
  split: "70/30",
  members: 3,
  neigh: "Pinheiros",
  date: "07·06"
}];
const NAV = ["Demandas", "Ofertas", "Parcerias", "Membros"];

/* ── Sign-in ─────────────────────────────────────────── */
function SignIn({
  onEnter
}) {
  const [email, setEmail] = useState("helena@primecircle.app.br");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: C.ink,
      color: C.ivory,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "720",
    height: "720",
    viewBox: "0 0 720 720",
    style: {
      position: "absolute",
      right: -240,
      top: -160,
      pointerEvents: "none"
    },
    "aria-hidden": "true"
  }, [340, 264, 188, 112].map(r => /*#__PURE__*/React.createElement("circle", {
    key: r,
    cx: "360",
    cy: "360",
    r: r,
    fill: "none",
    stroke: C.gold,
    strokeWidth: "1",
    opacity: "0.05"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 420,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement(InlineLockup, {
    size: 200
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 12,
      letterSpacing: "0.4em",
      textTransform: "uppercase",
      color: C.gold,
      marginBottom: 14
    }
  }, "Acesso \xB7 profissional"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontStyle: "italic",
      fontWeight: 500,
      fontSize: 48,
      lineHeight: 1.02,
      marginBottom: 28
    }
  }, "Sua mesa", /*#__PURE__*/React.createElement("br", null), "est\xE1 pronta."), /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 10,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: C.goldD
    }
  }, "E-mail"), /*#__PURE__*/React.createElement("input", {
    value: email,
    onChange: e => setEmail(e.target.value),
    style: {
      width: "100%",
      marginTop: 8,
      marginBottom: 22,
      background: C.ink2,
      border: `1px solid ${C.border}`,
      borderRadius: 6,
      padding: "14px 16px",
      color: C.ivory,
      fontFamily: "'Manrope',sans-serif",
      fontSize: 15,
      boxSizing: "border-box",
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onEnter,
    style: {
      width: "100%",
      background: C.gold,
      color: C.ink,
      border: "none",
      borderRadius: 999,
      padding: "15px",
      fontFamily: "'Manrope',sans-serif",
      fontWeight: 600,
      fontSize: 15,
      cursor: "pointer"
    }
  }, "Entrar no C\xEDrculo"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontFamily: "'Manrope',sans-serif",
      fontSize: 13,
      color: C.ivory2,
      opacity: 0.6
    }
  }, "12.347 corretores ativos \xB7 237 no seu c\xEDrculo")));
}

/* ── Opportunity detail (slide-over) ─────────────────── */
function Detail({
  d,
  joined,
  onJoin,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.55)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width: 460,
      background: C.ink,
      borderLeft: `1px solid ${C.border}`,
      padding: "40px 40px",
      boxSizing: "border-box",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    size: 48,
    sw: 3
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: "none",
      border: "none",
      color: C.ivory2,
      fontSize: 22,
      cursor: "pointer",
      lineHeight: 1
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 11,
      letterSpacing: "0.4em",
      color: C.gold,
      marginTop: 28
    }
  }, "OPORTUNIDADE \xB7 ", d.id), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontStyle: "italic",
      fontWeight: 500,
      fontSize: 40,
      lineHeight: 1.04,
      marginTop: 10,
      color: C.ivory
    }
  }, d.neigh, "."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 0,
      marginTop: 30
    }
  }, [["Área", d.area], ["Suítes", d.suites.replace(/\D+$/, "").trim()], ["Valor", d.price], ["Parceria", d.split]].map(([k, v], i, a) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      paddingBottom: 10,
      marginBottom: 10,
      borderBottom: i === a.length - 1 ? "none" : `1px dashed ${C.borderS}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 10,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: C.goldD
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontStyle: "italic",
      fontSize: 22,
      color: C.ivory
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.ink2,
      borderRadius: 8,
      padding: 20,
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 10,
      letterSpacing: "0.3em",
      color: C.gold
    }
  }, "C\xCDRCULO ENVOLVIDO"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Manrope',sans-serif",
      fontSize: 14,
      color: C.ivory2,
      marginTop: 8,
      lineHeight: 1.5
    }
  }, d.members, " membros acompanham \xB7 parceria aberta at\xE9 ", d.date)), /*#__PURE__*/React.createElement("button", {
    onClick: onJoin,
    disabled: joined,
    style: {
      width: "100%",
      marginTop: 28,
      background: joined ? "transparent" : C.gold,
      color: joined ? C.gold : C.ink,
      border: joined ? `1px solid ${C.gold}` : "none",
      borderRadius: 999,
      padding: 15,
      fontFamily: "'Manrope',sans-serif",
      fontWeight: 600,
      fontSize: 15,
      cursor: joined ? "default" : "pointer"
    }
  }, joined ? "✓ Parceria solicitada" : `Entrar na parceria ${d.split}`)));
}

/* ── Dashboard ───────────────────────────────────────── */
function Dashboard() {
  const [active, setActive] = useState("Demandas");
  const [open, setOpen] = useState(null);
  const [joined, setJoined] = useState({});
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: C.ink3,
      color: C.ivory,
      fontFamily: "'Manrope',sans-serif",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      padding: "16px 28px",
      borderBottom: `1px solid ${C.border}`,
      gap: 28,
      background: C.ink
    }
  }, /*#__PURE__*/React.createElement(InlineLockup, {
    size: 150
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 18,
      display: "flex",
      gap: 26
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    onClick: () => setActive(n),
    style: {
      fontSize: 13,
      cursor: "pointer",
      color: active === n ? C.gold : C.ivory2,
      fontWeight: active === n ? 600 : 400,
      opacity: active === n ? 1 : 0.6
    }
  }, n))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 10,
      letterSpacing: "0.3em",
      color: C.goldD
    }
  }, "HV \xB7 #00237"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: C.gold,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: C.ink,
      fontWeight: 700,
      fontSize: 12
    }
  }, "HV"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 340px",
      gap: 24,
      padding: "28px 28px",
      flex: 1,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 11,
      letterSpacing: "0.4em",
      color: C.gold,
      marginBottom: 8
    }
  }, active.toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontStyle: "italic",
      fontWeight: 500,
      fontSize: 40,
      lineHeight: 1
    }
  }, "Demandas abertas"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.ivory2,
      marginTop: 6,
      opacity: 0.8
    }
  }, DEMANDS.length, " vis\xEDveis a voc\xEA \xB7 3 novas hoje")), /*#__PURE__*/React.createElement("button", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 11,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: C.gold,
      padding: "10px 16px",
      border: `1px solid ${C.gold}`,
      borderRadius: 999,
      background: "transparent",
      cursor: "pointer"
    }
  }, "+ Nova")), DEMANDS.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    onClick: () => setOpen(r),
    style: {
      display: "flex",
      alignItems: "center",
      padding: "16px 18px",
      borderBottom: `1px solid ${C.border}`,
      gap: 16,
      cursor: "pointer",
      borderRadius: 6,
      transition: "background 140ms"
    },
    onMouseEnter: e => e.currentTarget.style.background = C.ink2,
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement(Mark, {
    size: 28,
    sw: 4
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 10,
      letterSpacing: "0.3em",
      color: C.goldD,
      width: 52
    }
  }, r.id), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, r.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.ivory2,
      opacity: 0.7,
      marginTop: 2
    }
  }, r.area, " \xB7 ", r.price)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, joined[r.id] && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 9,
      letterSpacing: "0.2em",
      padding: "4px 8px",
      background: C.gold,
      color: C.ink,
      borderRadius: 999
    }
  }, "SOLICITADA"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 9,
      letterSpacing: "0.2em",
      padding: "4px 8px",
      border: `1px solid ${C.gold}`,
      color: C.gold,
      borderRadius: 999
    }
  }, r.split), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 9,
      letterSpacing: "0.2em",
      padding: "4px 8px",
      border: `1px solid ${C.borderS}`,
      color: C.ivory2,
      borderRadius: 999
    }
  }, r.members, " membros"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.ink2,
      borderRadius: 8,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      height: "fit-content"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 10,
      letterSpacing: "0.32em",
      color: C.gold
    }
  }, "SEU C\xCDRCULO"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontStyle: "italic",
      fontWeight: 500,
      fontSize: 30,
      lineHeight: 1
    }
  }, "237 membros ativos"), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${C.border}`,
      paddingTop: 16,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, [["Negócios fechados · mês", "R$ 84.3M"], ["Parcerias em curso", "17"], ["Suas indicações", "4"]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: C.ivory2
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 12,
      color: C.gold
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      padding: 16,
      border: `1px dashed ${C.borderS}`,
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontStyle: "italic",
      fontSize: 18,
      color: C.ivory
    }
  }, "\"Voc\xEA n\xE3o precisa de mais um grupo. Precisa de uma mesa.\"")))), open && /*#__PURE__*/React.createElement(Detail, {
    d: open,
    joined: !!joined[open.id],
    onJoin: () => setJoined(j => ({
      ...j,
      [open.id]: true
    })),
    onClose: () => setOpen(null)
  }));
}
function App() {
  const [entered, setEntered] = useState(false);
  return entered ? /*#__PURE__*/React.createElement(Dashboard, null) : /*#__PURE__*/React.createElement(SignIn, {
    onEnter: () => setEntered(true)
  });
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/app.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Lockup = __ds_scope.Lockup;

__ds_ns.Mark = __ds_scope.Mark;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.MetaRow = __ds_scope.MetaRow;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.PropertyCard = __ds_scope.PropertyCard;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.CountUp = __ds_scope.CountUp;

__ds_ns.DrawnRings = __ds_scope.DrawnRings;

__ds_ns.Reveal = __ds_scope.Reveal;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Topbar = __ds_scope.Topbar;

})();
