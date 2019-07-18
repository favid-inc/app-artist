import React from 'react';
import { ImageSourcePropType, View, ViewProps } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Avatar, Text } from '@kitten/ui';
import { textStyle } from '@src/components/common';

interface ComponentProps {
  photo: ImageSourcePropType;
  name: string;
  location: string;
  mainCategory: string;
}

export type ProfileInfoProps = ThemedComponentProps & ViewProps & ComponentProps;

class ProfileInfoComponent extends React.Component<ProfileInfoProps> {
  public render(): React.ReactNode {
    const { style, themedStyle, photo, name, location, mainCategory, ...restProps } = this.props;

    return (
      <View style={[themedStyle.container, style]} {...restProps}>
        <Avatar style={themedStyle.profileAvatar} source={photo} />
        <Text style={themedStyle.nameLabel} category='h6'>
          {name}
        </Text>
        <Text style={themedStyle.category} appearance='hint'>
          {mainCategory}
        </Text>
      </View>
    );
  }
}

export const ProfileInfo = withStyles(ProfileInfoComponent, (theme: ThemeType) => ({
  container: {
    alignItems: 'center',
  },
  detailsContainer: {},
  nameLabel: {
    marginTop: 16,
    color: 'white',
    ...textStyle.headline,
  },
  locationLabel: {
    marginTop: 2,
    color: 'white',
  },
  profileAvatar: {
    width: 124,
    height: 124,
  },
  category: {
    color: 'white',
  },
}));
