import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { UploadOrderVideo } from './UploadOrderVideo';
import { StyleSheet, View } from 'react-native';

export class UploadOrderVideoContainer extends Component<NavigationScreenProps> {
  private handleOnDone = () => {
    this.props.navigation.navigate('SelectOrder');
  };

  public render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <UploadOrderVideo onDone={this.handleOnDone} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
