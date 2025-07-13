
const addon = require('../build/Release/node-blaze');

// TODO: rewrite to es class syntax
function NodeBlaze(name) {
    this.greet = function (str) {
        return _addonInstance.greet(str);
    }

    const _addonInstance = new addon.NodeBlaze(name);
}



module.exports = NodeBlaze;
