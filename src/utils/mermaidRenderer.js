import mermaid from 'mermaid'

let initialized = false

function applyNeoBrutalistSvgTheme(svg, themeSettings) {
  const borderWidth = Math.max(2, Math.min(4, Number(themeSettings.borderThickness) || 3))
  const background = themeSettings.backgroundMode === 'dark' ? '#111111' : '#ffffff'
  const text = themeSettings.backgroundMode === 'dark' ? '#ffffff' : '#111111'
  const accent = themeSettings.diagramAccent

  const styleTag = `
<style>
.neo-brutal-diagram {
  background: ${background};
  color: ${text};
  font-family: ${themeSettings.fontFamily};
}
.neo-brutal-diagram .node rect,
.neo-brutal-diagram .node circle,
.neo-brutal-diagram .node ellipse,
.neo-brutal-diagram .node polygon,
.neo-brutal-diagram .cluster rect {
  fill: ${accent} !important;
  stroke: #000 !important;
  stroke-width: ${borderWidth}px !important;
  rx: 0 !important;
  ry: 0 !important;
}
.neo-brutal-diagram .edgePath path,
.neo-brutal-diagram .flowchart-link,
.neo-brutal-diagram .messageLine0,
.neo-brutal-diagram .messageLine1,
.neo-brutal-diagram .relation,
.neo-brutal-diagram .activation0,
.neo-brutal-diagram .activation1 {
  stroke: #000 !important;
  stroke-width: ${borderWidth}px !important;
}
.neo-brutal-diagram text,
.neo-brutal-diagram .messageText,
.neo-brutal-diagram .edgeLabel {
  fill: ${text} !important;
  font-weight: 700;
}
.neo-brutal-diagram .labelBox,
.neo-brutal-diagram .edgeLabel rect {
  fill: ${background} !important;
  stroke: #000 !important;
  stroke-width: ${Math.max(2, borderWidth - 1)}px !important;
}
</style>`

  const withClass = svg.replace('<svg', '<svg class="neo-brutal-diagram"')
  return withClass.replace('>', `>${styleTag}`)
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

  const id = `diagram-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
  const { svg } = await mermaid.render(id, code)
  return applyNeoBrutalistSvgTheme(svg, themeSettings)
}
