import React from 'react';
import { Animated } from 'react-native';

interface Props {
  visible: boolean;
}

export class Fade extends React.Component<Props> {
  private visibility: Animated.Value;

  public componentWillMount() {
    this.visibility = new Animated.Value(this.props.visible ? 1 : 0);
  }

  public componentWillReceiveProps(nextProps) {
    Animated.timing(this.visibility, {
      toValue: nextProps.visible ? 1 : 0,
      duration: 300,
    });
  }

  public render() {
    const { visible, children, ...rest } = this.props;

    const containerStyle = {
      opacity: this.visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          scale: this.visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [1.1, 1],
          }),
        },
      ],
    };

    const combinedStyle = [containerStyle];
    return (
      <Animated.View style={combinedStyle} {...rest}>
        {children}
      </Animated.View>
    );
  }
}
