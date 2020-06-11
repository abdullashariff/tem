import { useReducer } from "react";

const initialState = {
    workorder: {}
}

export const WORK_ORDER = 'WORK_ORDER';

//action
export const addWorkOrder = payload => ({ type: WORK_ORDER, payload });

// reducer
export const WorkorderReducer = (state = initialState, action) => {
    if (action.type === WORK_ORDER) {
        return {...state, workorderDetails:action.payload};
    } else return state;
}
export default WorkorderReducer;