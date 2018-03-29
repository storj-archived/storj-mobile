export default function checkMultipleNav(state, previousState) { 

    let length = state.routes.length;

    if(length >= 2 && state.routes[length-1].routeName === state.routes[length-2].routeName) 
    {
        state = previousState;
    }

    return state;
}