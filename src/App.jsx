import { useEffect, useMemo, useRef } from 'react'
import Editor from './components/Editor'
import Preview from './components/Preview'
import ThemePanel from './components/ThemePanel'
import Toolbar from './components/Toolbar'
import { buildShareUrl, persistWorkspace, useDiagramStore } from './store/useDiagramStore'

function triggerDownload(filename, blob) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

async function svgToPngBlob(svgText) {
  const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
  const svgUrl = URL.createObjectURL(svgBlob)

  const image = await new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = svgUrl
  })

  const canvas = document.createElement('canvas')
  canvas.width = image.width || 1280
  canvas.height = image.height || 720
  const context = canvas.getContext('2d')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0)

  const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  URL.revokeObjectURL(svgUrl)
  return pngBlob
}

export default function App() {
  const containerRef = useRef(null)

  const {
    diagramCode,
    themeSettings,
    mermaidConfig,
    layoutPreset,
    history,
    historyIndex,
    renderedSvg,
    setDiagramCode,
    setThemeSetting,
    setMermaidConfig,
    setLayoutPreset,
    setRenderedSvg,
    undo,
    redo,
    resetWorkspace,
  } = useDiagramStore()

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary', themeSettings.primaryColor)
    root.style.setProperty('--diagram-accent', themeSettings.diagramAccent)
    root.style.setProperty('--bg', themeSettings.backgroundMode === 'dark' ? '#111111' : '#ffffff')
    root.style.setProperty('--panel-bg', themeSettings.backgroundMode === 'dark' ? '#1a1a1a' : '#fffdf4')
    root.style.setProperty('--text', themeSettings.backgroundMode === 'dark' ? '#ffffff' : '#111111')
    root.style.setProperty('--border-thickness', `${themeSettings.borderThickness}px`)
    root.style.setProperty('--ui-font', themeSettings.fontFamily)
  }, [themeSettings])

  useEffect(() => {
    persistWorkspace({ diagramCode, themeSettings, mermaidConfig, layoutPreset, history, historyIndex })
  }, [diagramCode, history, historyIndex, layoutPreset, mermaidConfig, themeSettings])

  const appClassName = useMemo(() => {
    if (layoutPreset === 'presentation') {
      return 'app-shell presentation'
    }

    if (layoutPreset === 'fullscreen') {
      return 'app-shell fullscreen'
    }

    return 'app-shell compact'
  }, [layoutPreset])

  const exportSvg = () => {
    if (!renderedSvg) {
      return
    }

    triggerDownload(`diagram-${Date.now()}.svg`, new Blob([renderedSvg], { type: 'image/svg+xml' }))
  }

  const exportPng = async () => {
    if (!renderedSvg) {
      return
    }

    const pngBlob = await svgToPngBlob(renderedSvg)
    if (pngBlob) {
      triggerDownload(`diagram-${Date.now()}.png`, pngBlob)
    }
  }

  const copySvg = async () => {
    if (!renderedSvg) {
      return
    }

    await navigator.clipboard.writeText(renderedSvg)
  }

  const copyShareUrl = async () => {
    const shareUrl = buildShareUrl({ diagramCode, themeSettings, mermaidConfig, layoutPreset, history, historyIndex })
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl)
    }
  }

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && containerRef.current) {
      await containerRef.current.requestFullscreen()
      return
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
  }

  return (
    <main ref={containerRef} className={`${appClassName} min-h-screen p-4 md:p-6`}>
      <h1 className="title">Neo-Brutalist Mermaid Diagramming Tool</h1>

      <Toolbar
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={undo}
        onRedo={redo}
        onExportSvg={exportSvg}
        onExportPng={exportPng}
        onCopy={copySvg}
        onShare={copyShareUrl}
        onReset={resetWorkspace}
        layoutPreset={layoutPreset}
        onLayoutChange={setLayoutPreset}
        onToggleFullscreen={toggleFullscreen}
      />

      <ThemePanel
        themeSettings={themeSettings}
        mermaidConfig={mermaidConfig}
        onThemeSetting={setThemeSetting}
        onMermaidConfig={setMermaidConfig}
      />

      <section className="editor-preview-grid" aria-label="Editor and preview split layout">
        <Editor code={diagramCode} onCodeChange={setDiagramCode} />
        <Preview
          code={diagramCode}
          config={mermaidConfig}
          themeSettings={themeSettings}
          onRenderedSvg={setRenderedSvg}
        />
      </section>
    </main>
  )
}
