import React, { Component } from "react";
import "./filter.css"
import {authorNames} from "../../../models/simpleData/authorNames";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {selecteItemNodes} from "../../../modules/selecteItemNodes";
import {SelectedParametersMode, SelectableBaseProperties, SelectableColorProperties} from "./selectedParametersMode";
import {FilterSelectedData} from "./filterSelectedData";


class Filter extends Component {
    constructor(props) {
        super(props);
        // Generated data will not be changed!
        const authorOptions = [{label: "Select all", value: "*"},...authorNames.map(a => {return {label: a, value: a}})];
        const projectOptions =  [{label: "Select all", value: "*"},...this.props.generatedData.projects.map(a => {return { label: `${a.name}`,value: a.nodeId}})];
        const issueOptions = [{label: "Select all", value: "*"},...this.props.generatedData.issues.map(a => {return { label: `#${a.nodeId} - ${a.type}`,value: a.nodeId}})]
        this.state = {
            authorOptions,
            selectedAuthors1: authorOptions,
            selectedAuthors2: authorOptions,
            projectOptions,
            selectedProjects: projectOptions,
            issueOptions,
            selectedIssues: issueOptions,
            selectedParametersMode: SelectedParametersMode.LINES_ADDED_PER_LOGGED_HOURS,
            selectableBaseProperties: SelectableBaseProperties.LOGGED_HOURS_SUM_WITH_CHILDS,
            selectableColorProperties: SelectableColorProperties.LINES_ADDED_INCLUDE_CHILDREN
        };

        this.SelectedParametersMode = SelectedParametersMode;
        this.SelectableBaseProperties = SelectableBaseProperties;
        this.SelectableColorProperties = SelectableColorProperties;
        this.onAuthorSelected1 = this.onAuthorSelected1.bind(this);
        this.onAuthorSelected2 = this.onAuthorSelected2.bind(this);
        this.onProjectSelected = this.onProjectSelected.bind(this);
        this.onIssueSelected = this.onIssueSelected.bind(this);
        this.updateSelectedParametersMode = this.updateSelectedParametersMode.bind(this);
        this.onClick = this.onClick.bind(this);

        this.prepareSelectedData();
    }
    onAuthorSelected1(selectedAuthors1, event) {
        this.performSelection(selectedAuthors1, event, 'selectedAuthors1', this.state.authorOptions);
    }
    onAuthorSelected2(selectedAuthors2, event) {
        this.performSelection(selectedAuthors2, event, 'selectedAuthors2', this.state.authorOptions);
    }
    onProjectSelected(selectedProjects, event) {
        this.performSelection(selectedProjects, event, 'selectedProjects', this.state.projectOptions);
    }
    onIssueSelected(selectedIssues, event) {
        this.performSelection(selectedIssues, event, 'selectedIssues', this.state.issueOptions);
    }

    performSelection(data, event, key, defaultOptions) {
        if (event.action === "select-option" && event.option.value === "*") {
            this.setState({[key]: defaultOptions});
        } else if (event.action === "deselect-option" && event.option.value === "*") {
            this.setState({[key]:[]});
        } else {
            this.setState({[key]: data.filter(o => o.value !== "*")});
        }
    }

    prepareSelectedData() {
        const projects = this.state.selectedProjects.length === 0 ? this.state.projectOptions : this.state.selectedProjects;
        const issues = this.state.selectedIssues.length === 0 ? this.state.issueOptions : this.state.selectedIssues;
        const authors1 = (this.state.selectedAuthors1.length === 0 ? this.state.authorOptions : this.state.selectedAuthors1)
            .filter(o => o.value !== "*");
        const authors2 = this.state.selectedAuthors2.filter(o => o.value !== "*");

        const mainVisualizationRootItemNode = selecteItemNodes(
            {
                projects: projects.map(value => value.value),
                issues: issues.map(value => value.value).filter(v => v !== '*'),
                authors1: authors1.map(value => value.value)
            },
            this.props.generatedData
        );

        const secondAuthors = authors2.map(value => value.value);
        let secondaryVisualisationRootItemNode = null;
        if (secondAuthors.length > 0) {
            secondaryVisualisationRootItemNode = selecteItemNodes(
                {
                    projects: projects.map(value => value.value),
                    issues: issues.map(value => value.value).filter(v => v !== '*'),
                    authors1: secondAuthors
                },
                this.props.generatedData
            );
        }

        const filterSelectedData = new FilterSelectedData(
            authors1.filter(a => a.label),
            authors2.filter(a => a.label),
            mainVisualizationRootItemNode,
            secondaryVisualisationRootItemNode,
            this.state.selectableBaseProperties,
            this.state.selectableColorProperties
        );

        this.props.onSelectedDataUpdated(filterSelectedData);
    }

    /**
     * @param {!ChangeEvent<HTMLElement>} event
     */
    updateSelectedParametersMode(event) {
        const selectedParametersMode = event.target.value;
        switch (selectedParametersMode) {
            case this.SelectedParametersMode.LINES_ADDED_PER_LOGGED_HOURS:
                this.setState({
                    selectableBaseProperties: this.SelectableBaseProperties.LOGGED_HOURS_SUM_WITH_CHILDS,
                    selectableColorProperties: this.SelectableColorProperties.LINES_ADDED_INCLUDE_CHILDREN
                });
                break;
            case this.SelectedParametersMode.LINES_CHANGED_PER_LOGGED_HOURS:
                this.setState({
                    selectableBaseProperties: this.SelectableBaseProperties.LOGGED_HOURS_SUM_WITH_CHILDS,
                    selectableColorProperties: this.SelectableColorProperties.LINES_CHANGED_INCLUDE_CHILDREN
                });
                break;
            case this.SelectedParametersMode.COMMITS_PER_LOGGED_HOURS:
                this.setState({
                    selectableBaseProperties: this.SelectableBaseProperties.LOGGED_HOURS_SUM_WITH_CHILDS,
                    selectableColorProperties: this.SelectableColorProperties.COMMITS_REFERENCED_INCLUDE_CHILDREN
                });
                break;
            case this.SelectedParametersMode.BUILT_COMMITS_PER_LOGGED_HOURS:
                this.setState({
                    selectableBaseProperties: this.SelectableBaseProperties.LOGGED_HOURS_SUM_WITH_CHILDS,
                    selectableColorProperties: this.SelectableColorProperties.GOOD_COMMITS
                });
                break;
            case this.SelectedParametersMode.BUILT_COMMITS_PER_COMMITS:
                this.setState({
                    selectableBaseProperties: this.SelectableBaseProperties.COMMITS_REFERENCED_INCLUDE_CHILDREN,
                    selectableColorProperties: this.SelectableColorProperties.GOOD_COMMITS
                });
                break;
            case this.SelectedParametersMode.LOGGED_HOURS_PER_LINES_CHANGED:
                this.setState({
                    selectableBaseProperties: this.SelectableBaseProperties.LINES_CHANGED_INCLUDE_CHILDREN,
                    selectableColorProperties: this.SelectableColorProperties.LOGGED_HOURS_SUM_WITH_CHILDS
                });
                break;
            default:
                this.setState({
                    selectableBaseProperties: this.SelectableBaseProperties.LOGGED_HOURS_SUM_WITH_CHILDS,
                    selectableColorProperties: this.SelectableColorProperties.LINES_ADDED_INCLUDE_CHILDREN
                });

        }
        this.setState({selectedParametersMode: event.target.value})
    }

    /**
     * @param {!Event} event
     */
    onClick(event) {
        this.prepareSelectedData();
        event.preventDefault();
    }

    /**
     * @param {SelectedParametersMode} parameterMode
     * @param {string} label
     * @return {JSX.Element}
     */
    getParametersModeInput(parameterMode, label) {
        return <div>
            <input type="radio"
                   value={parameterMode}
                   name="selectedParametersMode"
                   checked={this.state.selectedParametersMode === parameterMode}
                   onChange={this.updateSelectedParametersMode}/>{label}
        </div>
    }

    render() {
        console.log("Filters")
        return<div>
            <div className="filter-container">
                <i>For each input if no item is selected then all are selected</i>
                <p>Select authors:</p>
                <ReactMultiSelectCheckboxes options={this.state.authorOptions} onChange={this.onAuthorSelected1} value={this.state.selectedAuthors1}/>
                <p>Select projects:</p>
                <ReactMultiSelectCheckboxes options={this.state.projectOptions} onChange={this.onProjectSelected} value={this.state.selectedProjects}/>
                <p>Select issues:</p>
                <ReactMultiSelectCheckboxes options={this.state.issueOptions} onChange={this.onIssueSelected} value={this.state.selectedIssues}/>
                <p>Select color scale mode:</p>
                <div>
                    {this.getParametersModeInput(SelectedParametersMode.LINES_ADDED_PER_LOGGED_HOURS, "Lines added /Hour")}
                    {this.getParametersModeInput(SelectedParametersMode.LINES_CHANGED_PER_LOGGED_HOURS, "Lines changed /Hour")}
                    {this.getParametersModeInput(SelectedParametersMode.COMMITS_PER_LOGGED_HOURS, "Commits /Hour")}
                    {this.getParametersModeInput(SelectedParametersMode.BUILT_COMMITS_PER_LOGGED_HOURS, "Built commits /Hour")}
                    {this.getParametersModeInput(SelectedParametersMode.BUILT_COMMITS_PER_COMMITS, "Built commits /Commit")}
                    {this.getParametersModeInput(SelectedParametersMode.LOGGED_HOURS_PER_LINES_CHANGED, "Logged hours /Lines changed")}
                </div>
            </div>
            <br/>
            <div className="filter-container">
                <i>Select at least one author for the second visualization</i>
                <p>Select authors:</p>
                <ReactMultiSelectCheckboxes options={this.state.authorOptions} onChange={this.onAuthorSelected2} value={this.state.selectedAuthors2}/>
            </div>
            <button className="submit-button" onClick={this.onClick}>Submit</button>
        </div>
    }
}

export default Filter
