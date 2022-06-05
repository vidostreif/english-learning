import { User } from '../../db/models'
import UserDto from '../../dtos/userDto'

// declare global {
//   namespace Express {
//     interface Request {
//       user: User
//       files?: Array<File>
//     }
//   }
// }

// declare module 'express-serve-static-core' {
//   interface Request {
//     user: User
//     files?: Array<File>
//   }
// }

declare module 'express' {
  interface Request {
    user: UserDto
    files?: { img: File }
  }
}
