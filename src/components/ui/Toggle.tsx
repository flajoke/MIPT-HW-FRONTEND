interface ToggleProps {
  label: string
  checked: boolean
  onChange: () => void
}

function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="toggle">
      <span>{label}</span>
      <button className={`toggle__control ${checked ? 'toggle__control--active' : ''}`} type="button" onClick={onChange}>
        <span />
      </button>
    </label>
  )
}

export default Toggle
