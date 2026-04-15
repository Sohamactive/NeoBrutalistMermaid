export default function Toolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExportSvg,
  onExportPng,
  onCopy,
  onShare,
  onReset,
  layoutPreset,
  onLayoutChange,
  onToggleFullscreen,
}) {
  return (
    <section className="brutal-panel" aria-label="Toolbar">
      <header className="panel-header">
        <h2>Toolbar</h2>
        <p>Export, history, layouts</p>
      </header>

      <div className="button-row">
        <button type="button" className="brutal-button" onClick={onUndo} disabled={!canUndo}>
          Undo
        </button>
        <button type="button" className="brutal-button" onClick={onRedo} disabled={!canRedo}>
          Redo
        </button>
        <button type="button" className="brutal-button" onClick={onExportSvg}>
          Export SVG
        </button>
        <button type="button" className="brutal-button" onClick={onExportPng}>
          Export PNG
        </button>
        <button type="button" className="brutal-button" onClick={onCopy}>
          Copy SVG
        </button>
        <button type="button" className="brutal-button" onClick={onShare}>
          Copy Share URL
        </button>
      </div>

      <div className="button-row">
        <button
          type="button"
          className="brutal-button"
          data-active={layoutPreset === 'compact'}
          onClick={() => onLayoutChange('compact')}
        >
          Compact
        </button>
        <button
          type="button"
          className="brutal-button"
          data-active={layoutPreset === 'presentation'}
          onClick={() => onLayoutChange('presentation')}
        >
          Presentation
        </button>
        <button
          type="button"
          className="brutal-button"
          data-active={layoutPreset === 'fullscreen'}
          onClick={() => onLayoutChange('fullscreen')}
        >
          Fullscreen
        </button>
        <button type="button" className="brutal-button" onClick={onToggleFullscreen}>
          Browser Fullscreen
        </button>
        <button type="button" className="brutal-button" onClick={onReset}>
          Reset
        </button>
      </div>
    </section>
  )
}
