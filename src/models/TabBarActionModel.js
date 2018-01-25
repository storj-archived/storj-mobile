export default class TabBarActionModel {
    /**
    * Describes possible actions for TabBar
    * @param {function} callback
    * @param {object} actionName - displayed name for the action
    * @param {string} icon - icon to display. F.e. require('../Images/Icons/CreateBucketIcon.png')
    */
    constructor(callback, actionName, icon) {
        this.callback = callback;
        this.actionName = actionName;
        this.icon = icon;
    }
}