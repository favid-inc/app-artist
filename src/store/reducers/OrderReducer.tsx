import { STOREORDERS, POSTORDER, POSTORDERSTARTED, POSTORDERENDED, POSTORDERERROR } from '../actions/ActionTypes';

const INITIAL_STATE = {
  orders: null,
  loading: false,
  error: null,
};


const storeOrders = (state, action) => {
  return {
    ...state,
    orders: [...action.orders],
  };
};

const postOrder = (state, action) => {
  return {
    ...state,
    order: action.order,
  };
};

const postOrderStarted = state => {
  return {
    ...state,
    loading: true,
  };
};

const postOrderEnded = state => {
  return {
    ...state,
    loading: false,
  };
};

const postOrderError = (state, action) => {
  return {
    ...state,
    loading: false,
    error: action.error,
  };
};

const orderReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case STOREORDERS:
      return storeOrders(state, action);
    case POSTORDER:
      return postOrder(state, action);
    case POSTORDERSTARTED:
      return postOrderStarted(state);
    case POSTORDERENDED:
      return postOrderEnded(state);
    case POSTORDERERROR:
      return postOrderError(state, action);
    default:
      return state;
  }
};

export default orderReducer;
