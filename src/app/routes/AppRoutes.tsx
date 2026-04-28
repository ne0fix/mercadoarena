import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '../../core/constants/config';
import { Loader } from '../../views/components/common/Loader';

const LoginPage = lazy(() => import('../../views/pages/Login'));
const HomePage = lazy(() => import('../../views/pages/Home'));
const BookingPage = lazy(() => import('../../views/pages/Booking'));
const PaymentPage = lazy(() => import('../../views/pages/Payment'));
const SuccessPage = lazy(() => import('../../views/pages/Success'));
const ErrorPage = lazy(() => import('../../views/pages/Error'));
const ContactPage = lazy(() => import('../../views/pages/Contact'));
const ProfilePage = lazy(() => import('../../views/pages/Profile'));
const BookingsPage = lazy(() => import('../../views/pages/Bookings'));

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface"><Loader /></div>}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.BOOKING} element={<BookingPage />} />
          <Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.BOOKINGS} element={<BookingsPage />} />
          <Route path={ROUTES.SUCCESS} element={<SuccessPage />} />
          <Route path={ROUTES.ERROR} element={<ErrorPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
