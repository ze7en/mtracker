import React from 'react'

export const lazyImport = <
  T extends React.ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I,
>(
    factory: () => Promise<I>,
    name: K,
  ): I => {
  return Object.create({
    [name]: React.lazy(() => factory().then(module => ({ default: module[name] }))),
  })
}

export const getDateString = (dateInput: string | number) => {
  const date = new Date(dateInput)

  return `${date.getFullYear()}/${date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/${date.getDate() < 9 ? `0${date.getDate()}` : date.getDate()}`
}
