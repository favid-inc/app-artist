import { MaterialIcons } from '@expo/vector-icons';
import { SocialOrder as Order } from '@favid-inc/api/lib/app-customer';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import React from 'react';
import { ImageBackground, TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';
import { textStyle, ActivityAuthoring } from '@src/components/common';
import { OrderCardBottom } from './OrderCardBottom';
import { OrderPaymentStatus as OrderPaymentStatusType } from '@favid-inc/api';
import { OrderStatus } from './OrderStatus';
import { OrderPaymentStatus} from './OrderPaymentStatus';
interface ComponentProps {
  order: Order;
  style: StyleProp<ViewStyle>;
}

interface State {
  order: Order;
  sending: boolean;
}

export type OrderCardProps = ThemedComponentProps & ComponentProps;

class OrderCardComponent extends React.Component<OrderCardProps, State> {
  public state: State = {
    order: {},
    sending: false,
  };

  public componentDidMount() {
    this.setState({ order: this.props.order });
  }

  public render() {
    const { style, themedStyle, ...restProps } = this.props;
    const { order } = this.state;
    return (
      <View {...restProps} style={[themedStyle.container, style]}>
        {order.videoThumbnailUri && (
          <TouchableOpacity style={themedStyle.parameterContainer}>
            <ImageBackground style={{ height: 220 }} source={{ uri: order.videoThumbnailUri }}>
              <MaterialIcons
                name='play-arrow'
                size={100}
                color='#FFF'
                style={{
                  textAlign: 'center',
                  top: 60,
                }}
              />
            </ImageBackground>
          </TouchableOpacity>
        )}
        <View style={themedStyle.infoContainer}>
          <View style={{ flexDirection: 'row', alignContent: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={themedStyle.descriptionLabel} appearance='hint' category='s2'>
                {order.isGift ? order.receiverName : order.customerName}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              {[OrderPaymentStatusType.PAID, OrderPaymentStatusType.AUTHORIZED].includes(order.paymentStatus) ? (
                <OrderStatus status={order.status} />
              ) : (
                <OrderPaymentStatus status={order.paymentStatus} />
              )}
            </View>
          </View>
          <Text style={themedStyle.descriptionLabel} appearance='hint' category='s1'>
            {order.instructions}
          </Text>
        </View>
        <OrderCardBottom style={themedStyle.activityContainer}>
          <ActivityAuthoring
            photo={{ uri: order.artistPhotoUri }}
            name={order.artistArtisticName}
            date={new Date(order.statusPlacedDate).toLocaleDateString()}
          />
        </OrderCardBottom>
      </View>
    );
  }

}

export const OrderCard = withStyles<ComponentProps>(OrderCardComponent, (theme: ThemeType) => ({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '94%',
    alignSelf: 'center',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme['border-basic-color-2'],
  },
  activityContainer: {
    display: 'flex',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  descriptionLabel: {
    marginTop: 16,
    ...textStyle.subtitle,
  },
  socialLabel: {
    textAlign: 'center',
  },
  socialButton: {
    marginHorizontal: 10,
  },
}));
