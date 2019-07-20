import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text } from 'react-native';

interface Props {}

interface State {}

export class RecordContainer extends Component<NavigationScreenProps & Props, State> {
  public render(): React.ReactNode {
    return <Text>Ola mundo</Text>;
  }
}
