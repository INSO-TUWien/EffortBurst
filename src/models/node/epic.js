
import {ItemNode} from './itemNode'
import {ItemNodeType} from './itemNodeType'



export class Epic extends ItemNode {
    /**
     * @param {number} id
     * @param {!Epic} [parent]
     */
    constructor(id, parent) {
        super(id, parent || null, [],  []);
        this.name = `#${id}`;
        this.type = ItemNodeType.EPIC;
    }
}