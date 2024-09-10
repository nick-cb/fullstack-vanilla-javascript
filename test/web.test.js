import { describe, it } from "node:test";
import Controller from "../src/shared/controller.js";
import View from "../src/platforms/web/view.js";
import assert from "node:assert";

/**
 * @typedef {import('node:test').TestContext} TestContext
 * @param {TestContext['mock']} mock
 */
function getDocument(mock) {
  globalThis.alert = mock.fn(() => {});
  globalThis.document = {
    createElement: mock.fn((name) => {
      return {
        classList: {
          add: mock.fn((name) => {}),
        },
      };
    }),
    querySelector: mock.fn((id) => {
      return {
        value: "test",
        appendChild: mock.fn((child) => {}),
        reset: mock.fn(() => {}),
        addEventListener: mock.fn((event, fn) => {
          return fn({
            preventDefault: () => {},
          });
        }),
      };
    }),
  };

  return globalThis.document;
}

describe("web app test suite", () => {
  let _controller;

  it("given valid input, should update the table", async (context) => {
    const mock = context.mock;
    const document = getDocument(mock);
    const view = new View();

    const addRow = context.mock.method(view, view.addRow.name);
    _controller = Controller.init({ view });

    const [name, age, email, tableBody, form, btnFormClear] =
      document.querySelector.mock.calls;

    assert.strictEqual(name.arguments[0], "#name");
    assert.strictEqual(age.arguments[0], "#age");
    assert.strictEqual(email.arguments[0], "#email");
    assert.strictEqual(tableBody.arguments[0], ".flex-table");
    assert.strictEqual(form.arguments[0], "#form");
    assert.strictEqual(btnFormClear.arguments[0], "#btnFormClear");

    const onSubmit = form.result.addEventListener.mock.calls[0].arguments[1];
    const preventDefaultSpy = context.mock.fn(() => {});
    assert.strictEqual(addRow.mock.callCount(), 2);

    onSubmit.apply(view, [
      {
        preventDefault: preventDefaultSpy,
      },
    ]);
    assert.strictEqual(addRow.mock.callCount(), 3);

    assert.deepStrictEqual(addRow.mock.calls.at(2).arguments.at(0), {
      name: "test",
      age: "test",
      email: "test",
    });
  });
});
