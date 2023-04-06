// ==UserScript==
// @name chatgpt-infinite
// @namespace https://github.com/mefengl
// @version 0.3.5
// @description Infinite auto ask for chatgpt
// @author mefengl
// @match https://chat.openai.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant none
// @license MIT
// ==/UserScript==
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/askForLanguage/index.ts
  function askForLanguage() {
    return __async(this, null, function* () {
      return prompt("What language do you want to use?");
    });
  }

  // ../../packages/chatkit/dist/index.mjs
  function getTextarea() {
    const form = document.querySelector("form");
    if (!form)
      return;
    const textareas = form.querySelectorAll("textarea");
    const result = textareas[0];
    return result;
  }
  function getSubmitButton() {
    const form = document.querySelector("form");
    if (!form)
      return;
    const buttons = form.querySelectorAll("button");
    const result = buttons[buttons.length - 1];
    return result;
  }
  function getRegenerateButton() {
    const form = document.querySelector("form");
    if (!form)
      return;
    const buttons = form.querySelectorAll("button");
    const result = Array.from(buttons).find((button) => {
      var _a;
      return (_a = button.textContent) == null ? void 0 : _a.trim().toLowerCase().includes("regenerate");
    });
    return result;
  }
  function getStopGeneratingButton() {
    const form = document.querySelector("form");
    if (!form)
      return;
    const buttons = form.querySelectorAll("button");
    const result = Array.from(buttons).find((button) => {
      var _a;
      return (_a = button.textContent) == null ? void 0 : _a.trim().toLowerCase().includes("stop generating");
    });
    return result;
  }
  function getLastResponseElement() {
    const responseElements = document.querySelectorAll(".group.w-full");
    return responseElements[responseElements.length - 1];
  }
  function getLastResponse() {
    const lastResponseElement = getLastResponseElement();
    if (!lastResponseElement)
      return;
    const lastResponse = lastResponseElement.textContent;
    return lastResponse;
  }
  function getTextareaValue() {
    var _a;
    return ((_a = chatkit.getTextarea()) == null ? void 0 : _a.value) || "";
  }
  function setTextarea(message) {
    const textarea = getTextarea();
    if (!textarea)
      return;
    textarea.value = message;
    textarea.dispatchEvent(new Event("input"));
  }
  function send(message) {
    setTextarea(message);
    const textarea = getTextarea();
    if (!textarea)
      return;
    textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  }
  function waitForIdle() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!getStopGeneratingButton()) {
          clearInterval(interval);
          resolve();
        }
      }, 1e3);
    });
  }
  var chatkit = {
    getTextarea,
    getSubmitButton,
    getRegenerateButton,
    getStopGeneratingButton,
    getLastResponseElement,
    getLastResponse,
    getTextareaValue,
    setTextarea,
    send,
    waitForIdle
  };
  var src_default = chatkit;

  // src/infiniteLoop/index.ts
  function startInfiniteLoop() {
    return __async(this, null, function* () {
      const language = yield askForLanguage();
      if (!language)
        return;
      src_default.send(`you can only answer question in ${language} language`);
      yield src_default.waitForIdle();
      while (true) {
        const lastResponse = src_default.getLastResponse();
        const question = extractQuestion(lastResponse);
        yield src_default.send(question + "\nanswer above question, and show me one more further question I can ask in the end prefixed with Q:");
        yield src_default.waitForIdle();
        yield sleep(1e4);
      }
    });
  }
  function extractQuestion(text) {
    return text.split("Q:").pop().trim();
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  var infiniteLoop_default = startInfiniteLoop;

  // src/index.ts
  function initialize() {
    return __async(this, null, function* () {
      yield new Promise((resolve) => window.addEventListener("load", resolve));
      yield new Promise((resolve) => setTimeout(resolve, 1e3));
    });
  }
  function main() {
    return __async(this, null, function* () {
      yield initialize();
      infiniteLoop_default();
    });
  }
  (function() {
    main();
  })();
})();
