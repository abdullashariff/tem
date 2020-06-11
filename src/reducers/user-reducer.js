import { useReducer } from "react";

const initialUserState = {
    userDetails: { username: '' },
    isLogin: false,
    permissions: null
}


export const ADD_USER_DTLS = 'ADD_USER_DTLS';

//action
export const addUserDtls = payload => ({ type: ADD_USER_DTLS, payload });

// reducer
const UserLoginDetails = (state = initialUserState, action) => {
    if (action.type === ADD_USER_DTLS) {
        return {...state, userDetails:action.payload,isLogin:true};
    } else return state;
}
export default UserLoginDetails;