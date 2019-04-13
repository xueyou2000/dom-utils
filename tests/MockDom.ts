jest.mock("../src/Dom");
const dom = require("../src/Dom");
(window as any).pageXOffset = 0;
(window as any).pageYOffset = 0;
dom.getViewportSize.mockImplementation(() => [500, 600]);
dom.getDocumentSize.mockImplementation(() => [500, 600]);
