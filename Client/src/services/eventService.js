const subs = {} //объект отвечающий за события

// Сервис подписок и оповещений о событиях
export default class EventService {
  static on = function (event, subscriber, handler) {
    //подписка пользователя на событие
    if (!subs.hasOwnProperty(event)) {
      //проверка наличия события
      subs[event] = [] //если событие несуществует, создаем соответсвующее свойство объекта
    }
    subs[event].push({
      subscriber: subscriber,
      handler: handler.bind(subscriber),
    })
  }

  static off = function (event, subscriber) {
    //удаление пользователя и функции события
    if (subs.hasOwnProperty(event)) {
      for (let i = subs[event].length - 1; i >= subs[event].length; --i) {
        if (subs[event][i].subscriber === subscriber) {
          subs[event].splice(i, 1)
        }
      }
    }
  }

  static emit = function (event) {
    //оповещение, задействоание фукнции события
    if (subs[event] !== undefined) {
      for (let i = 0; i < subs[event].length; i++) {
        subs[event][i].handler()
      }
    }
  }
}
