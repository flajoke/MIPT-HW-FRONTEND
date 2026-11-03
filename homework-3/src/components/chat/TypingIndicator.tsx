interface TypingIndicatorProps {
  isVisible?: boolean
}

function TypingIndicator({ isVisible = true }: TypingIndicatorProps) {
  if (!isVisible) {
    return null
  }

  return (
    <div className="typing-indicator">
      <div className="message__avatar">G</div>
      <div className="typing-indicator__bubble">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

export default TypingIndicator
