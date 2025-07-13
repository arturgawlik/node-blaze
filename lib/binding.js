
import addon from '../build/Release/node-blaze.node';

export default class NodeBlaze {
    #addonInstance;

    constructor(name) {
        this.#addonInstance = new addon.NodeBlaze(name);
    }

    greet(str) {
        return this.#addonInstance.greet(str);
    }
}
