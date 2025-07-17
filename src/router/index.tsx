import { useRoutes, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import ProtectedRoute from '../components/ProtectedRoute';

export default function RouterConfig() {
  let element = useRoutes([
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/home',
          element: <HomePage />,
        },
        // Add more protected routes here as needed
      ],
    },
  ]);

  return element;
}
