// declare module '*.module.css'
// declare module '*.module.scss'

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare interface ITask {
  id: string
  rating: number
  complexity: number
  imgUrl: string
}

declare interface IMarker {
  id: number
  left: number
  top: number
  text: string
}

declare interface IStylesModule {
  readonly [key: string]: string
}
