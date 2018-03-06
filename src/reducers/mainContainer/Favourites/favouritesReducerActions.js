import { FAVOURITES_ACTIONS } from '../../../utils/constants/actionConstants';

const { 
    SET_FAVOURITE,
    REMOVE_FAVOURITE
 } = FAVOURITES_ACTIONS;

function setFavourite(bucket) {
    return { type: SET_FAVOURITE, payload: { bucket } } 
}

function removeFavourite(bucket) {
    return { type: REMOVE_FAVOURITE, payload: { bucket } } 
}

export const favouritesActions = {
    setFavourite,
    removeFavourite
}