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

    const data = await Promise.resolve({
      '-Lk1DQITYoMKcmpGV_qp' : {
        'artistId' : '-LjxdP6Qy4IF8OOzHB5h',
        'gift' : true,
        'message' : 'Manda um oi pra ele plis!',
        'name' : 'Naruto',
        'price' : '7916.00',
        'theirName' : 'Sasuke',
        'userId' : 'Qcnqy1V9Wec33LLk8NFjkLscPWL2',
      },
      '-Lk1FGUS3FSy7r_kAAga' : {
        'artistId' : '-LjxdP6Qy4IF8OOzHB5h',
        'gift' : false,
        'message' : 'Shazam!',
        'name' : 'Bili Batson',
        'price' : '7916.00',
        'theirName' : '',
        'userId' : 'Qcnqy1V9Wec33LLk8NFjkLscPWL2',
      },
      '-Lk1U0YLBxRoo26hF8HF' : {
        'artistId' : '-LjxdP6Qy4IF8OOzHB5h',
        'gift' : false,
        'message' : 'assacadas Assad ',
        'name' : 'asdas',
        'price' : '7916.00',
        'theirName' : '',
        'userId' : 'Qcnqy1V9Wec33LLk8NFjkLscPWL2',
      },
      '-Lk74kCNHXIiL7n-mYL3' : {
        'artistId' : 'Qcnqy1V9Wec33LLk8NFjkLscPWL2',
        'gift' : false,
        'message' : 'fala assim : olokinho meu!',
        'name' : 'Josefino',
        'price' : '1.99',
        'refusedByArtistDescription' : 'Aaa',
        'status' : 'RA',
        'theirName' : '',
        'userId' : 'Qcnqy1V9Wec33LLk8NFjkLscPWL2',
      },
      '-Lk7CyBOqagus7EphK5c' : {
        'artistId' : 'Qcnqy1V9Wec33LLk8NFjkLscPWL2',
        'isGift' : true,
        'myName' : 'neoson',
        'price' : '1.99',
        'refusedByArtistDescription' : 'Aaa\n',
        'status' : 'RA',
        'theirName' : 'shimira',
        'userId' : 'c1MjXBoXQtSk2D0ryw9sSbltXfe2',
        'videoCreationDate' : 1563505937732,
        'videoInstructions' : 'eae shimira!',
      },
      '-LkC-zf5xMYtBEN2JevK' : {
        'artistId' : '-LjxdQ8uzN1MPW6q5L-4',
        'isGift' : false,
        'myName' : 'André ',
        'price' : '527.00',
        'status' : 'OP',
        'theirName' : '',
        'userId' : 'c1MjXBoXQtSk2D0ryw9sSbltXfe2',
        'videoCreationDate' : 1563586447618,
        'videoInstructions' : 'manda ele toma sorvete ',
      },
    });

    const orders: OrderModel[] = Object.keys(data)
      .map(orderId => ({ id: orderId, ...data[orderId] }));

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
