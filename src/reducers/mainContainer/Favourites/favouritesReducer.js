import { FAVOURITES_ACTIONS } from '../../../utils/constants/actionConstants';
import ItemManager from '../../../utils/itemManagers/ItemManager';

const { 
    SET_FAVOURITE,
    REMOVE_FAVOURITE
 } = FAVOURITES_ACTIONS;
                                                        
const initialState = { 
    favouritesBuckets: [],
    favouritesFiles: []
};

export default function mainReducer(state = initialState, action) {
    let newState = Object.assign({}, state);
    let bucketsManager = new ItemManager(newState.favouritesBuckets);

    //TODO: we can call return after switch, and reduce lines of code
    switch(action.type) {
        case SET_FAVOURITE:
            newState.favouritesBuckets = bucketsManager.addItem(action.payload.bucket);
            return newState; 
        case REMOVE_FAVOURITE:
            newState.favouritesBuckets = bucketsManager.deleteItem(action.payload.bucket);
            return newState; 
        default:
            return state || initialState;
    }
};
