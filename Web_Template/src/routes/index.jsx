import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import Loadable from 'components/Loadable';
import SimpleLayout from 'layout/Simple';
import { SimpleLayoutType } from 'config';

// Lazy–load your one page:
const CustomerListPage = Loadable(
  lazy(() => import('pages/apps/customer/list'))
);

const router = createBrowserRouter(
  [
    {
      // Wrap in your layout if you need it; otherwise remove `element` too
      element: <SimpleLayout layout={SimpleLayoutType.LANDING} />,
      children: [
        {
          path: '/customers',
          element: <CustomerListPage />
        },
        {
          // catch‑all → redirect to /customers
          path: '*',
          element: <Navigate to="/customers" replace />
        }
      ]
    }
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME }
);

export default router;
