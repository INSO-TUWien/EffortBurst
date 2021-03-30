export class FilterSelectedData {
    /**
     * @param {!Array<string>} authors1
     * @param {!Array<string>} authors2
     * @param {!ItemNode} mainVisualizationRootItemNode
     * @param {ItemNode} secondaryVisualisationRootItemNode
     * @param {SelectableBaseProperties} selectableBaseProperties
     * @param {SelectableColorProperties} selectableColorProperties
     */
    constructor(
        authors1,
        authors2,
        mainVisualizationRootItemNode,
        secondaryVisualisationRootItemNode,
        selectableBaseProperties,
        selectableColorProperties
    ){
        /**
         * @type {!Array<string>}
         */
        this.authors1 = authors1;

        /**
         * @type {!Array<string>}
         */
        this.authors2 = authors2;

        /**
         * @type {!ItemNode}
         */
        this.mainVisualizationRootItemNode = mainVisualizationRootItemNode;

        /**
         * @type {ItemNode}
         */
        this.secondaryVisualisationRootItemNode = secondaryVisualisationRootItemNode;

        /**
         * @type {SelectableBaseProperties}
         */
        this.selectableBaseProperties = selectableBaseProperties;

        /**
         * @type {SelectableColorProperties}
         */
        this.selectableColorProperties = selectableColorProperties;
    }
}
