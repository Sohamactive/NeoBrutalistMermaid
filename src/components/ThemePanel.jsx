const fontOptions = [
  {
    label: 'Monospace',
    value: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  {
    label: 'Grotesk',
    value: 'Helvetica, Arial, sans-serif',
  },
  {
    label: 'System Sans',
    value: 'system-ui, -apple-system, sans-serif',
  },
]

export default function ThemePanel({ themeSettings, mermaidConfig, onThemeSetting, onMermaidConfig }) {
  return (
    <section className="brutal-panel" aria-label="Theme and mermaid settings">
      <header className="panel-header">
        <h2>Theme + Config</h2>
        <p>Diagram-focused controls</p>
      </header>

      <div className="control-grid">
        <label>
          Primary color
          <input
            type="color"
            className="brutal-input"
            value={themeSettings.primaryColor}
            onChange={(event) => onThemeSetting('primaryColor', event.target.value)}
            aria-label="Primary color"
          />
        </label>

        <label>
          Diagram accent
          <input
            type="color"
            className="brutal-input"
            value={themeSettings.diagramAccent}
            onChange={(event) => onThemeSetting('diagramAccent', event.target.value)}
            aria-label="Diagram accent color"
          />
        </label>

        <label>
          Background mode
          <select
            className="brutal-input"
            value={themeSettings.backgroundMode}
            onChange={(event) => onThemeSetting('backgroundMode', event.target.value)}
            aria-label="Background mode"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <label>
          Border thickness ({themeSettings.borderThickness}px)
          <input
            type="range"
            className="brutal-input"
            min="2"
            max="4"
            step="1"
            value={themeSettings.borderThickness}
            onChange={(event) => onThemeSetting('borderThickness', Number(event.target.value))}
            aria-label="Border thickness"
          />
        </label>

        <label>
          Font family
          <select
            className="brutal-input"
            value={themeSettings.fontFamily}
            onChange={(event) => onThemeSetting('fontFamily', event.target.value)}
            aria-label="Font family"
          >
            {fontOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Mermaid theme
          <select
            className="brutal-input"
            value={mermaidConfig.theme}
            onChange={(event) => onMermaidConfig('theme', event.target.value)}
            aria-label="Mermaid theme"
          >
            <option value="default">default</option>
            <option value="dark">dark</option>
            <option value="forest">forest</option>
            <option value="neutral">neutral</option>
          </select>
        </label>

        <label>
          Curve style
          <select
            className="brutal-input"
            value={mermaidConfig.curve}
            onChange={(event) => onMermaidConfig('curve', event.target.value)}
            aria-label="Flowchart curve style"
          >
            <option value="linear">linear</option>
            <option value="basis">basis</option>
            <option value="cardinal">cardinal</option>
          </select>
        </label>

        <label>
          Node spacing
          <input
            type="number"
            className="brutal-input"
            min="10"
            max="120"
            value={mermaidConfig.nodeSpacing}
            onChange={(event) => onMermaidConfig('nodeSpacing', Number(event.target.value))}
            aria-label="Node spacing"
          />
        </label>
      </div>
    </section>
  )
}
