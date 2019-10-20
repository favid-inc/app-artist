import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from '@kitten/ui';

interface ComponentProps {
  description: string;
  action: string;
  onCallAction: () => void;
}

type Props = ComponentProps & ThemedComponentProps;

class CallToActionCardComponent extends React.Component<Props> {
  public render() {
    const { themedStyle } = this.props;
    return (
      <View style={themedStyle.container}>
        <Text category='h5' style={themedStyle.description}>
          {this.props.description}
        </Text>
        {this.props.action && (
          <Button size='giant' onPress={this.props.onCallAction}>
            {this.props.action}
          </Button>
        )}
      </View>
    );
  }
}

export const CallToActionCard = withStyles(CallToActionCardComponent, (theme: ThemeType) => ({
  container: {
    backgroundColor: theme['background-basic-color-1'],
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 6,
  },
  description: {
    padding: 20,
  },
}));
