import * as config from '@src/core/config';
import { LISTORDERSSTARTED, LISTORDERSENDED, POSTORDERSTARTED, POSTORDERENDED, STOREORDERS } from './ActionTypes';
import { OrderModel, ArtistModel } from '@favid-inc/api';
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
    dispatch(postOrderStarted());
    const queryParams = `?orderBy="artistId"&equalTo="${artistId}"`;
    const response = await fetch(`${config.firebase.databaseURL}/order.json${queryParams}`);
    const data = await response.json();
    let orders: OrderModel[];
    if (!data) {
      dispatch(postOrderEnded());
      return;
    }

    orders = Object.keys(data).map(orderId => ({ id: orderId, ...data[orderId] }));

    console.log('[OrderActions.tsx] listOrders(): orders: ', orders);
    dispatch(storeOrders(orders));
    dispatch(postOrderEnded());
  };
};

export const storeOrders = (orders: OrderModel[]) => {
  return {
    type: STOREORDERS,
    orders,
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
