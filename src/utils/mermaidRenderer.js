import mermaid from 'mermaid'

let initialized = false
const MIN_BORDER_WIDTH = 2
const MAX_BORDER_WIDTH = 4
const DEFAULT_BORDER_WIDTH = 3
const SVG_OPENING_TAG_REGEX = /<svg\b([^>]*)>/i
const SAFE_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
const ALLOWED_FONT_FAMILIES = new Set([
  'ui-monospace, SFMono-Regular, Menlo, monospace',
  'Helvetica, Arial, sans-serif',
  'system-ui, -apple-system, sans-serif',
])

function sanitizeColor(value, fallback) {
  return SAFE_COLOR_REGEX.test(value) ? value : fallback
}

function sanitizeFontFamily(value, fallback) {
  return ALLOWED_FONT_FAMILIES.has(value) ? value : fallback
}

function applyNeoBrutalistSvgTheme(svg, themeSettings) {
  const borderWidth = Math.max(
    MIN_BORDER_WIDTH,
    Math.min(MAX_BORDER_WIDTH, Number(themeSettings.borderThickness) || DEFAULT_BORDER_WIDTH),
  )
  const background = themeSettings.backgroundMode === 'dark' ? '#111111' : '#ffffff'
  const text = themeSettings.backgroundMode === 'dark' ? '#ffffff' : '#111111'
  const accent = sanitizeColor(themeSettings.diagramAccent, '#ffef00')
  const fontFamily = sanitizeFontFamily(
    themeSettings.fontFamily,
    'ui-monospace, SFMono-Regular, Menlo, monospace',
  )
  const labelBorderWidth = Math.max(1, borderWidth - 1)

  const styleTag = `
<style>
svg {
  background: ${background};
  color: ${text};
  font-family: ${fontFamily};
}
.node rect,
.node circle,
.node ellipse,
.node polygon,
.cluster rect {
  fill: ${accent} !important;
  stroke: #000 !important;
  stroke-width: ${borderWidth}px !important;
  rx: 0 !important;
  ry: 0 !important;
}
.edgePath path,
.flowchart-link,
.messageLine0,
.messageLine1,
.relation,
.activation0,
.activation1 {
  stroke: #000 !important;
  stroke-width: ${borderWidth}px !important;
}
text,
.messageText,
.edgeLabel {
  fill: ${text} !important;
  font-weight: 700;
}
.labelBox,
.edgeLabel rect {
  fill: ${background} !important;
  stroke: #000 !important;
  stroke-width: ${labelBorderWidth}px !important;
}
</style>`

  const openingTagMatch = svg.match(SVG_OPENING_TAG_REGEX)
  if (!openingTagMatch) {
    console.warn('Neo-brutalist styling skipped: Mermaid output missing opening <svg> tag.')
    return svg
  }
  return svg.replace(SVG_OPENING_TAG_REGEX, `<svg${openingTagMatch[1]}>${styleTag}`)
}

export async function renderMermaid({ code, config, themeSettings }) {
  const runtimeConfig = {
    startOnLoad: false,
    theme: config.theme,
    fontFamily: themeSettings.fontFamily,
    flowchart: {
      curve: config.curve,
      nodeSpacing: Number(config.nodeSpacing),
    },
    themeVariables: {
      primaryColor: themeSettings.diagramAccent,
      primaryTextColor: '#111111',
      primaryBorderColor: '#000000',
      secondaryColor: '#ffffff',
      tertiaryColor: '#ffffff',
      lineColor: '#111111',
      fontFamily: themeSettings.fontFamily,
    },
  }

  if (!initialized) {
    mermaid.initialize(runtimeConfig)
    initialized = true
  } else {
    mermaid.initialize(runtimeConfig)
  }

  const id = `diagram-${crypto.randomUUID()}`
  const { svg } = await mermaid.render(id, code)
  return applyNeoBrutalistSvgTheme(svg, themeSettings)
}
