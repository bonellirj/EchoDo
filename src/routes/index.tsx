import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../components/Layout';
import PageLoader from '../components/PageLoader';

// Lazy load pages for better performance
const HomePage = lazy(() => import('../pages/HomePage.tsx'));
const CalendarPage = lazy(() => import('../pages/CalendarPage.tsx'));
const SettingsPage = lazy(() => import('../pages/SettingsPage.tsx'));

// Centralized route definitions
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },

      {
        path: 'calendar',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CalendarPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router; 