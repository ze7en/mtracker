
import { useAuthState } from '~/components/contexts/UserContext'
import { Head } from '~/components/shared/Head'
import { CheckInForm } from '../shared/CheckInForm'

export const CheckIn = () => {
  const { state } = useAuthState()

  return (
    <>
      <Head title="TOP PAGE" />
      <div className="hero">
        <div className="text-center hero-content">
          <div>
            {state.state === 'SIGNED_IN' && <>
              <h1 className="mb-5 text-5xl font-bold">Check in</h1>
              <CheckInForm state={ state } />
            </>
            }
            {state.state !== 'SIGNED_IN' && <>
              <h1 className="mb-5 text-5xl font-bold">Please sign in</h1>
            </>
            }
          </div>
        </div>
      </div>
    </>
  )
}
