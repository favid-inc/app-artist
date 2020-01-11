import React from 'react';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { ScrollView, Alert } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Reviews } from './Reviews';
import { Artist, ArtistRate } from '@favid-inc/api';
import { listArtistRates } from './listArtistRates';
import { censorArtistRate } from './censorArtistRate';
type Props = ThemedComponentProps & NavigationScreenProps;

interface State {
  artist: Artist;
  artistRates: ArtistRate[];
  loading: boolean;
  sending: boolean;
}

class ReviewsContainerComponent extends React.Component<Props, State> {

  public state: State = {
    artist: null,
    artistRates: [],
    loading: false,
    sending: false,
  };

  public async componentDidMount() {
    this.handleRefresh();
  }

  public render() {
    return (
      <ScrollView style={this.props.themedStyle.container}>
        <Reviews
          loading={this.state.loading}
          artistRates={this.state.artistRates}
          onCensorArtistRate={this.onCensorArtistRate}
          sending={this.state.sending}/>
      </ScrollView>
    );
  }

  private onCensorArtistRate = async (artistRateId: number) => {
    try {
      this.setState({loading: true});
      await censorArtistRate(artistRateId);
    } catch (e) {
      Alert.alert('Erro', e?.response?.data ?? 'Infelizmente a avaliação não pode ser reportada, tente novamente mais tarde.');
    } finally {
      this.setState({ loading: false });
      await this.handleRefresh();
    }

  };

  private handleRefresh = async () => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });

    try {
      const artist = this.props.navigation.getParam('artist');
      const artistRates = await listArtistRates();
      const rates = artistRates.map((r) => r.value).reduce((acc, cur) => acc + cur, 0) / (artistRates.length || 1);

      this.setState({
        artistRates,
        artist: {
          ...artist,
          rates,
        },
      });
    } finally {
      this.setState({ loading: false });
    }
  };
}

export const ReviewsContainer = withStyles(ReviewsContainerComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
}));
