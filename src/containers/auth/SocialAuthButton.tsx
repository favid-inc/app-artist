import { StyleType, ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, ButtonProps } from '@kitten/ui';
import React from 'react';
import { ImageProps, ImageStyle, StyleProp } from 'react-native';

interface ComponentProps {
  iconStyle?: StyleProp<ImageStyle>;
}

export type SocialButtonProps = ThemedComponentProps & ButtonProps & ComponentProps;

class SocialAuthButtonComponent extends React.Component<SocialButtonProps> {
  public render(): React.ReactNode {
    const { themedStyle, ...restProps } = this.props;

    return <Button appearance='ghost' size='giant' {...restProps} icon={this.renderIcon} />;
  }
  private renderIcon = (style: StyleType): React.ReactElement<ImageProps> => {
    const { icon, iconStyle } = this.props;

    return icon([style, iconStyle]);
  };
}

export const SocialButton = withStyles(SocialAuthButtonComponent, (theme: ThemeType) => ({
  icon: {
    width: 24,
    height: 24,
  },
}));
