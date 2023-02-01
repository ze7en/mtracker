import { ChangeEvent } from 'react'

type StarRateProps = {
  rating: string
  onRating: (rating: string) => void
}

export const StarRate = ({ rating, onRating }: StarRateProps) => {
  return (
    <div className="btn-group">
      <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => onRating(e.target.value) } name="options" data-title="1" value="1" checked={ rating === '1' ? true : false } className="btn mask mask-star-2 opacity-30 bg-red-400 checked:!bg-red-400 checked:opacity-100 checked:!text-white" />
      <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => onRating(e.target.value) } name="options" data-title="2" value="2" checked={ rating === '2' ? true : false } className="btn mask mask-star-2 opacity-30 bg-orange-400 checked:!bg-orange-400 checked:opacity-100 checked:!text-white" />
      <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => onRating(e.target.value) } name="options" data-title="3" value="3" checked={ rating === '3' ? true : false } className="btn mask mask-star-2 opacity-30 bg-yellow-400 checked:!bg-yellow-400 checked:opacity-100 checked:!text-white" />
      <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => onRating(e.target.value) } name="options" data-title="4" value="4" checked={ rating === '4' ? true : false } className="btn mask mask-star-2 opacity-30 bg-lime-400 checked:!bg-lime-400 checked:opacity-100 checked:!text-white" />
      <input type="radio" onChange={ (e: ChangeEvent<HTMLInputElement>) => onRating(e.target.value) } name="options" data-title="5" value="5" checked={ rating === '5' ? true : false } className="btn mask mask-star-2 opacity-30 bg-green-400 checked:!bg-green-400 checked:opacity-100 checked:!text-white" />
    </div>
  )
}
