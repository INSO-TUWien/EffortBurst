
import {ItemNode} from './itemNode'
import {ItemNodeType} from "./itemNodeType";



export class SubTask extends ItemNode {
    /**
     * @param {number} id
     * @param {!Issue} parent can be a project or another Epic
     */
    constructor(id, parent) {
        super(id, parent, [],  []);
        this.name = `#${id}`;
        this.type = ItemNodeType.SUB_TASK;
    }
}