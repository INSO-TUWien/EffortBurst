/**
 * @type {string}
 */
export const FIRST_VISUALIZATION_NODE_ITEM = 'FIRST_VISUALIZATION_NODE_ITEM';
/**
 * @type {string}
 */
export const SECOND_VISUALIZATION_NODE_ITEM = 'SECOND_VISUALIZATION_NODE_ITEM';

/**
 * @param {!ItemNode} issue
 */
export function setFirstVisualizationNodeItem(issue) {
    return {
        type: FIRST_VISUALIZATION_NODE_ITEM,
        payload: issue
    }
}

/**
 * @param {!ItemNode} issue
 */
export function setSecondVisualizationNodeItem(issue) {
    return {
        type: SECOND_VISUALIZATION_NODE_ITEM,
        payload: issue
    }
}
