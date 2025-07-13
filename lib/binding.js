
import addon from '../build/Release/node-blaze.node';

export default class NodeBlaze {
    #addonInstance;

    constructor() {
        this.#addonInstance = new addon.NodeBlaze();
    }

    runBlaze(jsonSchema, jsonAsStr) {
        return this.#addonInstance.runBlaze(jsonSchema, jsonAsStr);
    }
}
