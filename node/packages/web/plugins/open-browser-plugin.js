const openBrowser = require('react-dev-utils/openBrowser');

class OpenBrowserPlugin {
  constructor() {
    this.isOpen = false;
  }

  apply(compiler) {
    compiler.hooks.done.tap('Open Browser Plugin', () => {
      if (!this.isOpen) {
        openBrowser('http://localhost:3000');
        this.isOpen = true;
      }
    });
  }
}

module.exports = OpenBrowserPlugin;
