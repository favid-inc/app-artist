import React from 'react';
import { Animated, ViewStyle } from 'react-native';

interface Props {
  visible: boolean;
  style?: ViewStyle;
}

interface State {
  visible: boolean;
}

export class Fade extends React.Component<Props, State> {
  private visibility: Animated.Value;

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  public componentWillMount() {
    this.visibility = new Animated.Value(this.props.visible ? 1 : 0);
  }

  public componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({ visible: true });
    }
    Animated.timing(this.visibility, {
      toValue: nextProps.visible ? 1 : 0,
      duration: 300,
    }).start(() => {
      this.setState({ visible: nextProps.visible });
    });
  }

  public render() {
    const { visible, style, children, ...rest } = this.props;

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

    const combinedStyle = [containerStyle, style];
    return (
      <Animated.View style={this.state.visible ? combinedStyle : containerStyle} {...rest}>
        {this.state.visible ? children : null}
      </Animated.View>
    );
  }
}
