import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import { PublicLayout } from '@/components/layout/PublicLayout';
import { StaffLayout } from '@/components/layout/StaffLayout';
import { RequireAdmin } from '@/features/auth';

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

const StaffLoginPage = lazy(() => import('@/pages/admin/StaffLoginPage'));
const StaffForgotPage = lazy(() => import('@/pages/admin/StaffForgotPage'));
const StaffResetPage = lazy(() => import('@/pages/admin/StaffResetPage'));
const StaffDashboardPage = lazy(() => import('@/pages/admin/StaffDashboardPage'));
const StaffPropertiesPage = lazy(() => import('@/pages/admin/StaffPropertiesPage'));
const StaffPropertyEditorPage = lazy(() => import('@/pages/admin/StaffPropertyEditorPage'));
const StaffSubmissionsPage = lazy(() => import('@/pages/admin/StaffSubmissionsPage'));
const StaffEnquiriesPage = lazy(() => import('@/pages/admin/StaffEnquiriesPage'));
const StaffViewingsPage = lazy(() => import('@/pages/admin/StaffViewingsPage'));
const StaffSettingsPage = lazy(() => import('@/pages/admin/StaffSettingsPage'));
const StaffTeamPage = lazy(() => import('@/pages/admin/StaffTeamPage'));

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

  // Staff auth — no layout, no guard
  { path: 'staff/login', element: <StaffLoginPage /> },
  { path: 'staff/forgot', element: <StaffForgotPage /> },
  { path: 'staff/reset', element: <StaffResetPage /> },

  // Staff app — StaffLayout wraps RequireStaff
  {
    path: 'staff',
    element: <StaffLayout />,
    children: [
      { index: true, element: <StaffDashboardPage /> },
      { path: 'properties', element: <StaffPropertiesPage /> },
      { path: 'properties/new', element: <StaffPropertyEditorPage /> },
      { path: 'properties/:id', element: <StaffPropertyEditorPage /> },
      { path: 'submissions', element: <StaffSubmissionsPage /> },
      { path: 'enquiries', element: <StaffEnquiriesPage /> },
      { path: 'viewings', element: <StaffViewingsPage /> },
      {
        path: 'settings',
        element: (
          <RequireAdmin>
            <StaffSettingsPage />
          </RequireAdmin>
        ),
      },
      {
        path: 'team',
        element: (
          <RequireAdmin>
            <StaffTeamPage />
          </RequireAdmin>
        ),
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
