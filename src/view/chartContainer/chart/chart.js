import React, { Component } from 'react'
import './chart.css';
import {drawChart} from "./renderChart";
import {ColorScaleMode} from "../colorScale/colorScaleMode";

class Chart extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.setSelectedScale = this.setSelectedScale.bind(this);

        this.centeredNodeId = null;
        this.state = {};

        this.chartCanvas = React.createRef();
    }

    /**
     * @param {ColorScaleMode} selectedScaleMode
     */
    setSelectedScale(selectedScaleMode) {
        this.setState({
            selectedScaleMode: selectedScaleMode
        });
    }

    /**
     * @param {!Node} p
     */
    onClick(p) {
        this.centeredNodeId = p && p.data.nodeId;
        this.props.onVisualizedNodeSelected(p.data);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.rootNode !== nextProps.rootNode;
    }

    componentDidMount() {
        this.drawChart();
    }
    componentDidUpdate() {
        this.drawChart();
    }

    drawChart() {
        console.log("Drawing the chart");
        if(this.props.rootNode) {
            this.selectIssue = drawChart(this.props.rootNode, this.chartCanvas.current, this.props.selectRangeFunction, this.onClick);
            if (this.centeredNodeId) {
                this.selectIssue(this.centeredNodeId);
            } else {
                this.selectIssue(this.props.rootNode.data.nodeId);
            }
        }
    }

    render() {
        console.log("Chart render")
        return <div>
                    <div style={{position: 'relative'}}>
                        <div ref={this.chartCanvas}></div>
                    </div>
                </div>
            ;
    }
}

export default Chart
