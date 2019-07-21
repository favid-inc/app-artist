import React from 'react';
import { Text, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { ThemeType, withStyles, ThemedComponentProps } from 'react-native-ui-kitten/theme';
import { OrderModel } from '@favid-inc/api';

interface SwiperBoxProps {
  selectedOrderChanged: (index: number) => void;
}

type Props = SwiperBoxProps & ThemedComponentProps;

class SwiperBox extends React.Component<Props> {
  public updateSelectedOrder(i) {
    this.props.selectedOrderChanged(i);
  }

  public render(): React.ReactElement {
    const { themedStyle } = this.props;

    return (
      <Swiper
        style={themedStyle.wrapper}
        loop={false}
        showsButtons={false}
        showsPagination={false}
        index={0}
        onIndexChanged={i => this.updateSelectedOrder(i)}
      >
        {this.props.children}
      </Swiper>
    );
  }
}

export const SwiperComponent = withStyles(SwiperBox, (theme: ThemeType) => ({
  wrapper: {
    flexDirection: 'row',
    position: 'absolute',
  },
}));
