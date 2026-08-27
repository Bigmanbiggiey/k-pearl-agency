import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import { PublicLayout } from '@/components/layout/PublicLayout';
import { StaffLayout } from '@/components/layout/StaffLayout';
import { StaffDashboardPage } from '@/pages/admin/StaffDashboardPage';
import { StaffLoginPage } from '@/pages/admin/StaffLoginPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { HomePage } from '@/pages/public/HomePage';
import { ListYourPropertyPage } from '@/pages/public/ListYourPropertyPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';
import { PrivacyPage } from '@/pages/public/PrivacyPage';
import { PropertiesPage } from '@/pages/public/PropertiesPage';
import { PropertyDetailPage } from '@/pages/public/PropertyDetailPage';
import { ServicesPage } from '@/pages/public/ServicesPage';
import { TermsPage } from '@/pages/public/TermsPage';

/**
 * Route table. Public routes under `/`, staff routes under `/staff`
 * (docs/architecture.md §4). Per-route code splitting is a Phase 3 task.
 */
export const routes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'properties', element: <PropertiesPage /> },
      { path: 'properties/:slug', element: <PropertyDetailPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'list-your-property', element: <ListYourPropertyPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: 'staff',
    element: <StaffLayout />,
    children: [
      { index: true, element: <StaffDashboardPage /> },
      { path: 'login', element: <StaffLoginPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
