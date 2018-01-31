export class TabBarActionModel {
    /**
    * Describes possible actions for TabBar
    * @param {function} callback
    * @param {object} actionName - displayed name for the action
    * @param {string} icon - icon to display. F.e. require('../Images/Icons/CreateBucketIcon.png')
    */
    constructor(id, callback, actionName, icon) {
        this.id = id;
        this.callback = callback;
        this.actionName = actionName;
        this.icon = icon;
    }
}


let actionsCount = 0;
export default class TabBarActionModelFactory {
    static actionsCount = 0;

    /**
     * Create new action for TabBar
     * @param {function} callback
     * @param {object} actionName - displayed name for the action
     * @param {string} icon - icon to display. F.e. require('../Images/Icons/CreateBucketIcon.png')
     * @returns {TabBarActionModel}
     */
    static createNewAction(callback, actionName, icon) {
        const newAction = new TabBarActionModel(actionsCount, callback, actionName, icon);
        actionsCount++;

        return newAction;
    }
}

