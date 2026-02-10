import Loading from 'components/loading';
import PageLoading from 'components/pageLoading';
import i18n from 'configs/i18next';
import { PathLogout } from 'context/path-logout';
import { ProtectedRoute } from 'context/protected-route';
import AppLayout from 'layout/app-layout';
import { WelcomeLayout } from 'layout/welcome-layout';
import Providers from 'providers';
import { Suspense, useEffect, useState, useCallback } from 'react';
import { WeekRangeProvider } from 'context/WeekRangeContext';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AllRoutes } from 'routes';
import informationService from 'services/rest/information';
import GlobalSettings from 'views/global-settings/global-settings';
import Login from 'views/login';
import NotFound from 'views/not-found';
import Welcome from 'views/welcome/welcome';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { cacheChecker } from './cacheChecker';
import {
  fetchRestSettings,
  fetchSettings,
} from './redux/slices/globalSettings';

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth, shallowEqual);

  const [loading, setLoading] = useState(false);

  const fetchUserSettings = useCallback((role) => {
    switch (role) {
      case 'admin':
        dispatch(fetchSettings({}));
        break;
      case 'seller':
        dispatch(fetchRestSettings({ seller: true }));
        break;
      default:
        dispatch(fetchRestSettings({}));
    }
  }, [dispatch]);

  useEffect(() => {
    cacheChecker();
  }, []);

  useEffect(() => {
    fetchTranslations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchUserSettings(user?.role || '');
  }, [user?.role, fetchUserSettings]);

  const fetchTranslations = () => {
    const params = { lang: i18n.language };
    setLoading(true);
    informationService
      .translations(params)
      .then(({ data }) =>
        i18n.addResourceBundle(i18n.language, 'translation', data),
      )
      .finally(() => setLoading(false));
  };

  return (
    <Providers>
      <Router>
        <WeekRangeProvider>
          <Routes>
            <Route
              path='/login'
              element={
                <PathLogout>
                  <Login />
                </PathLogout>
              }
            />
            <Route
              path='/welcome'
              element={
                <WelcomeLayout>
                  <Welcome />
                </WelcomeLayout>
              }
            />
            <Route
              path='/installation'
              element={
                <WelcomeLayout>
                  <GlobalSettings />
                </WelcomeLayout>
              }
            />

            {/* Protected app layout with nested routes */}
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Redirect root to dashboard */}
              <Route index element={<Navigate to='/dashboard' replace />} />
              
              {/* All app routes */}
              {AllRoutes.map(({ path, component: Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            </Route>

            {/* 404 Not Found - must be last */}
            <Route
              path='*'
              element={
                <Suspense fallback={<Loading />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Routes>
        </WeekRangeProvider>
        <ToastContainer
          className='antd-toast'
          position='top-right'
          autoClose={2500}
          hideProgressBar
          closeOnClick
          pauseOnHover
          draggable
        />
        {loading && <PageLoading />}
      </Router>
    </Providers>
  );
};
export default App;