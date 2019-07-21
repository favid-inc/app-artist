import {
  STOREORDERS,
  POSTORDER,
  POSTORDERSTARTED,
  POSTORDERENDED,
  POSTORDERERROR,
  LISTORDERSSTARTED,
  LISTORDERSENDED,
  SETCURRENTORDER,
  DELAYORDER,
} from '../actions/ActionTypes';

const INITIAL_STATE = {
  orders: null,
  currentOrder: null,
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

const listOrdersStarted = state => {
  return {
    ...state,
    loading: true,
  };
};

const listOrdersEnded = state => {
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

const setCurrentOrder = (state, action) => {
  return {
    ...state,
    currentOrder: action.order,
  };
};

const delayOrder = (state, action) => {
  const orders = state.orders.filter(order => order.id !== action.orderId);

  return {
    ...state,
    orders,
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
    case LISTORDERSSTARTED:
      return listOrdersStarted(state);
    case LISTORDERSENDED:
      return listOrdersEnded(state);
    case SETCURRENTORDER:
      return setCurrentOrder(state, action);
    case DELAYORDER:
      return delayOrder(state, action);
    default:
      return state;
  }
};

export default orderReducer;
