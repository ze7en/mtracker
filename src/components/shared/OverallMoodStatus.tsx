import { useEffect, useState } from 'react'

type OverallStatusProps = {
  averageRating: number;
}

export const OverallStatus = ({ averageRating }: OverallStatusProps) => {
  const [ bg, setBg ] = useState('')

  useEffect(() => {
    let bg = ''

    switch (averageRating.toFixed(0)) {
      case '1':
        bg = 'bg-red-400'
        break
      case '2':
        bg = 'bg-orange-400'
        break
      case '3':
        bg = 'bg-yellow-400'
        break
      case '4':
        bg = 'bg-lime-400'
        break
      case '5':
        bg = 'bg-green-400'
        break
    }

    setBg(bg)

  }, [ averageRating ])

  return (
    <div className={ `w-full py-1 px-4 text-white rounded-md text-center ${bg}` }>
      <p className="font-semibold">{averageRating.toFixed(1)}</p>
    </div>
  )
}
