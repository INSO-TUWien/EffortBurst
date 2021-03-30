import _ from 'lodash'
import {authors} from "./simpleData/authorNames";


export class LoggedHours {
    /**
     * @param {number} hours
     * @param {string} authorName
     */
    constructor(hours = _.random(0, 30), authorName = authors[_.random(0, 4)]){
        /**
         * @type {number}
         */
        this.hours = hours;
        /**
         * @type {string}
         */
        this.authorName = authorName;
    }
}