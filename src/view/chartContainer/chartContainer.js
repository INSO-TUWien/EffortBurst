import React, { Component } from 'react'
import "./chartContainer.css"
import Filter from "./filter/filter";
import Chart from "./chart/chart";
import {calculatePercentage, getQuantizedScaleColor} from "./colorScale/colorScaleMode";
import {partition} from "./chart/renderChart";
import Legend from "./legend/legend";
import ChartDetails from "./chartDetails/chartDetails";
import {connect} from "react-redux";
import {setFirstVisualizationNodeItem, setSecondVisualizationNodeItem} from "../../actions/setVisualizationNodeItem";



class ChartContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedData: null,
            mainVisualizationRootItemNode: null,
            secondaryVisualisationRootItemNode: null,
            colorScaleMode: null,
            quantizedScaleColor: null,
            selectRangeFunction: () => {},
            selectedItemNodeFirstVisualization: null,
            selectedItemNodeSecondVisualization: null,
            legendTitle: ''
        }

        this.rightSide = React.createRef();
        this.leftSide = React.createRef();

        this.onFilterCriteriaChanged = this.onFilterCriteriaChanged.bind(this);
        this.onCollapseFilterClick = this.onCollapseFilterClick.bind(this);
        this.onCollapseDetailsClick = this.onCollapseDetailsClick.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        // TODO do not update all the time
        return nextState.selectedData !== this.state.selectedData;
    }

    /**
     *
     * @param {!FilterSelectedData} filterSelectedData
     */
    onFilterCriteriaChanged(filterSelectedData) {
        const mainRoot = partition(filterSelectedData.mainVisualizationRootItemNode, filterSelectedData.selectableBaseProperties);
        const domainData = mainRoot.descendants().map(value => calculatePercentage(value, filterSelectedData.selectableColorProperties, filterSelectedData.selectableBaseProperties));

        const secondaryRoot = filterSelectedData.secondaryVisualisationRootItemNode ?
            partition(filterSelectedData.secondaryVisualisationRootItemNode, filterSelectedData.selectableBaseProperties) :
            null;

        const selectRangeFunction = getQuantizedScaleColor(domainData, filterSelectedData.selectableColorProperties);

        this.setState({
            selectedData: filterSelectedData,
            mainRootNode: mainRoot,
            secondaryRootNode: secondaryRoot,
            selectableColorProperties: filterSelectedData.selectableColorProperties,
            quantizedScaleColor: selectRangeFunction,
            legendTitle:  ChartContainer.getLegendTitle(filterSelectedData.selectableBaseProperties, filterSelectedData.selectableColorProperties),
            selectRangeFunction: value => selectRangeFunction(calculatePercentage(value, filterSelectedData.selectableColorProperties, filterSelectedData.selectableBaseProperties))
        });
    }

    static getLegendTitle(selectableBaseProperties, selectableColorProperties) {
        let base = '';
        switch (selectableBaseProperties) {
            case 'loggedHoursSumWithChilds':
                base = "Logged hours";
                break;
            case 'commitsReferencedIncludeChildren':
                base = "Commits";
                break;
            case 'linesChangedIncludeChildren':
                base = "Changed lines";
                break;
        }
        let color = '';
        switch (selectableColorProperties) {
            case 'linesAddedIncludeChildren':
                color = "Added lines";
                break;
            case 'linesChangedIncludeChildren':
                color = "Changed lines";
                break;
            case 'commitsReferencedIncludeChildren':
                color = "Commits";
                break;
            case 'goodCommits':
                color = "Good commits";
                break;
            case 'loggedHoursSumWithChilds':
                color = "Logged hours";
                break;
            case 'filesChangedIncludeChildren':
                color = "Changed files";
                break;
        }

        return color + ' / ' + base;
    }

    componentDidMount(prevProps, prevState, snapshot) {
    }

    /**
     * @return {JSX.Element}
     */
    getFirstChart() {
        return this.state.mainRootNode ?
            <div className="chart-container-chart">
                <div className="chart-container-visualization-title">Main visualization</div>
                <div className="chart-container-visualization-subtitle">
                    {this.state.selectedData.authors1.map(a => <span key={a.label}>{a.label}, </span>)}
                </div>
                <Chart rootNode={this.state.mainRootNode}
                       selectableColorProperties={this.state.selectableColorProperties}
                       selectRangeFunction={this.state.selectRangeFunction}
                       onVisualizedNodeSelected={this.props.setFirstVisualizationNodeItem}/>
            </div> :
            null;
    }

    /**
     * @return {JSX.Element}
     */
    getSecondChart() {
        if (! this.state.secondaryRootNode) {
            this.props.setSecondVisualizationNodeItem(null);
        }

        return this.state.secondaryRootNode ?
            <div className="chart-container-chart">
                <div className="chart-container-visualization-title">Second visualization</div>
                <div className="chart-container-visualization-subtitle">
                    {this.state.selectedData.authors2.map(a => <span key={a.label}>{a.label}, </span>)}
                </div>
                <Chart rootNode={this.state.secondaryRootNode}
                       selectableColorProperties={this.state.selectableColorProperties}
                       selectRangeFunction={this.state.selectRangeFunction}
                       onVisualizedNodeSelected={this.props.setSecondVisualizationNodeItem}/>
            </div> :
            null;
    }

    onCollapseFilterClick() {
        if (this.leftSide.current.hasAttribute('collapsed')) {
            this.leftSide.current.removeAttribute('collapsed');
        } else {
            this.leftSide.current.setAttribute('collapsed', '');
        }
    }

    onCollapseDetailsClick() {
        if (this.rightSide.current.hasAttribute('collapsed')) {
            this.rightSide.current.removeAttribute('collapsed');
        } else {
            this.rightSide.current.setAttribute('collapsed', '');
        }
    }

    render() {
        console.log("ChartContainer render")
        return <div className="chart-container">
            <div className="chart-container-left" ref={this.leftSide}>
                <div className="chart-container-filter">
                    <Filter generatedData={this.props.generatedData} onSelectedDataUpdated={this.onFilterCriteriaChanged}/>
                </div>
            </div>
            <div className="chart-container-middle">
                <div>
                    <button style={{float: "left"}}  onClick={this.onCollapseFilterClick}>&larr; Filter </button>
                    <button style={{float: "right"}} onClick={this.onCollapseDetailsClick}>Details &rarr;</button>
                </div>
                <div className="chart-container-charts">
                    {this.getFirstChart()}
                    {this.getSecondChart()}
                </div>
                <div className="chart-container-legend-container">
                    <Legend quantizedScaleColor={this.state.quantizedScaleColor} legendTitle={this.state.legendTitle}/>
                </div>
            </div>
            <div className="chart-container-right" ref={this.rightSide}>
                <ChartDetails/>
            </div>
        </div>
    }
}
const mapStateToProps = () => {
    return {};
};

const mapActionsToProps = {
    setFirstVisualizationNodeItem: setFirstVisualizationNodeItem,
    setSecondVisualizationNodeItem: setSecondVisualizationNodeItem
};

export default connect(mapStateToProps, mapActionsToProps)(ChartContainer)
