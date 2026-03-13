import { useState, type FormEvent } from 'react'
import ErrorMessage from '../ui/ErrorMessage'

interface AuthFormProps {
  onLogin: () => void
}

function AuthForm({ onLogin }: AuthFormProps) {
  const [credentials, setCredentials] = useState('')
  const [scope, setScope] = useState('GIGACHAT_API_PERS')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!credentials.trim()) {
      setError('Введите credentials')
      return
    }

    setError('')
    onLogin()
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Авторизация</h1>

        <label className="field">
          <span>Credentials</span>
          <input
            type="password"
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            placeholder="Base64-строка"
          />
        </label>

        <fieldset className="scope-group">
          <legend>Scope</legend>

          <label>
            <input
              type="radio"
              name="scope"
              value="GIGACHAT_API_PERS"
              checked={scope === 'GIGACHAT_API_PERS'}
              onChange={(e) => setScope(e.target.value)}
            />
            GIGACHAT_API_PERS
          </label>

          <label>
            <input
              type="radio"
              name="scope"
              value="GIGACHAT_API_B2B"
              checked={scope === 'GIGACHAT_API_B2B'}
              onChange={(e) => setScope(e.target.value)}
            />
            GIGACHAT_API_B2B
          </label>

          <label>
            <input
              type="radio"
              name="scope"
              value="GIGACHAT_API_CORP"
              checked={scope === 'GIGACHAT_API_CORP'}
              onChange={(e) => setScope(e.target.value)}
            />
            GIGACHAT_API_CORP
          </label>
        </fieldset>

        {error && <ErrorMessage text={error} />}

        <button className="primary-button auth-form__submit" type="submit">
          Войти
        </button>
      </form>
    </div>
  )
}

export default AuthForm
