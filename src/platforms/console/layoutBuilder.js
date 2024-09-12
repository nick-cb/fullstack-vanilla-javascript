import blessed from "blessed";
import contrib from "blessed-contrib";

export class LayoutBuilder {
  /** @type blessed.Widgets.Screen */
  #screen;
  #layout;
  #form;
  #input = {};
  #buttons = {};
  #alert;
  #table;

  setScreen({ title }) {
    this.#screen = blessed.screen({
      smartCSR: true,
      title: title,
    });

    this.#screen.key(["escape", "q", "C-c"], () => process.exit(0));

    return this;
  }

  setLayout() {
    this.#layout = blessed.layout({
      parent: this.#screen,
      width: "100%",
      height: "100%",
    });

    return this;
  }

  #createInputField({ parent, name, top, label }) {
    const input = blessed.textbox({
      parent,
      name,
      top,
      label,
      inputOnFocus: true,
      left: "center",
      width: "60%",
      height: "20%",
      border: { type: "line" },
      styles: { fg: "white", bg: "blue", focus: { bg: "lightblue" } },
    });

    return input;
  }

  #createButton({ parent, name, content, bg, fg, left, bottom }) {
    return blessed.button({
      parent,
      name,
      left,
      bottom,
      content,
      mouse: true,
      keys: true,
      shrink: true,
      padding: { left: 1, right: 1 },
      width: "shrink",
      style: { bg, fg, focus: `light${bg}`, hover: `light${bg}` },
    });
  }

  setFormComponent({ onSubmit, onClear }) {
    const form = blessed.form({
      parent: this.#layout,
      keys: true,
      vi: true,
      width: "100%",
      height: "40%",
      top: 0,
      left: "center",
      label: "Users form",
      border: { type: "line" },
      style: { fg: "white", bg: "black" },
    });

    const nameInput = this.#createInputField({
      parent: form,
      name: "name",
      top: 1,
      label: "Name:",
    });
    nameInput.focus();
    const ageInput = this.#createInputField({
      parent: form,
      name: "age",
      top: 4,
      label: "Age:",
    });
    const emailInput = this.#createInputField({
      parent: form,
      name: "email",
      top: 7,
      label: "Email:",
    });
    const submitBtn = this.#createButton({
      parent: form,
      name: "submit",
      content: "Submit",
      bottom: 1,
      bg: "green",
      fg: "black",
      left: "46%",
    });
    submitBtn.on("press", () => form.submit());
    form.on("submit", (data) => {
      onSubmit(data);
    });
    const clearBtn = this.#createButton({
      parent: form,
      name: "clear",
      content: "Clear",
      bottom: 1,
      bg: "red",
      fg: "black",
      left: "52%",
    });
    clearBtn.on("press", () => onClear());

    this.#form = form;
    this.#input.name = nameInput;
    this.#input.age = ageInput;
    this.#input.email = emailInput;

    this.#buttons.submit = submitBtn;
    this.#buttons.clear = clearBtn;

    return this;
  }

  setAlertComponent() {
    this.#alert = blessed.box({
      parent: this.#form,
      width: "40%",
      height: "20%",
      bottom: 0,
      border: { type: "line" },
      style: { bg: "red", fg: "black" },
      content: "",
      tags: true,
      align: "center",
      hidden: true,
    });

    this.#alert.setMessage = (msg) => {
      this.#alert.setContent(`{bold}${msg}{/bold}`);
      this.#alert.show();
      this.#screen.render();

      setTimeout(() => {
        this.#alert.hide();
        this.#screen.render();
      }, 3000);
    };

    return this;
  }

  setTable({ numColumns }) {
    const columnWidth = Math.round(this.#layout.width / numColumns);
    const minColumnWidth = 10;
    const columnnWidths = Array(numColumns)
      .fill(columnWidth)
      .map((width) => Math.max(width, minColumnWidth));

    this.#table = contrib.table({
      parent: this.#layout,
      mouse: true,
      scrollbar: { ch: "", inverse: true },
      tags: true,
      keys: true,
      fg: "white",
      selectBg: "blue",
      interactive: true,
      label: "Users",
      width: "100%",
      height: "50%",
      top: 0,
      left: 0,
      border: { type: "line", fg: "cyan" },
      columnSpacing: 2,
      columnWidth: columnnWidths,
    });

    return this;
  }

  build() {
    const components = {
      screen: this.#screen,
      layout: this.#layout,
      form: this.#form,
      alert: this.#alert,
      table: this.#table,
    };
    components.screen.render();

    return components;
  }
}
