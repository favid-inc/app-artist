import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { UploadOrderVideo } from './UploadOrderVideo';

export class UploadOrderVideoContainer extends Component<NavigationScreenProps> {
  public render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <UploadOrderVideo onDone={this.handleOnDone} />
      </View>
    );
  }
  private handleOnDone = () => {
    this.props.navigation.navigate('SelectOrder');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
