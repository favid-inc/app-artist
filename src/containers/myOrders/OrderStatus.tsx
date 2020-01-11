import { OrderStatus as OrderStatusType } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Chips, textStyle } from '@src/components/common';
import React from 'react';
import { Text } from 'react-native';

interface Props {
  status: OrderStatusType;
}

const OrderStatusComponent: React.SFC<Props & ThemedComponentProps> = (props) => {
  const { status, themedStyle } = props;

  const label = React.useMemo(() => {
    const labels = {
      [OrderStatusType.PLACED]: 'Pendente',
      [OrderStatusType.DECLINED]: 'Recusado',
      [OrderStatusType.FULFILLED]: 'Concluído',
    };
    return labels[status] || '';
  }, [status]);

  const color = React.useMemo(() => {
    const colors = {
      [OrderStatusType.PLACED]: 'info',
      [OrderStatusType.DECLINED]: 'danger',
      [OrderStatusType.FULFILLED]: 'success',
    };
    return colors[status] || 'disabled';
  }, [status]);

  return (
    <Chips style={[themedStyle.chips, themedStyle[color]]}>
      <Text style={themedStyle.chipsText}>{label}</Text>
    </Chips>
  );
};

export const OrderStatus = withStyles(OrderStatusComponent, (theme: ThemeType) => ({
  success: {
    backgroundColor: theme['color-success-default'],
  },
  danger: {
    backgroundColor: theme['color-danger-default'],
  },
  info: {
    backgroundColor: theme['color-info-default'],
  },
  disabled: {
    backgroundColor: theme['color-primary-disabled'],
  },
  chips: {
    width: 110,
    flexGrow: 1,
    textAlign: 'center',
  },
  chipsText: {
    color: 'white',
    ...textStyle.subtitle,
    textAlign: 'center',
    marginLeft: 5,
    marginRight: 5,
  },
}));
