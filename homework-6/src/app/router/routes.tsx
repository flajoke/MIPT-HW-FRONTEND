import { createBrowserRouter } from 'react-router-dom';
import { App } from '../../App';
import { ChatPage } from '../../pages/ChatPage';
import { HomePage } from '../../pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'chat/:id', element: <ChatPage /> },
    ],
  },
]);
