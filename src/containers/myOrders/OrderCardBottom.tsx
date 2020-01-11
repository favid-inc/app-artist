import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { ActivityBar, ActivityBarProps } from '@src/components/common';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

interface ComponentProps {
  textStyle?: StyleProp<TextStyle>;
}

export type OrderCardBottomProps = ThemedComponentProps & ActivityBarProps & ComponentProps;

class OrderCardBottomComponent extends React.Component<OrderCardBottomProps> {
  public render() {
    const { themedStyle, textStyle, children, ...restProps } = this.props;

    return <ActivityBar {...restProps}>{children}</ActivityBar>;
  }
}

export const OrderCardBottom = withStyles(OrderCardBottomComponent, (theme: ThemeType) => ({}));
