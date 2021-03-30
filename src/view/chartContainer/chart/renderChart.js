// The code here is based on the Observable implementation.
// {@see https://observablehq.com/@d3/zoomable-sunburst}
import * as d3 from "d3";
import {getBase} from "../filter/selectedParametersMode";


/**
 * @param {!Node} root
 * @param {!HTMLElement} container
 * @param {function} selectRangeFunction
 * @param {function} onClick
 */
export function drawChart(root, container, selectRangeFunction, onClick) {
    const width = 1000;
    const radius = width / 6; // Change this do display more lines
    const format = d3.format(",d");
    const transitionDurationMillisecond = 750;

    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

    root.each(d => d.current = d);

    // Remove the previous svg.
    d3.select(container).select("svg").remove();


    const svg = d3.select(container).append("svg")
        .attr("viewBox", [0, 0, width, width])
        .style("font", "10px sans-serif");

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${width / 2})`);

    const path = g.append("g")
        .selectAll("path")
        .data(root.descendants())
        .join("path")
        .attr("fill", d => {
            return selectRangeFunction(d);
        })
        .attr("fill-opacity", d => arcVisible(d.current) ? 0.6 : 0)
        .attr("d", d => arc(d.current));

    path.style("cursor", "pointer")
        .on("click", (p) => {
            clicked(p);
        });

    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    const label = g.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(0))
        .join("text")
        .attr("dy", "0.60em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current, radius));

    label
        .insert("tspan")
        .attr('class', 'chart-render-node-item-type')
        .text(d => getDisplayedNodeType(d.data));

    label
        .insert("tspan")
        .attr('class', 'chart-render-node-item-title')
        .text(d => getDisplayedText(d.data));


    /**
     label
     .append("image")
     .attr("xlink:href","https://upload.wikimedia.org/wikipedia/commons/d/d8/Compass_card_(de).svg")
     .attr("width", 100)
     .attr("height", 100)
     .attr('class', 'chart-render-node-item-title')
     .attr("dy", "0.35em")
     .text(d => "asd")
     */
    const parent = g.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", (p) => {
            clicked(p);
        });

    let centerText = resetCenterText(null, root, g, 0);

    /**
     * @param {!Node} p
     */
    function clicked(p) {
        parent.datum(p.parent || root);

        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
        });


        const t = g.transition().duration(transitionDurationMillisecond);

        centerText = resetCenterText(centerText, p, g, transitionDurationMillisecond);


        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .filter(function (d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => arcVisible(d.target) ? 0.6 : 0)
            .attrTween("d", d => () => arc(d.current));

        label.filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current, radius));

        onClick(p);
    }

    /**
     * @param {Selection} oldCenterText
     * @param {!Node} selectedSelection
     * @param {!Node} g
     * @param {number} duration
     */
    function resetCenterText(oldCenterText, selectedSelection, g, duration) {
        parent.attr("fill", () => {
            return selectRangeFunction(selectedSelection);
        }).attr("fill-opacity", () => 0.6);

        if (oldCenterText) {
            oldCenterText.remove();
        }
        const t = g.transition().duration(duration);

        let centerText = g.append('text')
            .datum(selectedSelection)
            .attr('class', 'chart-selected-issue-title')
            .attr("pointer-events", "all")
            .attr("text-anchor", "middle")
            .on("click", (p) => {
                clicked(selectedSelection.parent || root);
            });

        centerText.append('tspan').transition(t)
            .attr('y', -50)
            .attr('x', 0)
            .attr('class', 'chart-render-node-item-type')
            .text(d => d.data.nodeId === -1 ? "" : getFullDisplayedNodeType(d.data));

        centerText.append('tspan').transition(t)
            .attr('y', -20)
            .attr('x', 0)
            .text(d => `${d.data.name}`);
        centerText.append('tspan').transition(t)
            .attr('y', 30)
            .attr('x', 0)
            .text(d => `-back-`);

        return centerText;
    }

    /**
     * @param {!Node} nodeId
     */
    function selectId(nodeId) {
        const selectedNode = findNode([root], nodeId);
        if (selectedNode) {
            clicked(selectedNode);
        }
    }

    return selectId;
}

/**
 * @param {!Array<!Node>} nodes
 * @param {string} nodeId
 * @returns {Node}
 */
function findNode(nodes, nodeId) {
    let foundNode = null;
    nodes.forEach(node => {
        foundNode = node.data.nodeId === nodeId ? node: foundNode;
        foundNode = foundNode || findNode(node.children || [], nodeId);
    });

    return foundNode;
}

/**
 * @param {!ItemNode} itemNode
 */
function getDisplayedNodeType(itemNode) {
    return `${itemNode.type[0].toUpperCase()}${itemNode.type[1]}${itemNode.type[2]}. `;
}

/**
 * @param {!ItemNode} itemNode
 */
function getFullDisplayedNodeType(itemNode) {
    return `${itemNode.type[0].toUpperCase()}${itemNode.type.substring(1, itemNode.type.length)}`;
}

/**
 * @param {!ItemNode} itemNode
 */
function getDisplayedText(itemNode) {
    return `${itemNode.name}`;
}


// Change here to see more lines
function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
}

function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
}

function labelTransform(d, radius) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
}

/**
 * @param {!ItemNode} data
 * @param {SelectableBaseProperties} selectableBaseProperties
 * @returns {*}
 */
export function partition(data, selectableBaseProperties) {
    let root = d3.hierarchy(data)
        .sum(d =>  {
            return getBase(d, selectableBaseProperties);
        });

    return d3.partition().size([2 * Math.PI, root.height + 1])(root);
}
