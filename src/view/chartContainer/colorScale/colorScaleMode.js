import * as d3 from "d3";
import {areColorsReversed, getBaseChildInclusive, getColorProperty} from "../filter/selectedParametersMode";

/**
 * @param {!Array<!Node>} domainData
 * @param {SelectableColorProperties} selectableColorProperties
 * @returns {function}
 */
export function getQuantizedScaleColor(domainData, selectableColorProperties) {
    /**
     * @param {number} rangeSize
     * @returns {!Array<!Rgb>}
     */
    function getRangeColors(rangeSize) {
        const numbers = d3.range(0, 1, 1/ (rangeSize - 1));
        numbers.push(1);
        const colors = numbers.map(number => d3.rgb(d3.interpolateRdYlGn(number)));

        if (areColorsReversed(selectableColorProperties)) {
            return colors.reverse();
        } else {
            return colors;
        }
    }

    return d3.scaleQuantile()
        .domain(domainData)
        .range(getRangeColors(20));
}

/**
 * Use with
 * @param {!Node} node
 * @param {SelectableColorProperties} selectableColorProperties
 * @param {SelectableBaseProperties} selectableBaseProperties
 * @returns {number}
 */
export function calculatePercentage (node, selectableColorProperties, selectableBaseProperties) {
    let value;
    const base = getBaseChildInclusive(node.data, selectableBaseProperties);
    const colorProperty =  getColorProperty(node.data, selectableColorProperties);
    if (base > 0 ){
        value = colorProperty / base;
    } else {
        value = colorProperty / 1;
    }

    return value;
}
