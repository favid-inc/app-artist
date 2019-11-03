import { PUBLIC_POLICIES } from '@favid-inc/api';
import React from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { NavigationEventSubscription, NavigationScreenProps } from 'react-navigation';

import { Markdown } from './Markdown';

type Props = NavigationScreenProps;

const markdown = PUBLIC_POLICIES.split(/\n/g);

interface State {
  markdown: string[];
}

export class PoliciesContainer extends React.Component<Props, State> {
  public state: State = {
    markdown: [],
  };

  private didFocusSubscription: NavigationEventSubscription;

  public componentDidMount() {
    const { navigation } = this.props;
    this.didFocusSubscription = navigation.addListener('didFocus', () => this.setState({ markdown }));
  }

  public componentWillUnmount() {
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove();
    }
  }

  public render() {
    return (
      <ScrollView style={{ padding: 10 }}>
        {this.state.markdown.length ? <Markdown>{this.state.markdown}</Markdown> : <ActivityIndicator size='large' />}
      </ScrollView>
    );
  }
}
