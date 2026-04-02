import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/sidebar/Sidebar';

export function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
