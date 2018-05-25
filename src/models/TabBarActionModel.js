export class TabBarActionModel {
    /**
    * Describes possible actions for TabBar
    * @param {function} callback
    * @param {string} icon - icon to display. F.e. require('../Images/Icons/CreateBucketIcon.png')
    */
    constructor(id, callback, icon) {
        this.id = id;
        this.callback = callback;
        this.icon = icon;
    }

    changeIcon(newIcon) {
        this.icon = newIcon;
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
    static createNewAction(callback, icon) {
        const newAction = new TabBarActionModel(actionsCount, callback, icon);
        actionsCount++;

        return newAction;
    }
}

