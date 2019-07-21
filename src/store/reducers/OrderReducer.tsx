import {
  STORE_ORDERS,
  POST_ORDER,
  POST_ORDER_STARTED,
  POST_ORDER_ENDED,
  POST_ORDER_ERROR,
  LIST_ORDERS_STARTED,
  LIST_ORDER_SENDED,
  SET_CURRENT_ORDER,
  DELAY_ORDER,
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
    case STORE_ORDERS:
      return storeOrders(state, action);
    case POST_ORDER:
      return postOrder(state, action);
    case POST_ORDER_STARTED:
      return postOrderStarted(state);
    case POST_ORDER_ENDED:
      return postOrderEnded(state);
    case POST_ORDER_ERROR:
      return postOrderError(state, action);
    case LIST_ORDERS_STARTED:
      return listOrdersStarted(state);
    case LIST_ORDER_SENDED:
      return listOrdersEnded(state);
    case SET_CURRENT_ORDER:
      return setCurrentOrder(state, action);
    case DELAY_ORDER:
      return delayOrder(state, action);
    default:
      return state;
  }
};

export default orderReducer;
