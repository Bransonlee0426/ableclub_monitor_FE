import { useRoutes } from 'react-router-dom';
import HomePage from '../pages/HomePage';

export default function RouterConfig() {
  let element = useRoutes([
    {
      path: '/',
      element: <HomePage />,
    },
  ]);

  return element;
}
