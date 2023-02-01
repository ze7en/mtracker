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

export const getDateString = (dateInput: Date | number) => {
  if (typeof dateInput === 'number') {
    dateInput = new Date(dateInput)
  }

  return `${dateInput.getFullYear()}/${dateInput.getMonth() < 9 ? `0${dateInput.getMonth() + 1}` : dateInput.getMonth() + 1}/${dateInput.getDate() < 9 ? `0${dateInput.getDate()}` : dateInput.getDate()}`
}
