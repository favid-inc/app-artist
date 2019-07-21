import * as config from '@src/core/config';
import {
  LIST_ORDERS_STARTED,
  LIST_ORDER_SENDED,
  POST_ORDER_STARTED,
  POST_ORDER_ENDED,
  STORE_ORDERS,
  SET_CURRENT_ORDER,
  DELAY_ORDER,
} from './ActionTypes';
import { OrderModel, ORDER_FLOW_DECLINE, ORDER } from '@favid-inc/api';

export const postOrder = order => {
  return async dispatch => {
    dispatch(postOrderStarted());
    await fetch(`${config.firebase.databaseURL}/${ORDER}.json`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    dispatch(postOrderEnded());
  };
};

export const listOrders = (artistId: string) => {
  return async dispatch => {
    dispatch(listOrdersStarted());

    const queryParams = `?orderBy="artistId"&equalTo="${artistId}"`;
    const response = await fetch(`${config.firebase.databaseURL}/${ORDER}.json${queryParams}`);
    const data = await response.json();
    let orders: OrderModel[];

    if (!data) {
      dispatch(listOrdersEnded());
      return;
    }

    const orders: OrderModel[] = Object.keys(data)
      .map(orderId => ({ id: orderId, ...data[orderId] }))
      .filter(order => order.status === 'OP');

    dispatch(storeOrders(orders));
    dispatch(listOrdersEnded());
  };
};

export const declineOrder = (orderId: string, artistId: string, refusedByArtistDescription: string) => {
  return async dispatch => {
    dispatch(postOrderStarted());
    await fetch(`${config.api.baseURL}/${ORDER_FLOW_DECLINE}/${orderId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refusedByArtistDescription }),
    });
    dispatch(postOrderEnded());
    dispatch(listOrders(artistId));
  };
};

export const delayOrder = (orderId: string) => {
  return {
    type: DELAY_ORDER,
    orderId,
  };
};

export const storeOrders = (orders: OrderModel[]) => {
  return {
    type: STORE_ORDERS,
    orders,
  };
};

export const setCurrentOrder = (order: OrderModel) => {
  return {
    type: SET_CURRENT_ORDER,
    order,
  };
};

export const listOrdersStarted = () => {
  return {
    type: LIST_ORDERS_STARTED,
  };
};

export const listOrdersEnded = () => {
  return {
    type: LIST_ORDER_SENDED,
  };
};

export const postOrderStarted = () => {
  return {
    type: POST_ORDER_STARTED,
  };
};

export const postOrderEnded = () => {
  return {
    type: POST_ORDER_ENDED,
  };
};
