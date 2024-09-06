/**
 * @typedef {import('./viewBase.js').default} View
*/
export default class Controller {
  /** @type {View} */
  #view

  /** @param {{view: View}} deps */
  constructor({view}) {
    this.#view = view;
  }

  static init(deps) {
    const controller = new Controller(deps);
    controller.#init();
    return controller;
  }

  #init() {
    const initData = [
      {name: 'Nick', age: 24, email: 'nick@gmail.com'}
    ]
    this.#view.render(initData);
  }
}
