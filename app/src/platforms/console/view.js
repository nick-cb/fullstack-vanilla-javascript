import ViewBase from "../../shared/viewBase.js";
import { LayoutBuilder } from "./layoutBuilder.js";

export default class View extends ViewBase {
  #layoutBuilder;
  #components;
  #data = [];
  #headers = [];
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

  #prepareData(items) {
    if (!items.length) {
      return { headers: [], data: [] };
    }
    this.#headers = Object.keys(items[0]);
    return {
      headers: this.#headers,
      data: items.map((item) => Object.values(item)),
    };
  }

  addRow(item) {
    this.#data.push(item);
    const items = this.#prepareData(this.#data);
    this.#components.table.setData(items);
    this.#components.screen.render();
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
      .setTable({ numColumns: 3 })
      .build();
  }

  render(items) {
    this.#initializeComponentFacade();
    items.forEach((item) => this.addRow(item));
  }
}
