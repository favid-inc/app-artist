import React from 'react';
import Swiper from 'react-native-swiper';
import { ThemeType, withStyles, ThemedComponentProps } from '@kitten/theme';

interface SwiperBoxProps {
  selectedOrderChanged: (index: number) => void;
}

type Props = SwiperBoxProps & ThemedComponentProps;

export class SwiperComponent extends React.Component<Props> {
  public updateSelectedOrder(i) {
    this.props.selectedOrderChanged(i);
  }

  public render(): React.ReactElement {
    const { children } = this.props;
    return (
      <Swiper
        loop={false}
        showsButtons={false}
        showsPagination={false}
        index={0}
        onIndexChanged={i => this.updateSelectedOrder(i)}
      >
        {children}
      </Swiper>
    );
  }
}
