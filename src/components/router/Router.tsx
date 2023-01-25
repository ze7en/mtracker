import { lazy, Suspense } from 'react';
import { Outlet, RouteObject, useRoutes, HashRouter } from 'react-router-dom';
import { useAuthState } from '../contexts/UserContext';

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

const IndexScreen = lazy(() => import('~/components/screens/Index'));
const Page404Screen = lazy(() => import('~/components/screens/404'));

function Layout() {
  const { state } = useAuthState();

  console.log(state.state)

  return (
    <div>
      <nav className="p-4 flex items-center justify-between">
        <span>{state.state === 'SIGNED_IN' ? `Welcome to mTracker ${state.currentUser.displayName}` : 'Please sign in to access mTracker'}</span>
      </nav>
      <Outlet />
    </div>
  );
}

export const Router = () => {
  return (
    <HashRouter>
      <InnerRouter />
    </HashRouter>
  );
};

const InnerRouter = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <IndexScreen />,
        },
        {
          path: '*',
          element: <Page404Screen />,
        },
      ],
    },
  ];
  const element = useRoutes(routes);
  return (
    <div>
      <Suspense fallback={<Loading />}>{element}</Suspense>
    </div>
  );
};
