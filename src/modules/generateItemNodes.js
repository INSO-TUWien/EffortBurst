import _ from 'lodash'
import {LoggedHours} from '../models/loggedHours'
import {ItemNode} from '../models/node/itemNode'
import {Project} from "../models/node/project";
import {Epic} from "../models/node/epic";
import {Issue} from "../models/node/issue";
import {SubTask} from "../models/node/subTask";
import {Commit} from "../models/commit";
import {projectNames} from "../models/simpleData/projectNames";
import {authorNames} from "../models/simpleData/authorNames";
import {fileNames} from "../models/simpleData/fileNames";

/**
 * @returns {{projects: !Array<!Project>, issues: !Array<!ItemNode>}}
 */
export function generateItemNodes() {

    /**
     * @type {number}
     */
    const PROJECT_AMOUNT = _.random(1, 4);
   // const PROJECT_AMOUNT = _.random(1, projectNames.length);

    /**
     * @type {number}
     */
    const EPIC_AMOUNT = 10;

    /**
     * @type {number}
     */
    const INDEPENDENT_ISSUES_AMOUNT = 10;

    /**
     * @type {number}
     */
    const MAX_FILES_PER_COMMIT = 20;

    /**
     * @type {number}
     */
    const MAX_COMMITS_PER_ISSUE = 10;

    /**
     * @type {number}
     */
    const MAX_LOGGED_HOURS_PER_ISSUE = 20;

    /**
     * @type {number}
     */
    const EPIC_CHILDRENS_FOR_EPICS = 4;

    /**
     * @type {number}
     */
    const ISSUE_CHILDRENS_FOR_EPICS = 25;

    /**
     * @type {number}
     */
    const SUBTASKS_CHILDRENS_FOR_ISSUES = 5;

    /**
     * @type {number}
     */
    let commitCounter = 0;

    function* generateID(i) {
        for (;true;){
            yield i++;
        }
    }

    const idGenerator = generateID(0);

    /**
     * @returns {!Array<!Project>}
     */
    function generateProjects() {
        const projects = [];
        for (let i = 0; i< PROJECT_AMOUNT; i++) {
            const project = new Project(idGenerator.next().value, projectNames[i]);
            projects.push(project);
        }

        return projects;
    }

    /**
     * @returns {!Array<!ItemNode>} all the epics and issues
     */
    function generateEpicsAndIssues() {
        const epics = _.times(_.random(0, EPIC_AMOUNT), () => new Epic(idGenerator.next().value));
        // Some epics are set as sub-epics of other epics
        const subEpics = [];
        epics.forEach(epic => {
            epic.children.push(..._.times( _.random(0, EPIC_CHILDRENS_FOR_EPICS), () => new Epic(idGenerator.next().value)));
            subEpics.push(...epic.children);
        });

        const epicsIssues = generateIssuesForEpics(epics.concat(subEpics));
        const independentIssues = _.times(_.random(0, INDEPENDENT_ISSUES_AMOUNT), () => new Issue(idGenerator.next().value));

        generateSubTasks(epicsIssues.concat(independentIssues));

        return [...epics,...subEpics,...epicsIssues,...independentIssues];
    }

    /**
     * @param {!Array<!Epic>} epics
     * @returns {!Array<!Issue>}
     */
    function generateIssuesForEpics(epics) {
        const allIssues = [];

        epics.forEach(epic => {
            const issues = _.times(_.random(0, ISSUE_CHILDRENS_FOR_EPICS), () => new Issue(idGenerator.next().value));
            epic.children.push(...issues);
            allIssues.push(...issues);
        });

        return allIssues;
    }

    /**
     * @param {!Array<Issue>} issues
     */
    function generateSubTasks(issues) {
        issues.forEach(issue => {
            issue.children.push(..._.times(_.random(0, SUBTASKS_CHILDRENS_FOR_ISSUES), () => new SubTask(idGenerator.next().value)));
        })
    }

    /**
     * @param {!Issue} issue
     * @param {!Project} selectedProject
     */
    function generateCommits(issue, selectedProject) {
        // TODO try to select the project per commit. Then you get issues which are related to multiple projects.
        const commits = _.times(_.random(0, MAX_COMMITS_PER_ISSUE), () => {
            const authorName = _.sample(authorNames);
            const selectedSubtask = _.sample([issue, ...issue.children]);
            generateLoggedHoursFor(selectedSubtask, authorName);
            return generateCommitFor(selectedProject, selectedSubtask, authorName);
        });

        selectedProject.commits.push(...commits);
    }

    /**
     * @param {!Issue|!SubTask} item
     * @param {string} authorName
     */
    function generateLoggedHoursFor(item, authorName) {
        const loggedHour = new LoggedHours( _.random(1, MAX_LOGGED_HOURS_PER_ISSUE), authorName);
        item.loggedHours.push(loggedHour);
    }

    /**
     * @param {!Project} project
     * @param {!Issue|!SubTask} item
     * @param {string} authorName
     * @returns {!Commit}
     */
    function generateCommitFor(project, item, authorName) {
        const commit = new Commit(idGenerator.next().value, item, null, authorName);
        commitCounter++;

        const selectedFiles = new Set(_.times(_.random(1, MAX_FILES_PER_COMMIT), () => _.sample(fileNames)));
        selectedFiles.forEach(selectedFile => commit.files.push(selectedFile));
        commit.build = _.random(0,100) > 30;

        return commit;
    }

    const handleSaveToPC = (jsonData,filename) => {
        const fileData = JSON.stringify(jsonData);
        const blob = new Blob([fileData], {type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${filename}.json`;
        link.href = url;
        link.click();
    }

    /**
     * @returns {{projects: !Array<!Project>, issues: !Array<!ItemNode>}}
     */
    function generateNodes() {
        const projects = generateProjects();
        const allIssues = [];
        projects.forEach(project => {
            const issueTrackerNodes = generateEpicsAndIssues();

            allIssues.push(...issueTrackerNodes);

            const issues = /** @type {!Array<!Issue>}*/issueTrackerNodes
                .filter(issueTrackerNode => issueTrackerNode instanceof Issue);
            issues.forEach(issue => generateCommits(issue, project));
        });


        const allData = {
            issues: allIssues,
            projects: projects
        }

        console.log("Commits generated: ", commitCounter);
        handleSaveToPC(allData, 'generated-nodes');
        return allData;
    }

    return generateNodes();
}
