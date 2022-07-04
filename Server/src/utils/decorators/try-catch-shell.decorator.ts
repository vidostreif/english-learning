// оболочка для выполнения кода в контроллерах
// export function tryShell(
//   target: Object,
//   propertyKey: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): TypedPropertyDescriptor<any> {
//   // Запоминаем исходную функцию
//   var originalMethod = descriptor.value;
//   // Подменяем ее на нашу обертку
//   descriptor.value = async function tryShellWrapper() {
//     try {
//       // Вызываем исходный метод
//       await originalMethod.apply(this, arguments);
//     } catch (error) {
//       for (const argument of arguments) {
//         if (argument.name === 'next') {
//           if (error instanceof ApiError) {
//             return argument(error);
//           }
//           return argument(ApiError.badRequest(error.message));
//         }
//       }
//       console.log('Не нашли функцию next для возврата ошибки');
//     }
//   };
//   // Обновляем дескриптор
//   return descriptor;
// }

import { HttpException, HttpStatus } from '@nestjs/common';

export const TryCatchWrapper = (
  target,
  key: string,
  descriptor: TypedPropertyDescriptor<any>,
) => {
  const fn = descriptor.value;
  descriptor.value = async (...args: any) => {
    try {
      await fn.apply(this, args);
    } catch (error) {
      console.dir(error.stack);

      throw new HttpException(error.stack, HttpStatus.BAD_REQUEST);
    }
  };
};
