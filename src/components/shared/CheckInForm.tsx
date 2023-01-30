import { ChangeEvent, useState } from 'react'
import { uid } from 'uid'
import { set, ref, getDatabase } from 'firebase/database'
import { getDateString } from '~/utils'
import { useNavigate } from 'react-router-dom'

type CheckInProps = {
  state: any,
}

export const CheckInForm = ({ state }: CheckInProps) => {
  const [ rating, setRating ] = useState('3')
  const [ note, setNote ] = useState('')
  const db = getDatabase()
  const navigate = useNavigate()

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
        navigate('/')
      }).catch((error) => {
        console.log('error set', error)
      })
    }
  }

  return <>
    <div className="grid gap-2">
      <div className="btn-group">
        <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => setRating(e.target.value) } name="options" data-title="1" value="1" className="btn mask mask-star-2 opacity-30 bg-red-400 checked:!bg-red-400 checked:opacity-100 checked:!text-white" />
        <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => setRating(e.target.value) } name="options" data-title="2" value="2" className="btn mask mask-star-2 opacity-30 bg-orange-400 checked:!bg-orange-400 checked:opacity-100 checked:!text-white" />
        <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => setRating(e.target.value) } name="options" data-title="3" value="3" className="btn mask mask-star-2 opacity-30 bg-yellow-400 checked:!bg-yellow-400 checked:opacity-100 checked:!text-white" />
        <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => setRating(e.target.value) } name="options" data-title="4" value="4" className="btn mask mask-star-2 opacity-30 bg-lime-400 checked:!bg-lime-400 checked:opacity-100 checked:!text-white" />
        <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => setRating(e.target.value) } name="options" data-title="5" value="5" className="btn mask mask-star-2 opacity-30 bg-green-400 checked:!bg-green-400 checked:opacity-100 checked:!text-white" />
      </div>
      <textarea value={ note } onChange={ (e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value) } className="w-full p-2 border border-gray-300 rounded" />
      <button onClick={ handleSubmitMood } className="btn btn-primary btn-md">Check in</button>
    </div>
  </>
}
