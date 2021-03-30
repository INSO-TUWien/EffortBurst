

/**
 * @param {!Array<!Node>} issues
 * @param {number} nodeId
 * @return {Node}
 */
export function findIssueWithId(issues, nodeId) {
    let found = null;
    issues.forEach(issueItem => {
        if (issueItem.nodeId === nodeId) {
            found = issueItem;
        } else {
            const childIssue = findIssueWithId(issueItem.children, nodeId);

            if (childIssue) {
                found = childIssue;
            }
        }
    });

    return found;
}

export function readJsonFile() {

}