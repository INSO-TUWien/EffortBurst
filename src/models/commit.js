import _ from "lodash";

export class Commit {
    /**
     * @param {number} id
     * @param {!ItemNode} node Related issue tracker node (issue or sub-task)
     * @param {!Project} project
     * @param {string} authorName
     * @param {?number} linesAdded
     * @param {?number} linesDeleted
     */
    constructor(id, node, project,authorName, linesAdded = _.random(0, 1000), linesDeleted = _.random(0, 1000)) {
        /**
         * @type {number}
         */
        this.commitId = id;
        /**
         * @type {!ItemNode}
         */
        this.node = node;
        /**
         * @type {!Project}
         */
        this.project = project;
        /**
         * @type {number}
         */
        this.linesAdded = linesAdded;
        /**
         * @type {number}
         */
        this.linesDeleted = linesAdded + linesDeleted ? linesDeleted : 1; // Ensure one change.
        /**
         * @type {string}
         */
        this.authorName = authorName;

        /**
         * @type {!Array<string>}
         */
        this.files = [];

        /**
         * @type {string}
         */
        this.message = ''

        /**
         * @type {boolean}
         */
        this.build = true;
    }
}
