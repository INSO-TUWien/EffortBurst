export class SelectedData {
    /**
     * @param {!Node} rootIssue
     * @param {string} [authorName]
     */
    constructor(rootIssue, authorName){
        /**
         * @type {!Node}
         */
        this.rootIssue = rootIssue;
        /**
         * @type {?string}
         */
        this.authorName = authorName || null;

        /**
         * @type {Node}
         */
        this.centerIssue = null;
    }
}