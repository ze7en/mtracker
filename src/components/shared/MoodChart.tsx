import { get, ref, getDatabase } from 'firebase/database'
import { useEffect, useState } from 'react'
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer } from 'recharts'
import { MoodChartTooltip } from './MoodChartTooltip'
import { OverallStatus } from './OverallMoodStatus'


const baseData = [
  {
    date: '2022/01/01',
    ratings: [ 5, 3, 1, 2 ],
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

export const MoodChart = () => {
  const [ checkins, setCheckins ] = useState<any>(baseData)
  const [ averageRating, setAverageRating ] = useState<number>(3)
  const db = getDatabase()

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

        let overallAverage = 0

        const chartData = Object.entries(groupedData as object).map(([ key, value ]) => {
          const avg = value.reduce((a: any, b: any) => parseInt(a) + parseInt(b.rating), 0) / value.length

          overallAverage += avg

          return {
            date: key,
            ratings: [ value.map((v: any) => v.rating) ],
            notes: [ value.map((v: any) => v.note) ],
            avg: avg.toFixed(1),
          }
        })

        setAverageRating(overallAverage / chartData.length)

        setCheckins([ ...baseData, ...chartData ])
      } else {
        console.log(':: no data available')
      }
    }).catch((error) => {
      console.log(':: error get mood data', error)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ])

  return <>
    <div className="w-full" style={ { height: 400 } }>
      <div className="w-full text-center mb-8">
        <div className="btn-group m-auto">
          <input type="radio" onChange={ () => console.log('7 days') } name="options" data-title="7 days" value="1" className="btn" />
          <input type="radio" onChange={ () => console.log('2023') } name="options" data-title="2023" value="2023" className="btn" />
          <input type="radio" onChange={ () => console.log('2022') } name="options" data-title="2022" value="2022" className="btn" />
          <input type="radio" onChange={ () => console.log('All') } name="options" data-title="All" value="-1" className="btn" />
        </div>
      </div>
      <OverallStatus averageRating={ averageRating } />
      <ResponsiveContainer>
        <ComposedChart
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
          <Tooltip content={ <MoodChartTooltip /> } />
          <Legend />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#1A8763"
            activeDot={ { r: 8 } }
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </>
}

