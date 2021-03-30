/**
 * @enum
 * @type {{BUILT_COMMITS_PER_COMMITS: string, LINES_ADDED_PER_LOGGED_HOURS: string, COMMITS_PER_LOGGED_HOURS: string, LINES_CHANGED_PER_LOGGED_HOURS: string, LOGGED_HOURS_PER_LINES_CHANGED: string, BUILT_COMMITS_PER_LOGGED_HOURS: string}}
 */
export const SelectedParametersMode = {
    LINES_ADDED_PER_LOGGED_HOURS: 'linesAddedPerLoggedHours',
    LINES_CHANGED_PER_LOGGED_HOURS: 'linesChangedPerLoggedHours',
    COMMITS_PER_LOGGED_HOURS: 'commitsPerLoggedHours',
    BUILT_COMMITS_PER_LOGGED_HOURS: 'builtCommitsPerLoggedHours',
    BUILT_COMMITS_PER_COMMITS: 'builtCommitsPerCommits',
    LOGGED_HOURS_PER_LINES_CHANGED: 'loggedHoursPerlinesChanged'
}

/**
 * @enum
 * @type {{LOGGED_HOURS_SUM_WITH_CHILDS: string, LINES_CHANGED: string, COMMITS_REFERENCED_INCLUDE_CHILDREN: string}}
 */
export const SelectableBaseProperties = {
    LOGGED_HOURS_SUM_WITH_CHILDS: 'loggedHoursSumWithChilds',
    COMMITS_REFERENCED_INCLUDE_CHILDREN: 'commitsReferencedIncludeChildren',
    LINES_CHANGED_INCLUDE_CHILDREN: 'linesChangedIncludeChildren'
};


/**
 * @param {!ItemNode} itemNode
 * @param {SelectableBaseProperties} selectableBaseProperties
 */
export function getBaseChildInclusive(itemNode, selectableBaseProperties){
    switch (selectableBaseProperties) {
        case SelectableBaseProperties.LOGGED_HOURS_SUM_WITH_CHILDS:
            return itemNode.loggedHoursSumWithChilds;
        case SelectableBaseProperties.LINES_CHANGED_INCLUDE_CHILDREN:
            return itemNode.linesAddedIncludeChildren + itemNode.linesDeletedIncludeChildren;
        case SelectableBaseProperties.COMMITS_REFERENCED_INCLUDE_CHILDREN:
            return itemNode.commitsReferencedIncludeChildren;
        default:
            return itemNode.loggedHoursSumWithChilds;
    }
}


/**
 * @param {!ItemNode} itemNode
 * @param {SelectableBaseProperties} selectableBaseProperties
 */
export function getBase(itemNode, selectableBaseProperties){
    switch (selectableBaseProperties) {
        case SelectableBaseProperties.LOGGED_HOURS_SUM_WITH_CHILDS:
            return itemNode.loggedHoursSum;
        case SelectableBaseProperties.LINES_CHANGED_INCLUDE_CHILDREN:
            return itemNode.linesAdded + itemNode.linesDeleted;
        case SelectableBaseProperties.COMMITS_REFERENCED_INCLUDE_CHILDREN:
            return itemNode.commitsReferenced;
        default:
            return itemNode.loggedHoursSum;
    }
}

/**
 * @type {{LOGGED_HOURS_SUM_WITH_CHILDS: string, FILES_CHANGED_INCLUDE_CHILDREN: string, LINES_CHANGED_INCLUDE_CHILDREN: string, GOOD_COMMITS: string, LINES_ADDED_INCLUDE_CHILDREN: string, COMMITS_REFERENCED_INCLUDE_CHILDREN: string}}
 */
export const SelectableColorProperties = {
    LINES_ADDED_INCLUDE_CHILDREN: 'linesAddedIncludeChildren',
    LINES_CHANGED_INCLUDE_CHILDREN: 'linesChangedIncludeChildren',
    COMMITS_REFERENCED_INCLUDE_CHILDREN: 'commitsReferencedIncludeChildren',
    GOOD_COMMITS: 'goodCommits',
    LOGGED_HOURS_SUM_WITH_CHILDS: 'loggedHoursSumWithChilds',
    FILES_CHANGED_INCLUDE_CHILDREN: 'filesChangedIncludeChildren'// NOT yet
};

/**
 * @param {!ItemNode} itemNode
 * @param {SelectableColorProperties} selectableColorProperties
 */
export function getColorProperty(itemNode, selectableColorProperties){
    switch (selectableColorProperties) {
        case SelectableColorProperties.LINES_ADDED_INCLUDE_CHILDREN:
            return itemNode.linesAddedIncludeChildren;
        case SelectableColorProperties.LINES_CHANGED_INCLUDE_CHILDREN:
            return itemNode.linesAddedIncludeChildren + itemNode.linesDeletedIncludeChildren;
        case SelectableColorProperties.COMMITS_REFERENCED_INCLUDE_CHILDREN:
            return itemNode.commitsReferencedIncludeChildren;
        case SelectableColorProperties.GOOD_COMMITS:
            return itemNode.commitsIncludingChildren.filter(c => c.build).length;
        case SelectableColorProperties.LOGGED_HOURS_SUM_WITH_CHILDS:
            return itemNode.loggedHoursSumWithChilds;
        case SelectableColorProperties.FILES_CHANGED_INCLUDE_CHILDREN:
            return itemNode.filesChangedIncludeChildren;
        default:
            return itemNode.linesAddedIncludeChildren;
    }
}


/**
 * @param {SelectableColorProperties} selectableColorProperties
 */
export function areColorsReversed(selectableColorProperties) {
    switch (selectableColorProperties) {
        case SelectableColorProperties.LINES_ADDED_INCLUDE_CHILDREN:
            return false;
        case SelectableColorProperties.LINES_CHANGED_INCLUDE_CHILDREN:
            return false;
        case SelectableColorProperties.COMMITS_REFERENCED_INCLUDE_CHILDREN:
            return false;
        case SelectableColorProperties.GOOD_COMMITS:
            return false;
        case SelectableColorProperties.LOGGED_HOURS_SUM_WITH_CHILDS:
            return true;
        case SelectableColorProperties.FILES_CHANGED_INCLUDE_CHILDREN:
            return false;
        default:
            return false;
    }

}
