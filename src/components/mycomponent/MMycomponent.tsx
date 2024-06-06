import React from 'react'
import './mycomponent.less'

export interface MMycomponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The age of the person
   */
  age: number
  /**
   * The name of the person
   */
  name: string
}
export const MMycomponent = (props: MMycomponentProps) => {
  return (
    <div>
      MMycomponent Demo {props.name} - {props.age}
    </div>
  )
}
