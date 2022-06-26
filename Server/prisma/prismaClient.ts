import { PrismaClient, Prisma } from '@prisma/client'
const prismaClient = new PrismaClient()

/***********************************/
/* SOFT DELETE MIDDLEWARE */
/***********************************/

prismaClient.$use(async (params, next) => {
  if (params.model == 'User' || params.model == 'Task' || params.model == 'UserRole') {
    // if (!params.args.where['deleted']) {
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      // Change to findFirst - you cannot filter
      // by anything except ID / unique with findUnique
      params.action = 'findFirst'
      // Add 'deleted' filter
      // ID filter maintained
      params.args.where['deleted'] = false
    }
    if (params.action === 'findMany') {
      // Find many queries
      if (params.args.where) {
        if (params.args.where.deleted == undefined) {
          // Exclude deleted records if they have not been explicitly requested
          params.args.where['deleted'] = false
        }
      } else {
        params.args['where'] = { deleted: false }
      }
    }
    // }
  }
  return next(params)
})

// prisma.$use(async (params, next) => {
//   if (params.model == 'User' || params.model == 'Task' || params.model == 'UserRole') {
//     // if (!(params.args.data['deleted'] === false)) {
//     if (params.action == 'update') {
//       // Change to updateMany - you cannot filter
//       // by anything except ID / unique with findUnique
//       params.action = 'updateMany'
//       // Add 'deleted' filter
//       // ID filter maintained
//       params.args.where['deleted'] = false
//     }
//     if (params.action == 'updateMany') {
//       if (params.args.where != undefined) {
//         params.args.where['deleted'] = false
//       } else {
//         params.args['where'] = { deleted: false }
//       }
//     }
//     // }
//   }
//   return next(params)
// })

// prisma.$use(async (params, next) => {
//   // Check incoming query type
//   if (params.model == 'User' || params.model == 'Task' || params.model == 'UserRole') {
//     if (params.action == 'delete') {
//       // Delete queries
//       // Change action to an update
//       params.action = 'update'
//       params.args['data'] = { deleted: true }
//     }
//     if (params.action == 'deleteMany') {
//       // Delete many queries
//       params.action = 'updateMany'
//       if (params.args.data != undefined) {
//         params.args.data['deleted'] = true
//       } else {
//         params.args['data'] = { deleted: true }
//       }
//     }
//   }
//   return next(params)
// })

// определяем какие вложенные объекты будем получать
const userIncludeRole = Prisma.validator<Prisma.UserArgs>()({
  select: { id: true, name: true, email: true, isActivated: true, userRole: { select: { name: true } } },
})

// генерируем тип для User
type UserIncludeRole = Prisma.UserGetPayload<typeof userIncludeRole>

// определяем какие вложенные объекты будем получать
const markerIncludeDictionary = Prisma.validator<Prisma.MarkerArgs>()({
  include: {
    dictionary: true,
  },
})
// генерируем тип для Marker
type MarkersIncludeDictionary = Prisma.MarkerGetPayload<typeof markerIncludeDictionary>

const taskIncludeMarkersIncludeDictionary = Prisma.validator<Prisma.TaskArgs>()({
  include: {
    markers: markerIncludeDictionary,
  },
})
// генерируем тип для task
type TaskIncludeMarkersIncludeDictionary = Prisma.TaskGetPayload<typeof taskIncludeMarkersIncludeDictionary>

// type TaskWithMessages = Prisma.TaskGetPayload<{
//   include: {
//     markers: {
//       include: {
//         dictionary: true;
//       };
//     };
//   };
// }>;

export {
  prismaClient,
  Prisma,
  userIncludeRole,
  UserIncludeRole,
  markerIncludeDictionary,
  MarkersIncludeDictionary,
  taskIncludeMarkersIncludeDictionary,
  TaskIncludeMarkersIncludeDictionary,
}
