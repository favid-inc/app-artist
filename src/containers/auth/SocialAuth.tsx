import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import React from 'react';
import { ImageStyle, StyleProp, TextProps, TextStyle, View, ViewProps } from 'react-native';

import { FacebookIconFill, GoogleIconFill } from '@src/assets/icons';
import { textStyle } from '@src/components/common';

import { SocialButton } from './SocialAuthButton';

interface ComponentProps {
  hint?: string;
  hintStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  onGoogleSignIn: () => void;
  onFacebookSignIn: () => void;
}

export type SocialAuthProps = ThemedComponentProps & ViewProps & ComponentProps;

class SocialAuthComponent extends React.Component<SocialAuthProps> {
  public render(): React.ReactNode {
    const { themedStyle, hintStyle, iconStyle, hint, ...restProps } = this.props;
    const { buttonContainer, ...componentStyle } = themedStyle;

    return (
      <View {...restProps}>
        {hint ? this.renderCaptionElement([componentStyle.hint, hintStyle]) : null}
        <View style={buttonContainer}>
          <SocialButton
            activeOpacity={0.75}
            icon={GoogleIconFill}
            iconStyle={iconStyle}
            onPress={this.props.onGoogleSignIn}
          />
          <SocialButton
            activeOpacity={0.75}
            icon={FacebookIconFill}
            iconStyle={iconStyle}
            onPress={this.props.onFacebookSignIn}
          />
        </View>
      </View>
    );
  }
  private renderCaptionElement = (style: StyleProp<TextStyle>): React.ReactElement<TextProps> => {
    const { hint } = this.props;

    return <Text style={style}>{hint}</Text>;
  };
}

export const SocialAuth = withStyles(SocialAuthComponent, (theme: ThemeType) => ({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  hint: {
    alignSelf: 'center',
    marginBottom: 16,
    ...textStyle.subtitle,
  },
}));
