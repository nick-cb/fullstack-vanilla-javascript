import { describe, it, before } from "node:test";
import Controller from "../src/shared/controller.js";
import View from "../src/platforms/web/view.js";

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
    _controller = Controller.init({
      view: new View(),
    });

    document.querySelector.mock;
  });
});
