import { create } from 'zustand'

const STORAGE_KEY = 'neo-brutalist-mermaid-workspace'
const MAX_HISTORY = 100

const DEFAULT_CODE = `flowchart TD
    A[Start] --> B{Neo-Brutalist Mermaid}
    B -->|Edit| C[Live Preview]
    B -->|Theme| D[Hard Borders]
    C --> E[Export SVG/PNG]
    D --> E`

const defaultState = {
  diagramCode: DEFAULT_CODE,
  themeSettings: {
    primaryColor: '#ff2a2a',
    diagramAccent: '#ffef00',
    backgroundMode: 'light',
    borderThickness: 3,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  mermaidConfig: {
    theme: 'default',
    curve: 'basis',
    nodeSpacing: 50,
  },
  layoutPreset: 'compact',
  history: [DEFAULT_CODE],
  historyIndex: 0,
  renderedSvg: '',
}

function decodeState(value) {
  try {
    const bytes = Uint8Array.from(atob(value), (char) => char.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return null
  }
}

function encodeState(value) {
  const encoded = new TextEncoder().encode(JSON.stringify(value))
  let binary = ''
  encoded.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

function normalizeLoadedState(candidate) {
  if (!candidate || typeof candidate !== 'object') {
    return defaultState
  }

  const diagramCode = typeof candidate.diagramCode === 'string' ? candidate.diagramCode : defaultState.diagramCode
  const history = Array.isArray(candidate.history) && candidate.history.length > 0 ? candidate.history : [diagramCode]
  const historyIndex = Number.isInteger(candidate.historyIndex)
    ? Math.max(0, Math.min(candidate.historyIndex, history.length - 1))
    : history.length - 1

  return {
    ...defaultState,
    diagramCode,
    history,
    historyIndex,
    themeSettings: {
      ...defaultState.themeSettings,
      ...(candidate.themeSettings ?? {}),
    },
    mermaidConfig: {
      ...defaultState.mermaidConfig,
      ...(candidate.mermaidConfig ?? {}),
    },
    layoutPreset: candidate.layoutPreset ?? defaultState.layoutPreset,
  }
}

function loadInitialState() {
  if (typeof window === 'undefined') {
    return defaultState
  }

  const params = new URLSearchParams(window.location.search)
  const sharedState = params.get('state')
  if (sharedState) {
    const decoded = decodeState(sharedState)
    if (decoded) {
      return normalizeLoadedState(decoded)
    }
  }

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) {
    return defaultState
  }

  try {
    return normalizeLoadedState(JSON.parse(saved))
  } catch {
    return defaultState
  }
}

export function buildPersistableState(state) {
  return {
    diagramCode: state.diagramCode,
    themeSettings: state.themeSettings,
    mermaidConfig: state.mermaidConfig,
    layoutPreset: state.layoutPreset,
    history: state.history,
    historyIndex: state.historyIndex,
  }
}

export function persistWorkspace(state) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(buildPersistableState(state)))
}

export function buildShareUrl(state) {
  if (typeof window === 'undefined') {
    return ''
  }

  const url = new URL(window.location.href)
  url.searchParams.set('state', encodeState(buildPersistableState(state)))
  return url.toString()
}

const initialState = loadInitialState()

export const useDiagramStore = create((set, get) => ({
  ...initialState,
  setDiagramCode: (value) => {
    set((state) => {
      if (value === state.diagramCode) {
        return state
      }

      const nextHistory = [...state.history.slice(0, state.historyIndex + 1), value].slice(-MAX_HISTORY)

      return {
        diagramCode: value,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      }
    })
  },
  setThemeSetting: (key, value) => {
    set((state) => ({
      themeSettings: {
        ...state.themeSettings,
        [key]: value,
      },
    }))
  },
  setMermaidConfig: (key, value) => {
    set((state) => ({
      mermaidConfig: {
        ...state.mermaidConfig,
        [key]: value,
      },
    }))
  },
  setLayoutPreset: (layoutPreset) => set({ layoutPreset }),
  setRenderedSvg: (renderedSvg) => set({ renderedSvg }),
  undo: () => {
    const state = get()
    if (state.historyIndex <= 0) {
      return
    }

    const nextIndex = state.historyIndex - 1
    set({
      historyIndex: nextIndex,
      diagramCode: state.history[nextIndex],
    })
  },
  redo: () => {
    const state = get()
    if (state.historyIndex >= state.history.length - 1) {
      return
    }

    const nextIndex = state.historyIndex + 1
    set({
      historyIndex: nextIndex,
      diagramCode: state.history[nextIndex],
    })
  },
  resetWorkspace: () => set(defaultState),
}))
