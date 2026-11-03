import { RangeField } from '@/shared/ui/RangeField';
import { Textarea } from '@/shared/ui/Textarea';
import type { ChatSettings } from '@/shared/types/chat';

interface Props {
  settings: ChatSettings;
  models: string[];
  onChange: (patch: Partial<ChatSettings>) => void;
}

export const ChatSettingsPanel = ({ settings, models, onChange }: Props) => (
  <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
    <div className="grid gap-2 md:grid-cols-2">
      <label className="grid gap-2 text-sm text-slate-200">
        <span>Модель</span>
        <select
          className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"
          value={settings.model}
          onChange={(event) => onChange({ model: event.target.value })}
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm text-slate-200">
        <span>Function call</span>
        <select
          className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"
          value={settings.function_call}
          onChange={(event) => onChange({ function_call: event.target.value as ChatSettings['function_call'] })}
        >
          <option value="auto">auto</option>
          <option value="none">none</option>
        </select>
      </label>
    </div>

    <label className="grid gap-2 text-sm text-slate-200">
      <span>System prompt</span>
      <Textarea value={settings.systemPrompt} onChange={(e) => onChange({ systemPrompt: e.target.value })} />
    </label>

    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <RangeField label="temperature" min={0} max={2} step={0.1} value={settings.temperature} onChange={(value) => onChange({ temperature: value })} />
      <RangeField label="top_p" min={0} max={1} step={0.05} value={settings.top_p} onChange={(value) => onChange({ top_p: value })} />
      <RangeField label="max_tokens" min={256} max={4096} step={128} value={settings.max_tokens} onChange={(value) => onChange({ max_tokens: value })} />
      <RangeField label="repetition_penalty" min={0} max={2} step={0.1} value={settings.repetition_penalty} onChange={(value) => onChange({ repetition_penalty: value })} />
    </div>
  </div>
);
