import { ImagePlus, LoaderCircle, Paperclip, Send, Square } from 'lucide-react';
import { useRef, useState } from 'react';
import { uploadAttachment } from '@/shared/lib/api';
import type { LocalAttachment } from '@/shared/types/chat';
import { Button } from '@/shared/ui/Button';
import { Textarea } from '@/shared/ui/Textarea';
import { AttachmentList } from '@/features/upload-attachments/ui/AttachmentList';

interface Props {
  isGenerating: boolean;
  onSend: (content: string, attachments: LocalAttachment[]) => Promise<void> | void;
  onStop: () => void;
}

export const Composer = ({ isGenerating, onSend, onStop }: Props) => {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [isUploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);

    try {
      const uploaded = await Promise.all(Array.from(files).map(uploadAttachment));
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка загрузки файла');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (isGenerating || isUploading) return;
    const nextValue = value;
    const nextAttachments = attachments;
    setValue('');
    setAttachments([]);
    await onSend(nextValue, nextAttachments);
  };

  return (
    <div className="grid gap-3 rounded-[2rem] border border-white/10 bg-slate-950/40 p-4 backdrop-blur">
      <AttachmentList attachments={attachments} onRemove={(id) => setAttachments((prev) => prev.filter((item) => item.id !== id))} />

      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Напиши сообщение. Shift+Enter — новая строка"
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            void handleSubmit();
          }
        }}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(event) => void handleUpload(event.target.files)}
            accept="image/*,.pdf,.doc,.docx,.txt,.ppt,.pptx,.xlsx,.mp3,.wav,.ogg"
          />
          <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="size-4" /> Файлы
          </Button>
          <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus className="size-4" /> Картинка
          </Button>
          {isUploading ? (
            <span className="inline-flex items-center gap-2 text-sm text-slate-400">
              <LoaderCircle className="size-4 animate-spin" /> Загрузка файла...
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {isGenerating ? (
            <Button type="button" variant="danger" onClick={onStop}>
              <Square className="size-4" /> Остановить генерацию
            </Button>
          ) : null}
          <Button type="button" variant="primary" onClick={() => void handleSubmit()} disabled={isUploading || (!value.trim() && !attachments.length)}>
            <Send className="size-4" /> Отправить
          </Button>
        </div>
      </div>
    </div>
  );
};
