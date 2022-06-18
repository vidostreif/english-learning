// declare module '*.module.css'
// declare module '*.module.scss'

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare interface IStylesModule {
  readonly [key: string]: string
}

interface IErrorMessage {
  message: string
}

declare interface ITask {
  id: number
  rating: number
  complexity: number
  imgUrl: string
}

declare interface IMarker {
  id?: number
  left: number
  top: number
  text: string
}

declare interface IMarkerForGame extends IMarker {
  id: number
  used: boolean
  choiced: boolean
}

declare interface ITaskFromServer extends ITask {
  markers: Array<{
    left: number
    top: number
    dictionary: { name: string }
  }>
}

declare interface ITaskRating {
  rating: number
  taskId: number
  userId: number
}

declare interface IUser {
  id: number
  name: string
  email: string
  isActivated: boolean
  userRole: string
}
