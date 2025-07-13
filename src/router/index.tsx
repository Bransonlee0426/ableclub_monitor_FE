import { useRoutes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';

export default function RouterConfig() {
  let element = useRoutes([
    {
      path: '/',
      element: <LoginPage />,
    },
    {
      path: '/home',
      element: <HomePage />,
    },
  ]);

  return element;
}
