export default function Editor({ code, onCodeChange }) {
  return (
    <section className="brutal-panel h-full" aria-label="Mermaid editor panel">
      <header className="panel-header">
        <h2>Editor</h2>
        <p>Mermaid DSL input</p>
      </header>
      <label htmlFor="diagram-code" className="sr-only">
        Mermaid code editor
      </label>
      <textarea
        id="diagram-code"
        className="brutal-input h-[420px] w-full"
        value={code}
        onChange={(event) => onCodeChange(event.target.value)}
        spellCheck={false}
        aria-label="Mermaid code"
      />
    </section>
  )
}
