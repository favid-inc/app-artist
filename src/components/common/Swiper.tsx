import React from 'react';
import { Text, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { ThemeType, withStyles, ThemedComponentProps } from 'react-native-ui-kitten/theme';

class SwiperBox extends React.Component<ThemedComponentProps> {
  public updateSelectedOrder(i) {
    console.log(i);
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
        onIndexChanged={this.updateSelectedOrder}
      >
        <View style={themedStyle.slide}>
          <Text style={themedStyle.text}>1</Text>
        </View>
        <View style={themedStyle.slide}>
          <Text style={themedStyle.text}>2</Text>
        </View>
        <View style={themedStyle.slide}>
          <Text style={themedStyle.text}>3</Text>
        </View>
      </Swiper>
    );
  }
}

export const SwiperComponent = withStyles(SwiperBox, (theme: ThemeType) => ({
  wrapper: {
    flexDirection: 'row',
    position: 'absolute',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme['background-basic-color-1'],
    paddingHorizontal: 20,
    marginVertical: 30,
    marginHorizontal: 30,
    borderRadius: 5,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
}));
