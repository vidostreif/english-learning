import { User } from '../../db/models'

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
    user: User
    files?: { img: File }
  }
}
