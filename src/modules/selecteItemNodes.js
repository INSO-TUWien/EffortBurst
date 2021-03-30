import {ItemNode} from '../models/node/itemNode'
import {Project} from "../models/node/project";
import {Epic} from "../models/node/epic";
import {Issue} from "../models/node/issue";
import {SubTask} from "../models/node/subTask";
import {Commit} from "../models/commit";
import {ItemNodeType} from "../models/node/itemNodeType";
import {LoggedHours} from "../models/loggedHours";

/**
 * @param {!{projects: !Array<number>, issues: !Array<number>, authors1: !Array<string>, authors2: !Array<string>}} data
 * @param {!{projects: !Array<!Project>, issues: !Array<!Issue>}} generatedData
 * @returns {!ItemNode}
 */
export function selecteItemNodes(data, generatedData) {

    /**
     * @type {ItemNodeType}
     */
    const itemNodeType = ItemNodeType;

    /**
     * @param allIssues
     * @return {!Object<string, !ItemNode>}
     */
    function getAllIssue(allIssues) {
        const nodeItemsMapper = {};
        allIssues.forEach(issueData => {
            convertNode(issueData, nodeItemsMapper);
        });

        return nodeItemsMapper;
    }

    /**
     * @param {!ItemNode} item
     */
    function getHighestIssueParent(item){
        return item.parentNode ? getHighestIssueParent(item.parentNode) : item;
    }

    /**
     * @param {!Object} rawNode
     * @param {!Object<string, !ItemNode>} nodeItemsMapper
     */
    function convertNode(rawNode, nodeItemsMapper) {
        let itemNode = null;
        if (rawNode.type === itemNodeType.ISSUE) {
            itemNode = convertIssue(rawNode, nodeItemsMapper);
        } else if (rawNode.type === itemNodeType.EPIC) {
            itemNode = convertEpic(rawNode, nodeItemsMapper);
        }

        if (itemNode) {
            convertLoggedHours(itemNode, rawNode);
            nodeItemsMapper[itemNode.nodeId] = itemNode;
        }

        return itemNode;
    }

    /**
     * @param {!ItemNode} itemNode
     * @param {!Object} rawNode
     */
    function convertLoggedHours(itemNode, rawNode){
        itemNode.loggedHours = rawNode.loggedHours
            .filter(lH => data.authors1.includes(lH.authorName))
            .map(lH =>new LoggedHours(lH.hours, lH.authorName));
        itemNode.loggedHoursSum = itemNode.loggedHours.reduce((currentSum, loggedHour)=>  loggedHour.hours + currentSum,0);
    }

    /**
     * @param {!Object} rawIssue
     * @param {!Object<string, !ItemNode>} nodeItemsMapper
     * @returns {Issue}
     */
    function convertIssue(rawIssue, nodeItemsMapper) {
        if (!nodeItemsMapper[rawIssue.nodeId]) {
            let issue = new Issue(rawIssue.nodeId);
            issue.children = rawIssue.children.map(sT => {
                const subTask = new SubTask(sT.nodeId, issue);
                nodeItemsMapper[sT.nodeId] = subTask;
                convertLoggedHours(subTask, sT);
                return subTask;
            });

            return issue;
        }
    }

    /**
     * @param {!Object} rawEpic
     * @param {!Object<string, !ItemNode>} nodeItemsMapper
     * @returns {Epic}
     */
    function convertEpic(rawEpic, nodeItemsMapper) {
        if (!nodeItemsMapper[rawEpic.nodeId]) {
            let epic = new Epic(rawEpic.nodeId);
            epic.children = rawEpic.children.map(c => {
                let child = nodeItemsMapper[c.nodeId];
                if (!child) {
                    child = convertNode(c, nodeItemsMapper);
                    child.parentNode = epic;
                }
                return child;
            });

            return epic;
        }
    }

    /**
     * @returns {!Array<!Project>}
     */
    function getSelectedProjectsWithCommits() {
        return generatedData.projects
            .filter(project => data.projects.some(id => id === project.nodeId))
            .map(p => {
                const project = new Project(p.nodeId, p.name);
                project.commits = p.commits
                    .filter(c => data.authors1.includes(c.authorName))
                    .map(c => {
                        const commit = new Commit(c.commitId, c.node, project, c.authorName, c.linesAdded, c.linesDeleted);
                        commit.files = c.files;
                        commit.build = c.build;
                        return commit;
                    });

                return project;
            });
    }

    /**
     * @param {!Project} project
     * @param {!Object<string, !ItemNode>} nodeItemsMapper
     */
    function addCommitsToIssues(project, nodeItemsMapper) {
        const projectIssues = [];
        project.commits.forEach(commit=> {
            const issue = nodeItemsMapper[commit.node.nodeId];
            if (issue) {
                issue.setCommit(commit);
                commit.node = issue;

                const highestParent = getHighestIssueParent(issue);
                if (!projectIssues.includes(highestParent)) {
                    projectIssues.push(highestParent);
                }
            }
        });

        project.children = projectIssues;
    }

    /**
     * @param {!Project} project
     * @param {!Object<string, !ItemNode>} nodeItemsMapper
     */
    function updateDirectProjectChildrenParent(project, nodeItemsMapper){
        project.children.forEach(child => child.parentNode = project);
    }

    /**
     * @param {!ItemNode} itemNode
     */
    function updateChildrenSum(itemNode) {
        itemNode.children.forEach(updateChildrenSum);


        itemNode.commitsIncludingChildren = itemNode.children
            .reduce((currentCommits, child) => child.commitsIncludingChildren.concat(currentCommits), itemNode.commits);
        itemNode.allFilesTouched = itemNode.commitsIncludingChildren
            .reduce((currentFiles, commit) => {
                commit.files.forEach(file=> {
                    if (!currentFiles.includes(file)){
                        currentFiles.push(file);
                    }
                });
                return currentFiles;
            }, [])

        itemNode.loggedHoursSumWithChilds = itemNode.children
            .reduce((currentSum, child)=>  child.loggedHoursSumWithChilds + currentSum, itemNode.loggedHoursSum);
        itemNode.commitsReferencedIncludeChildren = itemNode.children
            .reduce((currentSum, child)=>  child.commitsReferencedIncludeChildren + currentSum, itemNode.commitsReferenced);
        itemNode.linesAddedIncludeChildren = itemNode.children
            .reduce((currentSum, child)=>  child.linesAddedIncludeChildren + currentSum, itemNode.linesAdded);
        itemNode.linesDeletedIncludeChildren = itemNode.children
            .reduce((currentSum, child)=>  child.linesDeletedIncludeChildren + currentSum, itemNode.linesDeleted);

        if (itemNode.linesAddedIncludeChildren + itemNode.linesDeletedIncludeChildren === 0 || itemNode.loggedHoursSumWithChilds === 0) {

            if (itemNode.parentNode) {
                itemNode.parentNode.children = itemNode.parentNode.children.filter(c => c !== itemNode);
            }
        }
    }

    /**
     * @param {!Object<string, !ItemNode>} nodeItemsMapper
     */
    function filterApprovedNodeIds(nodeItemsMapper) {
        const mapper = {};
        data.issues.forEach(issueId => {
            mapper[issueId] = nodeItemsMapper[issueId];

            let parent = mapper[issueId].parentNode;
            while(parent) {
                mapper[parent.nodeId] = parent;
                parent = parent.nodeId;
            }

            setApprovedChildrens(mapper, mapper[issueId].children);
        });

        return mapper;
    }


    /**
     * @param {!Object<string, !ItemNode>} mapper
     * @param {!Array<!ItemNode>} itemNodes
     */
    function setApprovedChildrens(mapper, itemNodes){
        itemNodes.forEach(itemNode => {
            setApprovedChildrens(mapper, itemNode.children);
            mapper[itemNode.nodeId] = itemNode;
        });
    }

    /**
     * @return {!ItemNode}
     */
    function extractFilteredNodes() {
        const projects = getSelectedProjectsWithCommits();
        const nodeItemsMapper = filterApprovedNodeIds(getAllIssue(generatedData.issues));

        projects.forEach(project => addCommitsToIssues(project, nodeItemsMapper));
        projects.forEach(project => updateDirectProjectChildrenParent(project, nodeItemsMapper));

        projects.forEach(project => project.commits = []);

        // TODO update node items with sum of childrens.
        const root = new ItemNode(-1, null, [], projects);
        root.name = "All projects";
        root.type = "-";
        projects.forEach(p => p.parentNode = root);

        updateChildrenSum(root);

        return root;
    }

    return extractFilteredNodes();
}

// logged hours
