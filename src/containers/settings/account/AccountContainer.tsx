import { Artist } from '@favid-inc/api';
import React from 'react';
import { NavigationScreenProps } from 'react-navigation';

import { Account } from './Account';

type Props = NavigationScreenProps;

interface State {
  artist: Artist;
  loading: boolean;
}

export class AccountContainer extends React.Component<Props, State> {
  public state: State = {
    artist: null,
    loading: false,
  };
  public render() {
    return <Account />;
  }
}
