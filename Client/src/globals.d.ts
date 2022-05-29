// declare module '*.module.css'
// declare module '*.module.scss'

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare type Task = {
  id: string
  rating: number
  complexity: number
  imgUrl: string
}

declare type StylesModule = {
  readonly [key: string]: string
}
