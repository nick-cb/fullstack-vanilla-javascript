import { describe, it, mock } from "node:test";
import Controller from "../src/shared/controller.js";
import ViewBase from "../src/shared/viewBase.js";
import assert from "node:assert";

function generateView() {
  class View extends ViewBase {
    render = mock.fn();
    addRow = mock.fn();
    configureFormClear = mock.fn();
    notify = mock.fn();
    resetForm = mock.fn();
    configureFormSubmit = mock.fn();
  }

  return new View();
}

describe("Controller unit test", () => {
  it("#init", () => {
    const view = generateView();
    Controller.init({
      view,
    });

    assert.strictEqual(view.configureFormSubmit.mock.callCount(), 1);
    assert.strictEqual(view.configureFormClear.mock.callCount(), 1);
    const renderMock = view.render.mock;
    assert.strictEqual(renderMock.callCount(), 1);
    const initData = [{ name: "Nick", age: 24, email: "nick@gmail.com" }];
    assert.deepStrictEqual(renderMock.calls[0].arguments[0], initData);
  });
});
