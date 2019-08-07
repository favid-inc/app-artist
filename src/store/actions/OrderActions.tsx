import * as config from '@src/core/config';
import {
  LIST_ORDERS_STARTED,
  LIST_ORDER_SENDED,
  POST_ORDER_STARTED,
  POST_ORDER_ENDED,
  STORE_ORDERS,
  SET_CURRENT_ORDER,
  DELAY_ORDER,
  ORDER_ERROR,
} from './ActionTypes';

import { OrderModel, ORDER, OrderFlow, OrderStatus, OrderFlowDeclineOrderArguments } from '@favid-inc/api';

export const listOrders = (artistId: string) => {
  return async dispatch => {
    dispatch(listOrdersStarted());

    // const queryParams = `?orderBy="artistId"&equalTo="${artistId}"`;
    const response = await fetch(`${config.firebase.databaseURL}/${ORDER}.json`);

    const data: { [key: string]: OrderModel } = await response.json();
    const orders: OrderModel[] = Object.values(data).filter(
      o => o.artistId === artistId && o.status === OrderStatus.OPENED,
    );

    dispatch(storeOrders(orders));
    dispatch(listOrdersEnded());
  };
};

export const declineOrder = (order: OrderModel, idToken) => {
  return async dispatch => {
    dispatch(postOrderStarted());
    try {
      const response = await fetch(`${config.api.baseURL}/${OrderFlow.DECLINE}/${order.id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(order as OrderFlowDeclineOrderArguments),
      });

      if (!response.ok) {
        console.log('[OrderActions.tsx] declineOrder() response:', response);
        const errorMessage = response.status === 403 ? 'Sua sessão expirou.' : 'Erro interno do servidor.';
        throw Error(errorMessage);
      }

      dispatch(postOrderEnded());
      dispatch(listOrders(order.artistId));
    } catch (error) {
      dispatch(
        orderError({ message: error ? error : 'Não foi possivel recusar o pedido, tente novamente mais tarde.' }),
      );
    }
  };
};

export const delayOrder = (orderId: string) => {
  return {
    type: DELAY_ORDER,
    orderId,
  };
};
export const orderError = error => ({
  type: ORDER_ERROR,
  error,
});
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
