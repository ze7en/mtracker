type TooltipProps = {
  active?: boolean;
  payload?: any;
  label?: string;
}

export const MoodChartTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded border border-gray-500 p-2">
        <p className="font-semibold">{label}</p>
        <p>Average rating: {payload[0].value}</p>
        <p>All ratings: {payload[0].payload.ratings?.toString()}</p>
        <ul>
          <li key="0">All notes:</li>
          {payload[0].payload.notes?.map((note: any, index: number) => note?.length > 0 && <li className="block mt-1" key={ index+1 }>{`"${note}"`}</li>)}
        </ul>
      </div>
    )
  }

  return null
}
