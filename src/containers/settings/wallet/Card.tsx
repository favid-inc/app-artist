import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { View } from 'react-native';

interface ComponentProps {
  children: React.ReactNode;
}

type Props = ComponentProps & ThemedComponentProps;

class CardComponent extends React.Component<Props> {
  public render() {
    const { themedStyle } = this.props;
    return <View style={themedStyle.walletCard}>{this.props.children}</View>;
  }
}

export const Card = withStyles(CardComponent, (theme: ThemeType) => ({
  walletCard: {
    backgroundColor: theme['background-basic-color-1'],
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 6,
  },
}));
