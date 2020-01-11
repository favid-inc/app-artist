import { OrderPaymentStatus as OrderPaymentStatusType } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Chips, textStyle } from '@src/components/common';
import React from 'react';
import { Text } from 'react-native';

interface Props {
  status: OrderPaymentStatusType;
}

const OrderPaymentStatusComponent: React.SFC<Props & ThemedComponentProps> = (props) => {
  const { themedStyle, status } = props;

  const label = React.useMemo(() => {
    const labels = {
      [OrderPaymentStatusType.WAITING_PAYMENT]: 'Pagamento Pendente',
      [OrderPaymentStatusType.REFUSED]: 'Pagamento Recusado',
      [OrderPaymentStatusType.REFUNDED]: 'Estornado',
      [OrderPaymentStatusType.PENDING_REFUND]: 'Processando Estorno',
    };
    return labels[status] || '';
  }, [status]);

  const color = React.useMemo(() => {
    const colors = {
      [OrderPaymentStatusType.WAITING_PAYMENT]: 'danger',
      [OrderPaymentStatusType.REFUSED]: 'danger',
    };
    return colors[status] || 'disabled';
  }, [status]);

  return (
    <Chips style={[themedStyle.chips, themedStyle[color]]}>
      <Text style={themedStyle.chipsText}>{label}</Text>
    </Chips>
  );
};

export const OrderPaymentStatus = withStyles(OrderPaymentStatusComponent, (theme: ThemeType) => ({
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
