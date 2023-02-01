import { ChangeEvent, useEffect, useState } from 'react'
import { uid } from 'uid'
import { set, ref, getDatabase, get, update } from 'firebase/database'
import { getDateString } from '~/utils'
import { useNavigate } from 'react-router-dom'
import { StarRate } from './StarRate'

type CheckInProps = {
  state: any,
}

interface UpdateType {
  [key: string]: object;
}

export const CheckInForm = ({ state }: CheckInProps) => {
  const [ rating, setRating ] = useState('3')
  const [ date, setDate ] = useState(new Date(Date.now()))
  const [ user, setUser ] = useState()
  const [ note, setNote ] = useState('')
  const [ uidd, setUidd ] = useState()

  const db = getDatabase()
  const navigate = useNavigate()

  // const createTestData = () => {
  //   for (let days = 1; days <= 100; days++) {
  //     const date = new Date(Date.now() - days*24*60*60*1000)
  //     const uidd = uid()

  //     set(ref(db, `checkins/${getDateString(date)}/${state.currentUser.uid}`), {
  //       rating: Math.floor(Math.random() * 5) + 1,
  //       note,
  //       date: new Date(date).toString(),
  //       user: {
  //         displayName: state.currentUser.displayName,
  //         photoURL: state.currentUser.photoURL,
  //       },
  //       uidd,
  //     }).then(() => {
  //       navigate('/')
  //     }).catch((error) => {
  //       console.log('error set', error)
  //     })
  //   }
  // }

  useEffect(() => {
    if (state.state === 'SIGNED_IN') {
      get(ref(db, `checkins/${getDateString(date)}/${state.currentUser.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()

          setDate(date)
          setRating(data.rating)
          setNote(data.note)
          setUidd(data.uidd)
          setUser(data.user)

        } else {
          console.log(':: no data available')
        }
      })
    }
  }, [])

  const handleSubmitMood = () => {
    if (state.state === 'SIGNED_IN') {
      if (uidd) {
        const updates: UpdateType = {}

        updates[`checkins/${getDateString(date)}/${state.currentUser.uid}/`] = {
          rating,
          note,
          date: new Date(Date.now()).toString(),
          user,
          uidd,
        }

        update(ref(db), updates).then(() => {
          navigate('/')
        }).catch((error) => {
          console.log('error update', error)
        })
      } else {
        set(ref(db, `checkins/${getDateString(date)}/${state.currentUser.uid}`), {
          rating,
          note,
          date: new Date(date).toString(),
          user: {
            displayName: state.currentUser.displayName,
            photoURL: state.currentUser.photoURL,
          },
          uidd: uid(),
        }).then(() => {
          navigate('/')
        }).catch((error) => {
          console.log('error set', error)
        })
      }
    }
  }

  const handleRating = (rating: string) => {
    setRating(rating)
  }

  return <>
    <div className="grid gap-2">
      <StarRate rating={ rating } onRating={ handleRating } />
      <textarea value={ note } onChange={ (e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value) } className="w-full p-2 border border-gray-300 rounded" />
      <button onClick={ handleSubmitMood } className="btn btn-primary btn-md">Check in</button>
    </div>
  </>
}
