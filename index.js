import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import axios from 'axios';
import thunk from 'redux-thunk';

//Action name constants
//const init = 'account/initUser';
const inc = 'account/increment';
const dec = 'account/decrement';
const incByAmount = 'account/incrementByAmount';
const getAccUserPending = 'account/getUser/pending';
const getAccUserFulfilled = 'account/getUser/fulfilled';
const getAccUserRejected = 'account/getUser/rejected';
const incBonus = 'bonus/increment';


//store
const store = createStore(combineReducers({
    account: accountReducer,
    bonus:bonusReducer
}), applyMiddleware(logger.default, thunk.default));//middleWare is used for delay the dispatch. it prevent the action to go to directly to the reducer. it do some api call then allow to the action to go for the reducer.

const history = [];

//reducer ... there is a previous state and it takes some action and change the state according to the action and return updated state.
function accountReducer(state = { amount: 1 }, action) {

    switch (action.type) {
        case getAccUserFulfilled:
            return { amount: action.payload, pending:false };
            case getAccUserRejected:
            return {...state, error:action.error,pending:false };
            case getAccUserPending:
            return { ...state,pending:true };
        case inc:
            return { amount: state.amount + 1 };
        case dec:
            return { amount: state.amount - 1 };
        case incByAmount:
            return { amount: state.amount + action.payload };
        default:
            return state;
    }
}

function bonusReducer(state = { points: 0 }, action) {
    switch (action.type) {
        case incBonus:
            return { points: state.points + 1 }; 
        case incByAmount:
           if(action.payload>=100)
            return { points: state.points + 1 };
            default:
                return state;
    }
}

//state.amount = state.amount+1 ...this is  wrong. we should not change the state directly.this is called mutability.

//immutability
//return {amount: state.amount+1}


//global state....to check state

//we don't have to type console.log so many times.we have this function. it will execute when state will change.
// store.subscribe(()=>{
//     history.push(store.getState())
//     console.log(history);
// })

//console.log(store.getState());


//Async API call

// async function getUser(){
//    const {data} = await axios.get('http:/localhost:3000/accounts/1')
//    console.log(data);
// }

// getUser();

process.on('uncaughtException', function (err) {
    console.log(err);
}); 






//Action Creater
 function getUserAccount(id) {
    return async (dispatch, getState)=>{
        try{
            dispatch(getAccountUserPending());
    const {data} = await axios.get(`http://localhost:3000/accounts/${id}`);
    dispatch(getAccountUserFulfilled(data.amount));
        }catch(error){
            dispatch(getAccountUserRejected(error.message));
        }
};
}

function getAccountUserFulfilled(value){
    return { type: getAccUserFulfilled, payload:value}
}
function getAccountUserRejected(error){
    return { type: getAccUserRejected, error:error}
}
function getAccountUserPending(){
    return { type: getAccUserPending}
}

function increment() {
    return { type: inc }
}
function decrement() {
    return { type: dec }
}
function incrementByAmount(value) {
    return { type: incByAmount, payload: value }
}
function incrementBonus(value) {
    return { type: incBonus }
}



//here dispatch send the action to the reducer(listener)
setTimeout(() => {
    //store.dispatch({type:'incrementByAmount' , payload:4});
    store.dispatch(getUserAccount(1));
    //store.dispatch(incrementByAmount(200))
   // store.dispatch(incrementBonus());
}, 2000);



//console.log(store.getState());















