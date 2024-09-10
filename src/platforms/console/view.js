import ViewBase from "../../shared/viewBase.js";
import { LayoutBuilder } from "./layoutBuilder.js";

export default class View extends ViewBase {
  #layoutBuilder;
  #components;
  #onFormSubmit = () => {};
  #onFormClear = () => {};

  constructor(layoutBuilder = new LayoutBuilder()) {
    super();

    this.#layoutBuilder = layoutBuilder;
  }

  configureFormSubmit(fn) {
    this.#onFormSubmit = (data) => {
      return fn(data);
    };
  }

  notify({ msg, isError }) {
    this.#components.alert.setMessage(msg);
  }

  resetForm() {
    this.#components.form.reset();
    this.#components.screen.render();
  }

  configureFormClear() {
    this.#onFormClear = () => {
      this.resetForm();
    };
  }

  #initializeComponentFacade() {
    this.#components = this.#layoutBuilder
      .setScreen({ title: "Fullstack vanilla js" })
      .setLayout()
      .setFormComponent({
        onClear: this.#onFormClear.bind(this),
        onSubmit: this.#onFormSubmit.bind(this),
      })
      .setAlertComponent()
      .build();
  }

  render(items) {
    this.#initializeComponentFacade();
  }
}
