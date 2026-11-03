import { Check, Copy, User, Bot } from 'lucide-react';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/shared/lib/cn';
import { formatDateTime } from '@/shared/lib/date';
import type { Message } from '@/shared/types/chat';

interface Props {
  message: Message;
}

export const MessageBubble = ({ message }: Props) => {
  const [copied, setCopied] = useState(false);

  const isAssistant = message.role === 'assistant';
  const showCopy = isAssistant && message.content.trim().length > 0;

  const markdown = useMemo(() => message.content || (message.isStreaming ? '▍' : 'Пустой ответ'), [message.content, message.isStreaming]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn('flex gap-3', isAssistant ? 'justify-start' : 'justify-end')}>
      {isAssistant && (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10 text-blue-300">
          <Bot className="size-5" />
        </div>
      )}

      <div
        className={cn(
          'max-w-3xl rounded-3xl border px-4 py-3 shadow-xl',
          isAssistant
            ? 'border-white/10 bg-white/6 text-slate-100'
            : 'border-blue-400/40 bg-blue-500/15 text-slate-50',
        )}
      >
        <div className="prose prose-invert max-w-none prose-pre:m-0 prose-pre:bg-transparent prose-code:text-slate-100">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const { inline, className, children, ...rest } = props as React.HTMLAttributes<HTMLElement> & {
                  inline?: boolean;
                };
                const match = /language-(\w+)/.exec(className || '');
                const content = String(children).replace(/\n$/, '');

                if (!inline && match) {
                  return (
                    <div className="code-scrollbar overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80">
                      <SyntaxHighlighter language={match[1]} style={oneDark as any} PreTag="div" customStyle={{ margin: 0, background: 'transparent' }} {...rest}>
                        {content}
                      </SyntaxHighlighter>
                    </div>
                  );
                }

                return (
                  <code className="rounded bg-slate-900/80 px-1.5 py-0.5" {...rest}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>

        {message.attachments?.length ? (
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
            {message.attachments.map((attachment) => (
              <span key={attachment.id} className="rounded-xl border border-white/10 bg-black/20 px-2 py-1">
                {attachment.fileName}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-400">
          <span>{formatDateTime(message.createdAt)}</span>
          {showCopy ? (
            <button type="button" className="inline-flex items-center gap-1 rounded-xl px-2 py-1 hover:bg-white/5" onClick={handleCopy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? 'Скопировано' : 'Копировать'}
            </button>
          ) : null}
        </div>
      </div>

      {!isAssistant && (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-slate-200">
          <User className="size-5" />
        </div>
      )}
    </div>
  );
};
