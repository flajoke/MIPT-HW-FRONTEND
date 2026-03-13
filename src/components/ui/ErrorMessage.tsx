interface ErrorMessageProps {
  text: string
}

function ErrorMessage({ text }: ErrorMessageProps) {
  return <div className="error-message">⚠ {text}</div>
}

export default ErrorMessage
