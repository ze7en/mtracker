import { uid } from 'uid'
import { set, ref, getDatabase, get } from 'firebase/database'
import { useAuthState } from '~/components/contexts/UserContext'
import { Head } from '~/components/shared/Head'
import { ChangeEvent, useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const baseData = [
  {
    date: '2022/01/01',
    ratings: [ 5, 5, 5, 5 ],
    notes: [],
    avg: 5,
  },
  {
    date: '2022/01/02',
    ratings: [ 3 ],
    avg: 3,
    notes: [],
  },
  {
    date: '2023/01/01',
    ratings: [ 5, 5, 5, 5 ],
    notes: [],
    avg: 5,
  },
  {
    date: '2023/01/02',
    ratings: [ 3 ],
    avg: 3,
    notes: [],
  },
  {
    date: '2023/01/03',
    ratings: [ 2, 3, 1 ],
    avg: 2,
    notes: [],
  },
  {
    date: '2023/01/04',
    ratings: [ 2, 3, 5 ],
    avg: 4,
    notes: [],
  },
  {
    date: '2023/01/05',
    ratings: [ 5, 5 ],
    avg: 5,
    notes: [],
  },
]

const getDateString = (dateInput: string | number) => {
  const date = new Date(dateInput)

  return `${date.getFullYear()}/${date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/${date.getDate() < 9 ? `0${date.getDate()}` : date.getDate()}`
}

export const Index = () => {
  const { state } = useAuthState()
  const db = getDatabase()
  const [ rating, setRating ] = useState('3')
  const [ filter, setFilter ] = useState(-1)
  const [ note, setNote ] = useState('')
  const [ checkins, setCheckins ] = useState<any>(baseData)
  const [ checkedIn, setCheckedIn ] = useState(false)

  useEffect(() => {
    get(ref(db, 'checkins')).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const values = Object.values(data)

        const groupedData = values.reduce((r: any, a:any) => {
          r[a.date] = r[a.date] || []
          r[a.date].push(a)

          return r
        }, Object.create(null))

        const chartData = Object.entries(groupedData as object).map(([ key, value ]) => {
          return {
            date: key,
            ratings: [ value.map((v: any) => v.rating) ],
            notes: [ value.map((v: any) => v.note) ],
            avg: (value.reduce((a: any, b: any) => parseInt(a) + parseInt(b.rating), 0) / value.length).toFixed(1),
          }
        })

        chartData.filter((c: any) => c.date === getDateString(Date.now())).length > 0 && setCheckedIn(true)

        setCheckins([ ...baseData, ...chartData ])
      } else {
        console.log('No data available')
      }
    }).catch((error) => {
      console.log('error get', error)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ checkedIn ])

  const handleSubmitMood = () => {
    if (state.state === 'SIGNED_IN') {
      const uidd = uid()

      set(ref(db, `checkins/${uidd}`), {
        rating,
        note,
        date: getDateString(Date.now()),
        user: {
          uid: state.currentUser.uid,
          displayname: state.currentUser.displayName,
          photoURL: state.currentUser.photoURL,
        },
        uidd,
      }).then(() => {
        setCheckedIn(true)
      }).catch((error) => {
        console.log('error set', error)
      })
    }
  }

  type TooltipProps = {
    active?: boolean;
    payload?: any;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded border border-gray-500 p-2">
          <p className="font-semibold">{label}</p>
          <p>Average rating: {payload[0].value}</p>
          <p>All ratings: {payload[0].payload.ratings.toString()}</p>
          <ul>
            <li key="0">All notes:</li>
            {payload[0].payload.notes?.map((notes: any) => notes?.map((note: any, index: number) => note.length > 0 && <li className="block mt-1" key={ index+1 }>{`"${note}"`}</li>))}
          </ul>
        </div>
      )
    }

    return null
  }

  return (
    <>
      <Head title="TOP PAGE" />

      {state.state === 'SIGNED_IN' &&
      <div>
        <div className="hero">
          <div className="text-center hero-content">
            <div>
              <h1 className="mb-5 text-5xl font-bold">{checkedIn ? 'Overview' : 'Check in'}</h1>
              {!checkedIn && <div className="grid gap-2">
                <div className="btn-group">
                  <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => setRating(e.target.value) } name="options" data-title="1" value="1" className="btn mask mask-star-2 opacity-30 bg-red-400 checked:!bg-red-400 checked:opacity-100 checked:!text-white" />
                  <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => setRating(e.target.value) } name="options" data-title="2" value="2" className="btn mask mask-star-2 opacity-30 bg-orange-400 checked:!bg-orange-400 checked:opacity-100 checked:!text-white" />
                  <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => setRating(e.target.value) } name="options" data-title="3" value="3" className="btn mask mask-star-2 opacity-30 bg-yellow-400 checked:!bg-yellow-400 checked:opacity-100 checked:!text-white" />
                  <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => setRating(e.target.value) } name="options" data-title="4" value="4" className="btn mask mask-star-2 opacity-30 bg-lime-400 checked:!bg-lime-400 checked:opacity-100 checked:!text-white" />
                  <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => setRating(e.target.value) } name="options" data-title="5" value="5" className="btn mask mask-star-2 opacity-30 bg-green-400 checked:!bg-green-400 checked:opacity-100 checked:!text-white" />
                </div>
                <textarea value={ note } onChange={ (e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value) } className="w-full p-2 border border-gray-300 rounded" />
                <button onClick={ handleSubmitMood } className="btn btn-primary btn-md">Check in</button>
              </div>}
            </div>
          </div>
        </div>
        <div className="w-full" style={ { height: 400 } }>
          {checkedIn && <>
            <div className="w-full text-center mb-8">
              <div className="btn-group m-auto">
                <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => console.log('7 days') } name="options" data-title="7 days" value="1" className="btn" />
                <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => console.log('2023') } name="options" data-title="2023" value="2023" className="btn" />
                <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => console.log('2022') } name="options" data-title="2022" value="2022" className="btn" />
                <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => console.log('All') } name="options" data-title="All" value="-1" className="btn" />
              </div>
            </div>
            <ResponsiveContainer>
              <LineChart
                width={ 500 }
                height={ 300 }
                data={ checkins }
                margin={ {
                  top: 10,
                  right: 40,
                  left: 0,
                  bottom: 10,
                } }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={ <CustomTooltip /> } />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#1A8763"
                  activeDot={ { r: 8 } }
                />
              </LineChart>
            </ResponsiveContainer>
          </>
          }
        </div>
      </div>}
    </>
  )
}
