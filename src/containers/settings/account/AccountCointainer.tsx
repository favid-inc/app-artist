import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProps } from 'react-navigation';
import { Profile } from '@src/core/model';

import { Account } from './Account';
import * as actions from '../../../store/actions';

import { AuthState as AuthStateModel } from '@src/core/model/authState.model';
import { ArtistModel } from '@favid-inc/api';

interface AccountContainerProps {
  artist: ArtistModel;
  loading: boolean;
  onPutArtist: (artist: ArtistModel, artistId: string) => void;
}

type Props = NavigationScreenProps & AccountContainerProps;

class AccountContainerComponent extends Component<Props> {
  private onUploadPhotoButtonPress = () => {};

  private onSave = (artist: ArtistModel) => {
    this.props.onPutArtist(artist, artist.id);
  };

  public componentDidMount() {
    this.setState(prevState => {
      const imageSource = {
        uri: this.props.artist.photo,
        height: 100,
        width: 100,
      };
      const profile: Profile = {
        firstName: this.props.artist.name.split(' ')[0],
        lastName: this.props.artist.name.split(' ')[1],
        photo: { imageSource },
        email: this.props.artist.email,
      };

      return {
        profile,
      };
    });
  }

  public render(): React.ReactNode {
    return (
      <Account
        artist={this.props.artist}
        onUploadPhotoButtonPress={this.onUploadPhotoButtonPress}
        onSave={this.onSave}
        loading={this.props.loading}
      />
    );
  }
}

const mapStateToProps = ({ artist }) => ({
  artist: artist.artist,
});
const mapDispatchToProps = dispatch => ({
  onPutArtist: (artist: ArtistModel, artistId: string) => dispatch(actions.putArtist(artist, artistId)),
});

export const AccountContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountContainerComponent);
