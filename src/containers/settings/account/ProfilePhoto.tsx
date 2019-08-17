import { ThemeType, withStyles } from '@kitten/theme';
import { Avatar, AvatarProps, ButtonProps } from '@kitten/ui';
import React from 'react';
import { View } from 'react-native';

interface ComponentProps {
  button?: () => React.ReactElement<ButtonProps>;
}

export type ProfilePhotoProps = ComponentProps & AvatarProps;

class ProfilePhotoComponent extends React.Component<ProfilePhotoProps> {
  public render() {
    const { style, themedStyle, button, ...restProps } = this.props;

    return (
      <View style={style}>
        <Avatar style={[style, themedStyle.avatar]} {...restProps} />
        {button ? this.renderEditElement() : null}
      </View>
    );
  }
  private renderEditElement = (): React.ReactElement<ButtonProps> => {
    const buttonElement: React.ReactElement<ButtonProps> = this.props.button();

    return React.cloneElement(buttonElement, {
      style: [buttonElement.props.style, this.props.themedStyle.editButton],
    });
  };
}

export const ProfilePhoto = withStyles(ProfilePhotoComponent, (theme: ThemeType) => ({
  avatar: {
    alignSelf: 'center',
  },
  editButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
  },
}));
