import { Suspense } from 'react'
import { Outlet, RouteObject, useRoutes, HashRouter, NavLink, useNavigate } from 'react-router-dom'
import { useAuthState } from '../contexts/UserContext'
import { lazyImport } from '~/utils'
import { SignInButton } from '../domain/auth/SignInButton'
import { SignOutButton } from '../domain/auth/SignOutButton'
import { Loading } from '../shared/Loading'
import { CheckIn } from '../screens/CheckIn'

const { Index } = lazyImport(() => import('~/components/screens/Index'), 'Index')
const { Page404 } = lazyImport(() => import('~/components/screens/404'), 'Page404')

const Layout = () => {
  const { state } = useAuthState()
  const navigate = useNavigate()

  return (
    <div className="w-full p-2 md:w-10/12 m-auto">
      <nav className="py-4 flex items-center justify-between">
        <div className="navbar bg-white shadow rounded-lg">
          <div className="flex-none">
            <ul className="menu menu-compact menu-horizontal px-1">
              <li className="mr-2">
                <span onClick={ () => navigate('/') }><strong>moodTracker</strong></span>
              </li>
              {state.state === 'SIGNED_IN' && <>
                <li className="mr-2 hidden"><NavLink to={ '/overview' }>Overview</NavLink></li>
                <li className="mr-2"><NavLink to={ '/' }>Check In</NavLink></li>
              </>
              }
            </ul>
          </div>
          <div className="flex-grow items-center justify-center">
            {state.state !== 'SIGNED_IN' && 'Please sign in to access moodTracker'}
          </div>
          <div className="flex-none">
            <div>
            </div>
          </div>
          <div className="flex-none dropdown dropdown-end">
            {state.state === 'SIGNED_IN' && <>
              <label tabIndex={ 0 } className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  {state.state === 'SIGNED_IN' && <img src={ state.currentUser.photoURL || 'default.png' } title={ state.currentUser.displayName || 'profile' } alt={ state.currentUser.displayName || 'profile' } />}
                </div>
              </label><ul tabIndex={ 0 } className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-white rounded-box w-52">
                <li className="bg-white">
                  <SignOutButton />
                </li>
              </ul></>}
            {state.state !== 'SIGNED_IN' && <SignInButton />}
          </div>
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
          element: <CheckIn />,
        },
        {
          path: 'overview',
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
