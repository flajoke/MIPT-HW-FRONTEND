import { useMemo, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import ErrorMessage from '../ui/ErrorMessage'

function InputArea() {
  const [value, setValue] = useState('')
  const isDisabled = useMemo(() => value.trim().length === 0, [value])

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
    }
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
    event.target.style.height = 'auto'
    const maxHeight = 24 * 5
    event.target.style.height = `${Math.min(event.target.scrollHeight, maxHeight)}px`
  }

  return (
    <div className="input-area-wrap">
      <div className="input-area">
        <button className="icon-button" type="button" aria-label="Прикрепить изображение">
          🖼
        </button>

        <textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Введите сообщение"
        />

        <button className="secondary-button" type="button">
          Стоп
        </button>
        <button className="primary-button" type="button" disabled={isDisabled}>
          Отправить
        </button>
      </div>

      <ErrorMessage text="Это моковый интерфейс без отправки запроса." />
    </div>
  )
}

export default InputArea
