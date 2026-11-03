import { useEffect, useState } from 'react';
import styles from '../../styles/Toggle.module.css';

function Toggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label="Переключить тему"
      aria-pressed={theme === 'dark'}
    >
      <span className={styles.track}>
        <span className={`${styles.thumb} ${theme === 'dark' ? styles.thumbActive : ''}`} />
      </span>
      <span className={styles.label}>{theme === 'dark' ? 'Тёмная тема' : 'Светлая тема'}</span>
    </button>
  );
}

export default Toggle;
