import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProps } from 'react-navigation';
import { Profile } from '@src/core/model';

import { Account } from '@src/containers/menu/account/Account';
import * as actions from '../../../store/actions';
import { ImageSource } from '@src/assets/images';
import { Text } from 'react-native';
import { AuthState as AuthStateModel } from '@src/core/model/authState.model';

interface State {
  profile: Profile;
}

interface AccountContainerProps {
  auth: AuthStateModel;
  onSignOut: () => void;
}

type Props = NavigationScreenProps & AccountContainerProps;

class AccountContainer extends Component<Props, State> {
  public state: State = {
    profile: null,
  };

  private onUploadPhotoButtonPress = () => {};

  private onButtonPress = () => {
    this.props.navigation.goBack();
  };

  public componentDidMount() {
    if (!this.props.auth.displayName) {
      console.log('[AccountContainer.tsx] componentDidMount', this.props.auth);
      return this.props.onSignOut();
    }
    this.setState(prevState => {
      const imageSource = {
        uri: this.props.auth.photoURL,
        height: 100,
        width: 100,
      };
      const profile: Profile = {
        firstName: this.props.auth.displayName.split(' ')[0],
        lastName: this.props.auth.displayName.split(' ')[1],
        photo: { imageSource },
        email: this.props.auth.email,
      };

      return {
        profile,
      };
    });
  }

  public render(): React.ReactNode {
    let account = <Text>Loading...</Text>;
    if (this.state.profile) {
      account = <Account profile={this.state.profile} onUploadPhotoButtonPress={this.onUploadPhotoButtonPress} onButtonPress={this.props.onSignOut} />;
    }
    return account;
  }
}

const mapStateToProps = ({ auth }) => ({ auth: auth.authState });
const mapDispatchToProps = dispatch => ({
  onSignOut: () => dispatch(actions.signOut()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountContainer);
