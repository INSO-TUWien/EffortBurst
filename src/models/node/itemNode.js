
import {ItemNodeType} from './itemNodeType'



export class ItemNode {
    /**
     * @param {number} id
     * @param {ItemNode} parent
     * @param {!Array<!LoggedHours>} loggedHours
     * @param {!Array<!ItemNode>} children
     */
    constructor(id, parent, loggedHours = [], children = []) {
        /**
         * @type {number}
         */
        this.nodeId = id;
        /**
         * @type {ItemNode}
         */
        this.parentNode = parent;
        /**
         * @type {string}
         */
        this.name = id.toString();
        /**
         * @type {string}
         */
        this.type = ItemNodeType.ISSUE;

        /**
         * @type {!Array<!LoggedHours>}
         */
        this.loggedHours = loggedHours;

        /**
         * @type {!Array<!ItemNode>}
         */
        this.children = children;

        /**
         * @type {!Array<!Commit>}
         */
        this.commits = [];

        /**
         * @type {!Array<!Commit>}
         */
        this.commitsIncludingChildren = [];

        /**
         * @type {!Array<string>}
         */
        this.allFilesTouched = [];

        /**
         * @type {number}
         */
        this.loggedHoursSum = 0;

        /**
         * @type {number}
         */
        this.loggedHoursSumWithChilds = 0;

        /**
         * @type {number}
         */
        this.commitsReferenced = 0;

        /**
         * @type {number}
         */
        this.commitsReferencedIncludeChildren = 0;

        /**
         * @type {number}
         */
        this.linesAdded = 0;

        /**
         * @type {number}
         */
        this.linesAddedIncludeChildren = 0;

        /**
         * @type {number}
         */
        this.linesDeleted = 0;

        /**
         * @type {number}
         */
        this.linesDeletedIncludeChildren = 0;

        this.filesChangedIncludeChildren = 0;
    }

    /**
     * @param {ItemNode} parent
     */
    setParent(parent) {
        this.parentNodeId = parent ? parent.nodeId : null;
    }

    /**
     * @param {!Commit} commit
     */
    setCommit(commit) {
        this.commits.push(commit);
        this.linesAdded += commit.linesAdded;
        this.linesDeleted += commit.linesDeleted;
        this.commitsReferenced ++;
    }
}
