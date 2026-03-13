import { useEffect, useState } from 'react'
import type { ModelOption, ThemeMode } from '../../App'
import Slider from '../ui/Slider'
import Toggle from '../ui/Toggle'

interface SettingsState {
  model: ModelOption
  temperature: number
  topP: number
  maxTokens: number
  systemPrompt: string
}

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  settings: SettingsState
  onSave: (settings: SettingsState) => void
  onReset: () => void
  theme: ThemeMode
  onToggleTheme: () => void
}

function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onSave,
  onReset,
  theme,
  onToggleTheme,
}: SettingsPanelProps) {
  const [form, setForm] = useState<SettingsState>(settings)

  useEffect(() => {
    setForm(settings)
  }, [settings, isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <>
      <button className="settings-overlay" type="button" onClick={onClose} />
      <aside className="settings-panel">
        <div className="settings-panel__header">
          <h2>Настройки</h2>
          <button className="icon-button" type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <label className="field">
          <span>Модель</span>
          <select
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value as ModelOption })}
          >
            <option>GigaChat</option>
            <option>GigaChat-Plus</option>
            <option>GigaChat-Pro</option>
            <option>GigaChat-Max</option>
          </select>
        </label>

        <Slider
          label="Temperature"
          min={0}
          max={2}
          step={0.1}
          value={form.temperature}
          onChange={(value) => setForm({ ...form, temperature: value })}
        />

        <Slider
          label="Top-P"
          min={0}
          max={1}
          step={0.1}
          value={form.topP}
          onChange={(value) => setForm({ ...form, topP: value })}
        />

        <label className="field">
          <span>Max Tokens</span>
          <input
            type="number"
            value={form.maxTokens}
            onChange={(e) => setForm({ ...form, maxTokens: Number(e.target.value) })}
          />
        </label>

        <label className="field">
          <span>System Prompt</span>
          <textarea
            rows={5}
            value={form.systemPrompt}
            onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
          />
        </label>

        <Toggle
          label="Тёмная тема"
          checked={theme === 'dark'}
          onChange={onToggleTheme}
        />

        <div className="settings-panel__actions">
          <button className="secondary-button" type="button" onClick={onReset}>
            Сбросить
          </button>
          <button className="primary-button" type="button" onClick={() => onSave(form)}>
            Сохранить
          </button>
        </div>
      </aside>
    </>
  )
}

export default SettingsPanel
