import mermaid from 'mermaid'

let initialized = false

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
  return svg
}
