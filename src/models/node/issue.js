
import {ItemNode} from './itemNode'
import {ItemNodeType} from "./itemNodeType";



export class Issue extends ItemNode {
    /**
     * @param {number} id
     * @param {!Epic} [parent] can be a project or another Epic
     */
    constructor(id, parent) {
        super(id, parent || null, [],  []);
        this.name = `#${id}`;
        this.type = ItemNodeType.ISSUE;
    }
}