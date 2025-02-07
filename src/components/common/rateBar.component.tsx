import { StyleType, ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import { StarIconFill } from '@src/assets/icons';
import { textStyle } from '@src/components/common/style';
import React from 'react';
import {
  ImageProps,
  ImageStyle,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';

interface ComponentProps {
  hint?: string;
  value?: number;
  max?: number;
  icon?: (style: StyleType) => React.ReactElement<ImageProps>;
  iconStyle?: StyleProp<ImageStyle>;
  hintStyle?: StyleProp<TextStyle>;
  iconDisabledStyle?: StyleProp<ImageStyle>;
  onChange?: (value: number) => void;
}

export type RateBarProps = ThemedComponentProps & ViewProps & ComponentProps;

class RateBarComponent extends React.Component<RateBarProps> {
  static defaultProps: Partial<RateBarProps> = {
    icon: StarIconFill,
    value: 0,
    max: 5,
  };

  public render() {
    const { style, themedStyle, hint, ...restProps } = this.props;
    const { container, ...componentStyle } = themedStyle;

    const componentChildren = this.renderComponentChildren(componentStyle);

    return (
      <View {...restProps} style={[container, style]}>
        {componentChildren}
      </View>
    );
  }

  private onRateButtonPress = (index: number) => {
    if (this.props.onChange) {
      this.props.onChange(index);
    }
  };

  private renderHintElement = (style: StyleType) => {
    const { hintStyle } = this.props;

    return (
      <Text key={0} style={[style, hintStyle]} appearance='hint'>
        {this.props.hint}
      </Text>
    );
  };

  private renderRateIconElement = (style: StyleType, index: number) => {
    const { value, icon, iconStyle, iconDisabledStyle } = this.props;

    const iconElement = icon(style.icon);

    const isEnabled = index < value;
    const stateStyle = isEnabled ? style.iconEnabled : style.iconDisabled;
    const derivedStateStyle = isEnabled ? iconStyle : iconDisabledStyle;

    return React.cloneElement(iconElement, {
      style: [style.icon, iconElement.props.style, stateStyle, derivedStateStyle],
    });
  };

  private renderRateButtonElement = (style: StyleType, index: number) => {
    const iconElement = this.renderRateIconElement(style, index);

    return (
      <TouchableOpacity key={index} activeOpacity={0.65} onPress={() => this.onRateButtonPress(index)}>
        {iconElement}
      </TouchableOpacity>
    );
  };

  private renderRateBar = (style: StyleType) => {
    const rates: Array<React.ReactElement<TouchableOpacityProps>> = [];

    for (let index = 0; index < this.props.max; index++) {
      const rateElement = this.renderRateButtonElement(style, index);
      rates.push(rateElement);
    }

    return rates;
  };

  private renderComponentChildren = (style: StyleType) => {
    const { hint } = this.props;
    const { hint: hintStyle, ...rateBarStyle } = style;

    return [hint ? this.renderHintElement(style.hint) : null, this.renderRateBar(rateBarStyle)];
  };
}

export const RateBar = withStyles(RateBarComponent, (theme: ThemeType) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hint: {
    marginRight: 8,
    ...textStyle.caption2,
  },
  icon: {
    width: 16,
    height: 16,
  },
  iconEnabled: {
    tintColor: theme['color-warning-default'],
  },
  iconDisabled: {
    tintColor: theme['color-basic-default'],
  },
}));
