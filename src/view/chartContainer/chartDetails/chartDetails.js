import React, { Component } from 'react'
import { connect } from 'react-redux'
import "./chartDetails.css"
import {FIRST_VISUALIZATION_NODE_ITEM, SECOND_VISUALIZATION_NODE_ITEM} from "../../../actions/setVisualizationNodeItem";

class ChartDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemNode1: {},
            itemNode2: {}
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.visualizationNodes[FIRST_VISUALIZATION_NODE_ITEM] !== this.state.itemNode1 ||
            nextProps.visualizationNodes[SECOND_VISUALIZATION_NODE_ITEM] !== this.state.itemNode2;
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const itemNode1 = this.props.visualizationNodes[FIRST_VISUALIZATION_NODE_ITEM] ;
        const itemNode2 = this.props.visualizationNodes[SECOND_VISUALIZATION_NODE_ITEM] ;

        if (
            this.state.itemNode1 !== itemNode1 ||
            this.state.itemNode2 !== itemNode2
        ){
            this.setState({itemNode1, itemNode2})
        }
    }

    /**
     * @param {string} title
     * @param label1
     * @param label2
     * @return {JSX.Element}
     */
    getDetail(title, label1, label2) {
        return <tr>
            <td>{title}</td>
            <td className="chart-details-first-label">{label1 || ''}</td>
            <td className="chart-details-second-label">{label2 || ''}</td>
        </tr>;
    }
    getLinesAddedPerHour(itemNode) {
        return Math.round(itemNode.linesAddedIncludeChildren / (itemNode.loggedHoursSumWithChilds||1)*100)/100;
    }
    getChangedLinesPerHour(itemNode) {
        return Math.round((itemNode.linesAddedIncludeChildren + itemNode.linesDeletedIncludeChildren) / (itemNode.loggedHoursSumWithChilds||1)*100)/100;
    }
    getCommitsAddedPerHour(itemNode) {
        return Math.round(itemNode.commitsReferencedIncludeChildren / (itemNode.loggedHoursSumWithChilds||1)*100)/100;
    }

    /**
     * @param {!ItemNode} itemNode1
     * @param {!ItemNode} itemNode2
     * @return {JSX.Element}
     */
    getDetailsTable(itemNode1, itemNode2) {
        return <div>
            <table>
                <thead>
                <tr>
                    <th></th>
                    <th className="chart-details-first-label">Main visualization</th>
                    <th className="chart-details-second-label">Second vis.</th>
                </tr>
                </thead>
                <tbody>
                <tr><td colSpan="3" style={{textAlign: "center"}}>Child data inclusive</td></tr>
                {this.getDetail("Type:", itemNode1.type, itemNode2 && itemNode2.type || '')}
                {this.getDetail("Name:", itemNode1.name, itemNode2 && itemNode2.name)}
                {this.getDetail("Logged hours:", itemNode1.loggedHoursSumWithChilds, itemNode2 && itemNode2.loggedHoursSumWithChilds)}
                {this.getDetail("Added lines:", itemNode1.linesAddedIncludeChildren, itemNode2 && itemNode2.linesAddedIncludeChildren)}
                {this.getDetail("Deleted lines:", itemNode1.linesDeletedIncludeChildren, itemNode2 && itemNode2.linesDeletedIncludeChildren)}
                {this.getDetail("Commits", itemNode1.commitsReferencedIncludeChildren, itemNode2 && itemNode2.commitsReferencedIncludeChildren)}
                {this.getDetail("Added lines/hour:", this.getLinesAddedPerHour(itemNode1), itemNode2 && this.getLinesAddedPerHour(itemNode2))}
                {this.getDetail("Changed lines/hour:", this.getChangedLinesPerHour(itemNode1), itemNode2 && this.getChangedLinesPerHour(itemNode2))}
                {this.getDetail("Commits/hour:", this.getCommitsAddedPerHour(itemNode1), itemNode2 && this.getCommitsAddedPerHour(itemNode2))}
                <tr><td colSpan="3" style={{textAlign: "center"}}>Excluding childrens</td></tr>
                {this.getDetail("Logged hours:", itemNode1.loggedHoursSum, itemNode2 && itemNode2.loggedHoursSum)}
                {this.getDetail("Added lines:", itemNode1.linesAdded, itemNode2 && itemNode2.linesAdded)}
                {this.getDetail("Deleted lines:", itemNode1.linesDeleted, itemNode2 && itemNode2.linesDeleted)}
                {this.getDetail("Commits", itemNode1.commitsReferenced, itemNode2 && itemNode2.commitsReferenced)}
                </tbody>
            </table>
        </div>
    }

    /**
     * @param {!ItemNode} itemNode
     * @param {string} title
     * @return {unknown[]}
     */
    getCommitsFor(itemNode, title) {
        const commits = itemNode.commits || [];
        if (commits.length > 0) {

            return  <div>
                <div><b>{title} {itemNode.commitsReferenced}</b></div>
                <div className="chart-details-commit-container">
                    <div>CI</div>
                    <div>Commit</div>
                    <div>Added</div>
                    <div>Deleted</div>
                    <div>Touched</div>
                    <div>build</div>
                    <div>ID</div>
                    <div>Lines</div>
                    <div>Lines</div>
                    <div>Files</div>
                    {
                        commits.map(commit => {
                            return [
                                <div key={commit.commitId+'build'} className="chart-details-commit-build" build={commit.build.toString()}/>,
                                <div key={commit.commitId}>{commit.commitId}</div>,
                                <div key={commit.commitId+'+'+commit.linesAdded}>{commit.linesAdded}</div>,
                                <div key={commit.commitId+'+'+commit.linesDeleted}>{commit.linesDeleted}</div>,
                                <div key={commit.commitId+'+'+commit.files.length}>{commit.files.length}</div>
                            ]
                        })
                    }
                </div>
            </div>
        } else {
            return null;
        }
    }

    getIssueData() {
        const itemNode1 = this.state.itemNode1;
        const itemNode2 = this.state.itemNode2;
        return<div className={"chart-details-container " + (this.state.itemNode2 ? '' : 'chart-details-container-one')}>
            <div>{this.getDetailsTable(itemNode1, itemNode2)}</div>
            <div>{this.getCommitsFor(itemNode1, "Main visualization commits:")}</div>
            <div>{itemNode2 && this.getCommitsFor(itemNode2, "Second visualization commits:")}</div>
            </div>
    }

    render() {
        return this.getIssueData();
    }
}
const mapStateToProps = state => {
    return {
        visualizationNodes: state.visualizationNodes
    };
};

const mapActionsToProps = {
};

export default connect(mapStateToProps, mapActionsToProps)(ChartDetails)
