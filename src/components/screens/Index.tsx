
import { useAuthState } from '~/components/contexts/UserContext'
import { Head } from '~/components/shared/Head'
import { MoodChart } from '../shared/MoodChart'

export const Index = () => {
  const { state } = useAuthState()

  return (
    <>
      <Head title="TOP PAGE" />
      {state.state === 'SIGNED_IN' &&
      <>
        <div className="hero">
          <div className="text-center hero-content">
            <div>
              <h1 className="mb-5 text-5xl font-bold">Overview</h1>
            </div>
          </div>
        </div>

        <MoodChart />
      </>}
    </>
  )
}
