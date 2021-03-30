import {FIRST_VISUALIZATION_NODE_ITEM, SECOND_VISUALIZATION_NODE_ITEM} from "../actions/setVisualizationNodeItem";

export default function setVisualizationNodeItem(state = {}, action)  {
    const s = Object.assign({}, state);
    switch (action.type) {
        case  FIRST_VISUALIZATION_NODE_ITEM:
            s[FIRST_VISUALIZATION_NODE_ITEM] = action.payload;
            return s;
        case  SECOND_VISUALIZATION_NODE_ITEM:
            s[SECOND_VISUALIZATION_NODE_ITEM] = action.payload;
            return s;
        default:
            return state
    }
 }
