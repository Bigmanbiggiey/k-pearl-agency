import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import { PublicLayout } from '@/components/layout/PublicLayout';
import { StaffLayout } from '@/components/layout/StaffLayout';

/**
 * Route table. Public routes under `/`, staff routes under `/staff`
 * (docs/architecture.md §4). Pages are lazily loaded — the layouts provide the
 * <Suspense> boundary.
 */

const HomePage = lazy(() => import('@/pages/public/HomePage'));
const PropertiesPage = lazy(() => import('@/pages/public/PropertiesPage'));
const PropertyDetailPage = lazy(() => import('@/pages/public/PropertyDetailPage'));
const ServicesPage = lazy(() => import('@/pages/public/ServicesPage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const AreasPage = lazy(() => import('@/pages/public/AreasPage'));
const ListYourPropertyPage = lazy(() => import('@/pages/public/ListYourPropertyPage'));
const PrivacyPage = lazy(() => import('@/pages/public/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/public/TermsPage'));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'));
const StaffDashboardPage = lazy(() => import('@/pages/admin/StaffDashboardPage'));
const StaffLoginPage = lazy(() => import('@/pages/admin/StaffLoginPage'));

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
      { path: 'areas', element: <AreasPage /> },
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
