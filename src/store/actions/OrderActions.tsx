import * as config from '@src/core/config';
import {
  LISTORDERSSTARTED,
  LISTORDERSENDED,
  POSTORDERSTARTED,
  POSTORDERENDED,
  STOREORDERS,
  SETCURRENTORDER,
  DELAYORDER,
} from './ActionTypes';
import { OrderModel, ORDER_FLOW_DECLINE } from '@favid-inc/api';

export const postOrder = order => {
  return async dispatch => {
    dispatch(postOrderStarted());
    await fetch(`${config.firebase.databaseURL}/order.json`, {
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
    const response = await fetch(`${config.firebase.databaseURL}/order.json${queryParams}`);
    const data = await response.json();
    let orders: OrderModel[];

    if (!data) {
      dispatch(listOrdersEnded());
      return;
    }

    orders = Object.keys(data)
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
    type: DELAYORDER,
    orderId,
  };
};

export const storeOrders = (orders: OrderModel[]) => {
  return {
    type: STOREORDERS,
    orders,
  };
};

export const setCurrentOrder = (order: OrderModel) => {
  return {
    type: SETCURRENTORDER,
    order,
  };
};

export const listOrdersStarted = () => {
  return {
    type: LISTORDERSSTARTED,
  };
};

export const listOrdersEnded = () => {
  return {
    type: LISTORDERSENDED,
  };
};

export const postOrderStarted = () => {
  return {
    type: POSTORDERSTARTED,
  };
};

export const postOrderEnded = () => {
  return {
    type: POSTORDERENDED,
  };
};
