import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../components/Layout';

// Lazy load pages for better performance
const HomePage = lazy(() => import('../pages/HomePage.tsx'));
const CalendarPage = lazy(() => import('../pages/CalendarPage.tsx'));
const SettingsPage = lazy(() => import('../pages/SettingsPage.tsx'));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

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