import '@testing-library/jest-dom/extend-expect';
import 'regenerator-runtime/runtime';

global.Granite = { I18n: { get: (key) => key } };

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});