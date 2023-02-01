import { get, ref, getDatabase, DatabaseReference, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database'
import { useEffect, useState } from 'react'
import {
  ComposedChart,
  Line,
  Label,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer } from 'recharts'
import { MoodChartTooltip } from './MoodChartTooltip'
import { OverallStatus } from './OverallMoodStatus'

export const MoodChart = () => {
  const [ checkins, setCheckins ] = useState<any>([])
  const [ filteredCheckins, setFilteredCheckins ] = useState<any>([])
  const [ amountOfCheckins, setAmountOfCheckins ] = useState<any>(0)
  const [ averageRating, setAverageRating ] = useState<number>(3)
  const [ filter, setFilter ] = useState<string>('10')
  const [ showFilter, setShowFilter ] = useState<boolean>(checkins && checkins.length > 10)

  const db = getDatabase()

  const getCheckinInitChartData = (checkinsRef: DatabaseReference) => {
    get(checkinsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()

        let overallAverage = 0
        let nbOfCheckins = 0

        const chartData = [] as any

        Object.entries(data as object).map(([ year, monthData ]) => {
          Object.entries(monthData as object).map(([ month, dayData ]) => {
            Object.entries(dayData as object).map(([ day, entries ]) => {
              const checkin = {
                date: '',
                ratings: [ ] as number[],
                notes: [ ] as string[],
                avg: 0,
              }

              Object.entries(entries as object).map(([ userId, entry ]) => {
                overallAverage += parseInt(entry.rating)
                nbOfCheckins += 1

                checkin.date = new Date(entry.date).toLocaleDateString()
                checkin.notes.push(entry.note)
                checkin.ratings.push(parseInt(entry.rating))
              })

              checkin.avg = checkin.ratings.reduce((a: number, b: number) => a + b, 0) / checkin.ratings.length

              chartData.push(checkin)
            })
          })
        })

        setAverageRating(overallAverage / nbOfCheckins)
        setAmountOfCheckins(nbOfCheckins)
        setShowFilter(nbOfCheckins > 10)

        setCheckins([ ...chartData ].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()))

      } else {
        console.log(':: no data available')
      }
    }).catch((error) => {
      console.log(':: error get mood data', error)
    })
  }

  useEffect(() => {
    const checkinsRef = ref(db, 'checkins')

    getCheckinInitChartData(checkinsRef)

    onChildAdded(checkinsRef, () => {
      getCheckinInitChartData(checkinsRef)
    })

    onChildChanged(checkinsRef, () => {
      getCheckinInitChartData(checkinsRef)
    })

    onChildRemoved(checkinsRef, () => {
      getCheckinInitChartData(checkinsRef)
    })

    getCheckinInitChartData(checkinsRef)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ])

  useEffect(() => {
    const filteredCheckins = [ ...checkins ]

    const filterNumber = parseInt(filter)

    if (filterNumber < 100 && filterNumber > 0 && filteredCheckins.length >= 10) {
      setFilteredCheckins(filteredCheckins.slice( filteredCheckins.length - filterNumber, filteredCheckins.length))
    } else {
      setFilteredCheckins(filteredCheckins.filter((checkin: any) => {
        if (filter === '2023') {
          return new Date(checkin.date).getFullYear() === 2023
        } else if (filter === '2022') {
          return new Date(checkin.date).getFullYear() === 2022
        } else {
          return true
        }
      }))
    }

  }, [ filter, checkins ])

  return <>
    <div className="w-full">
      <div className="text-center">
        <div className="stats shadow m-auto mb-8">
          <div className="stat place-items-center">
            <div className="stat-title">Users</div>
            <div className="stat-value py-2 px-4">[4]</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Check ins</div>
            <div className="stat-value py-2 px-4">{amountOfCheckins}</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Overall avg</div>
            <div className="stat-value"><OverallStatus averageRating={ averageRating } /></div>
          </div>
        </div>
      </div>
      { showFilter &&
      <div className="w-full text-center mb-4">
        <div className="btn-group m-auto">
          <input type="radio" checked={ filter === '10' ? true : false } onChange={ () => setFilter('10') } name="options" data-title="Last 10" value="10" className="btn btn-sm" />
          <input type="radio" checked={ filter === '30' ? true : false } onChange={ () => setFilter('30') } name="options" data-title="Last 30" value="30" className="btn btn-sm" />
          <input type="radio" checked={ filter === '90' ? true : false } onChange={ () => setFilter('90') } name="options" data-title="Last 90" value="90" className="btn btn-sm" />
          <input type="radio" checked={ filter === '2023' ? true : false } onChange={ () => setFilter('2023') } name="options" data-title="2023" value="2023" className="btn btn-sm" />
          <input type="radio" checked={ filter === '2022' ? true : false } onChange={ () => setFilter('2022') } name="options" data-title="2022" value="2022" className="btn btn-sm" />
          <input type="radio" checked={ filter === '-1' ? true : false } onChange={ () => setFilter('-1') } name="options" data-title="All" value="-1" className="btn btn-sm" />
        </div>
      </div>
      }
      <ResponsiveContainer width={ '100%' } height={ 400 }>
        <ComposedChart
          width={ 500 }
          height={ 300 }
          data={ filteredCheckins }
          margin={ {
            top: 10,
            right: 20,
            left: 20,
            bottom: 10,
          } }
        >
          <defs>
            <linearGradient id="rating" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="25%" stopColor="#FB923C" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="75%" stopColor="#A3E635" />
              <stop offset="100%" stopColor="#4ADE80" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={ [ '1', '5' ] }>
            <Label
              value={ 'Rating' }
              position="left"
              angle={ -90 }
              style={ { textAnchor: 'middle' } }
            />
          </YAxis>
          <Tooltip content={ <MoodChartTooltip /> } />
          <Legend />
          <Line
            key={ Math.random() }
            type="monotone"
            dataKey="avg"
            name="average rating per date"
            stroke="url(#rating)"
            strokeWidth={ 3 }
            dot={ { strokeWidth: 1, r: 4 } }
            activeDot={ { r: 8, opacity: 0.5 } }
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </>
}

