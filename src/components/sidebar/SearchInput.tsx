interface SearchInputProps {
  placeholder?: string
}

function SearchInput({ placeholder = 'Поиск' }: SearchInputProps) {
  return (
    <label className="search-input">
      <span>⌕</span>
      <input type="text" placeholder={placeholder} />
    </label>
  )
}

export default SearchInput
