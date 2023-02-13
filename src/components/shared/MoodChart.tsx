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
import { getDateString } from '~/utils'

export const MoodChart = () => {
  const [ checkins, setCheckins ] = useState<any>([])
  const [ filteredCheckins, setFilteredCheckins ] = useState<any>([])
  const [ amountOfCheckins, setAmountOfCheckins ] = useState<any>(0)
  const [ averageRating, setAverageRating ] = useState<number>(3)
  const [ filter, setFilter ] = useState<string>('5')
  const [ showFilter, setShowFilter ] = useState<boolean>(checkins && checkins.length > 5)
  const [ startDate, setStartDate ] = useState('')

  const db = getDatabase()

  const getCheckinInitChartData = (checkinsRef: DatabaseReference) => {
    get(checkinsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const checkins = snapshot.val()

        let overallAverage = 0
        let nbOfCheckins = 0

        const chartData = [] as any

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(checkins as object).map(([ uidd, checkin ]) => {
          const graphCheckin = {
            date: '',
            ratings: [ ] as number[],
            notes: [ ] as string[],
            avg: 0,
          }

          overallAverage += parseInt(checkin.rating)
          nbOfCheckins += 1

          graphCheckin.date = new Date(checkin.date).toLocaleDateString()
          graphCheckin.notes.push(checkin.note)
          graphCheckin.ratings.push(parseInt(checkin.rating))

          graphCheckin.avg = graphCheckin.ratings.reduce((a: number, b: number) => a + b, 0) / graphCheckin.ratings.length
          chartData.push(graphCheckin)
        })

        setAverageRating(overallAverage / nbOfCheckins)
        setAmountOfCheckins(nbOfCheckins)
        setShowFilter(nbOfCheckins > 10)

        setCheckins([ ...chartData ].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()))

        setStartDate(getDateString(new Date(chartData[0].date)))
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
    const filtered = [ ...checkins ]

    const filterNumber = parseInt(filter)

    if (filterNumber < 100 && filterNumber > 0) {
      setFilteredCheckins(filtered.filter((checkin: any) => new Date(checkin.date).getTime() >= new Date().getTime() - filterNumber * 24 * 60 * 60 * 1000))
    } else {
      setFilteredCheckins(filtered.filter((checkin: any) => {
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

  const getFilterLabel = (filterNumber: string) => {
    return `Last ${filterNumber} days ${filter === filterNumber ? `(${filteredCheckins.length})` : ''}`
  }

  return <>
    <div className="w-full">
      <div className="text-center">
        <div className="stats shadow m-auto mb-8">
          <div className="stat place-items-center">
            <div className="stat-title">Team</div>
            <div className="stat-value py-2 px-4">Team Wonder</div>
            <div className="stat-desc">9 members</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Check ins</div>
            <div className="stat-value py-2 px-4">{amountOfCheckins}</div>
            <div className="stat-desc">Total checkins since {startDate}</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Overall avg</div>
            <div className="stat-value"><OverallStatus averageRating={ averageRating } /></div>
            <div className="stat-desc">Total average since {startDate}</div>
          </div>
        </div>
      </div>
      { showFilter && <>
        <div className="w-full text-center mb-2">
          <h2>Filter checkins</h2>
        </div>
        <div className="w-full text-center mb-4">
          <div className="btn-group m-auto">
            <input type="radio" checked={ filter === '5' ? true : false } onChange={ () => setFilter('5') } name="options" data-title={ getFilterLabel('5') } value="5" className="btn btn-sm" />
            <input type="radio" checked={ filter === '10' ? true : false } onChange={ () => setFilter('10') } name="options" data-title={ getFilterLabel('10') } value="10" className="btn btn-sm" />
            { checkins.length > 10 && <input type="radio" checked={ filter === '30' ? true : false } onChange={ () => setFilter('30') } name="options" data-title={ getFilterLabel('30') } value="30" className="btn btn-sm" /> }
            { checkins.length >= 60 && <input type="radio" checked={ filter === '60' ? true : false } onChange={ () => setFilter('60') } name="options" data-title={ getFilterLabel('60') } value="60" className="btn btn-sm" /> }
            { checkins.length >= 90 && <input type="radio" checked={ filter === '90' ? true : false } onChange={ () => setFilter('90') } name="options" data-title={ getFilterLabel('90') } value="90" className="btn btn-sm" /> }

            {/* <input type="radio" checked={ filter === '2023' ? true : false } onChange={ () => setFilter('2023') } name="options" data-title="2023" value="2023" className="btn btn-sm" />
            <input type="radio" checked={ filter === '2022' ? true : false } onChange={ () => setFilter('2022') } name="options" data-title="2022" value="2022" className="btn btn-sm" /> */}
            <input type="radio" checked={ filter === '-1' ? true : false } onChange={ () => setFilter('-1') } name="options" data-title={ `All (${checkins.length})` } value="-1" className="btn btn-sm" />
          </div>
        </div>
      </>
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
          <YAxis domain={ [ 1, 5 ] }>
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

