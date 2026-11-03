import ReactMarkdown from 'react-markdown'

interface MessageProps {
  author: string
  content: string
  variant: 'user' | 'assistant'
}

function Message({ author, content, variant }: MessageProps) {
  return (
    <article className={`message message--${variant}`}>
      {variant === 'assistant' && <div className="message__avatar">G</div>}

      <div className="message__body">
        <div className="message__meta">
          <span>{author}</span>
          <button className="copy-button" type="button">
            Копировать
          </button>
        </div>

        <div className="message__content markdown">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </article>
  )
}

export default Message
