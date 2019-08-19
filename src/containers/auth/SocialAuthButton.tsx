import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, ButtonProps } from '@kitten/ui';
import React from 'react';
import { ImageProps, ImageStyle, StyleProp } from 'react-native';

export type SocialButtonProps = ThemedComponentProps & ButtonProps;

class SocialAuthButtonComponent extends React.Component<SocialButtonProps> {
  public render(): React.ReactNode {
    const { themedStyle, ...restProps } = this.props;

    return <Button appearance='ghost' size='giant' {...restProps} icon={this.renderIcon} />;
  }
  private renderIcon = (): React.ReactElement<ImageProps> => {
    const { icon } = this.props;

    return icon({ width: 24, height: 24 });
  };
}

export const SocialButton = withStyles(SocialAuthButtonComponent, (theme: ThemeType) => ({
  icon: {},
}));
