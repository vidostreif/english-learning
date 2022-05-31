interface ISubs {
  [key: string]: [
    {
      subscriber: any
      handler: any
    }
  ]
}

const subs: ISubs = {} //объект отвечающий за события

// Сервис подписок и оповещений о событиях
export default class EventService {
  static on = function (event: string, subscriber: any, handler: any) {
    //подписка пользователя на событие
    if (!subs.hasOwnProperty(event)) {
      //проверка наличия события
      subs[event] = [
        {
          subscriber: subscriber,
          handler: handler.bind(subscriber),
        },
      ] //если событие несуществует, создаем соответсвующее свойство объекта
    } else {
      subs[event].push({
        subscriber: subscriber,
        handler: handler.bind(subscriber),
      })
    }
  }

  static off = function (event: string, subscriber: any) {
    //удаление пользователя и функции события
    if (subs.hasOwnProperty(event)) {
      for (let i = subs[event].length - 1; i >= subs[event].length; --i) {
        if (subs[event][i].subscriber === subscriber) {
          subs[event].splice(i, 1)
        }
      }
    }
  }

  static emit = function (event: string) {
    //оповещение, задействоание фукнции события
    if (subs[event] !== undefined) {
      for (let i = 0; i < subs[event].length; i++) {
        subs[event][i].handler()
      }
    }
  }
}
