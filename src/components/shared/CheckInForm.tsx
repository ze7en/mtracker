import { ChangeEvent, useEffect, useState } from 'react'
import { uid } from 'uid'
import { set, ref, getDatabase, get, update } from 'firebase/database'
import { useNavigate } from 'react-router-dom'
import { StarRate } from './StarRate'
import { getDateString } from '~/utils'

type CheckInProps = {
  state: any,
}

interface UpdateType {
  [key: string]: object;
}


export const CheckInForm = ({ state }: CheckInProps) => {
  const [ rating, setRating ] = useState('3')
  const [ date, setDate ] = useState(new Date(Date.now()))
  const [ teamId, setTeamId ] = useState('7dafec46e22') // TODO: get teamId
  const [ note, setNote ] = useState('')
  const [ uidd, setUidd ] = useState('')
  const [ userId, setUserId ] = useState('')

  const db = getDatabase()
  const navigate = useNavigate()

  useEffect(() => {
    if (state.state === 'SIGNED_IN') {
      const currentUserId = state.currentUser.uid

      setUserId(currentUserId)

      get(ref(db, import.meta.env.VITE_FIREBASE_CHECKINS_PATH)).then((snapshot) => {
        if (snapshot.exists()) {
          const checkins = snapshot.val()

          Object.entries(checkins as object).map(([ key, checkin ]) => {
            if (checkin.userId === currentUserId && getDateString(date) === getDateString(new Date(checkin.date))) {
              setDate(date)
              setRating(checkin.rating)
              setNote(checkin.note)
              setTeamId(checkin.teamId)

              setUidd(key)
            }
          })

        } else {
          console.log(':: no data available')
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ])

  const handleSubmitMood = () => {
    if (state.state === 'SIGNED_IN') {

      if (uidd) {
        const updates: UpdateType = {}

        updates[`${import.meta.env.VITE_FIREBASE_CHECKINS_PATH}${uidd}/`] = {
          date: new Date(Date.now()).toString(),
          note,
          rating,
          teamId,
          userId,
        }

        update(ref(db), updates).then(() => {
          navigate('/overview')
        }).catch((error) => {
          console.log('error update', error)
        })
      } else {
        const newUidd = uid()
        setUidd(newUidd)

        set(ref(db, `${import.meta.env.VITE_FIREBASE_CHECKINS_PATH}/${newUidd}`), {
          date: new Date(date).toString(),
          note,
          rating,
          teamId,
          userId,
        }).then(() => {
          navigate('/overview')
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
      <button onClick={ handleSubmitMood } className="btn btn-primary btn-md">{uidd ? 'Check in (update)' : 'Check in'}</button>
    </div>
  </>
}
