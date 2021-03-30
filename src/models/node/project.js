
import {ItemNode} from './itemNode'
import {ItemNodeType} from "./itemNodeType";



export class Project extends ItemNode {
    /**
     * @param {number} id
     * @param {string} projectName
     */
    constructor(id, projectName) {
        super(id, null, [],  []);
        this.name = projectName;
        this.type = ItemNodeType.PROJECT;
        this.commits = [];
    }
}