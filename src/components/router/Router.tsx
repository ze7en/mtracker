import { Suspense } from 'react'
import { Outlet, RouteObject, useRoutes, HashRouter } from 'react-router-dom'
import { useAuthState } from '../contexts/UserContext'
import { lazyImport } from '~/utils'
import { SignInButton } from '../domain/auth/SignInButton'
import { SignOutButton } from '../domain/auth/SignOutButton'
import { Loading } from '../shared/Loading'

const { Index } = lazyImport(() => import('~/components/screens/Index'), 'Index')
const { Page404 } = lazyImport(() => import('~/components/screens/404'), 'Page404')

const Layout = () => {
  const { state } = useAuthState()

  return (
    <div className="w-full p-2 md:w-8/12 m-auto">
      <nav className="p-4 flex items-center justify-between">
        <span>
          {state.state === 'SIGNED_IN' ? `Welcome to moodTracker` : 'Please sign in to access moodTracker'}
          {state.state === 'SIGNED_IN' && <img src={ state.currentUser.photoURL || 'default.png' } title={ state.currentUser.displayName || 'profile' } alt={ state.currentUser.displayName || 'profile' } className="inline ml-2 w-6 h-6 rounded-lg" />}
        </span>
        <div>
          {state.state === 'UNKNOWN' ? null : state.state === 'SIGNED_OUT' ? <SignInButton /> : <SignOutButton />}
        </div>
      </nav>
      <Outlet />
    </div>
  )
}

export const Router = () => {
  return (
    <HashRouter>
      <InnerRouter />
    </HashRouter>
  )
}

const InnerRouter = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Index />,
        },
        {
          path: '*',
          element: <Page404 />,
        },
      ],
    },
  ]
  const element = useRoutes(routes)

  return (
    <div>
      <Suspense fallback={ <Loading /> }>{element}</Suspense>
    </div>
  )
}
