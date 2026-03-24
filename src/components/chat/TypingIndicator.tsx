interface TypingIndicatorProps {
  isVisible: boolean;
}

export default function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="message message--assistant typing-indicator" aria-live="polite">
      <div className="message__meta">
        <span>Ассистент</span>
        <span>печатает...</span>
      </div>
      <div className="typing-indicator__dots" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
