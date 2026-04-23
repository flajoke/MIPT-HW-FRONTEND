import { FileImage, FileText, X } from 'lucide-react';
import type { LocalAttachment } from '@/shared/types/chat';

interface Props {
  attachments: LocalAttachment[];
  onRemove: (id: string) => void;
}

export const AttachmentList = ({ attachments, onRemove }: Props) => {
  if (!attachments.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
        >
          {attachment.kind === 'image' ? <FileImage className="size-4" /> : <FileText className="size-4" />}
          <span className="max-w-[220px] truncate">{attachment.fileName}</span>
          <button type="button" className="rounded-lg p-1 hover:bg-white/10" onClick={() => onRemove(attachment.id)}>
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
