import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProps } from 'react-navigation';
import * as actions from '../../../store/actions';
import { Artist, CategoryOfArtistModel } from '@src/core/model';
import { ArtistList } from './ArtistsList';

interface State {
  selectedLevelIndex: number;
  searchString: string;
}
interface ArtistContainerProps {
  onListArtists: () => void;
  categoryOfArtists: CategoryOfArtistModel[];
  onSetArtist: (Artist) => void;
}

interface ArtistsContainerNavigationStateParams {
  onSearchPress: () => void;
}

type Props = NavigationScreenProps & ArtistContainerProps;
class ArtistsContainer extends Component<Props, State> {
  public state: State = {
    selectedLevelIndex: 0,
    searchString: '',
  };

  private navigationKey: string = 'Artists';

  public componentWillMount() {
    this.props.onListArtists();
  }

  public onDetails(artist: Artist) {
    this.props.onSetArtist(artist);
    this.props.navigation.navigate({
      key: this.navigationKey,
      routeName: 'Artist Details',
    });
  }

  private onSearchStringChange = (searchString: string): void => {
    this.setState({ searchString });
  };

  public filteredArtists(): CategoryOfArtistModel[] {
    const { searchString } = this.state;
    if (!searchString) {
      return this.props.categoryOfArtists;
    }
    const categoryOfArtists: CategoryOfArtistModel[] = [...this.props.categoryOfArtists];
    const filtered: CategoryOfArtistModel[] = categoryOfArtists
      .map(
        (category): CategoryOfArtistModel => {
          const artists: Artist[] = category.artists.filter((artist: Artist) => {
            const term = new RegExp(searchString.toUpperCase());
            return term.test(artist.artisticName.toUpperCase());
          });
          return {
            ...category,
            artists,
          };
        },
      )
      .filter(category => category.artists.length);
    return filtered;
  }

  public render(): React.ReactNode {
    return <ArtistList onSearchStringChange={this.onSearchStringChange} categoryOfArtists={this.filteredArtists()} onDetails={artist => this.onDetails(artist)} />;
  }
}

const mapStateToProps = state => {
  return {
    categoryOfArtists: state.artist.categoryOfArtists,
  };
};

const mapDispatchToProps = dispatch => ({
  onListArtists: () => dispatch(actions.listArtists()),
  onSetArtist: (artist: Artist) => dispatch(actions.setArtist(artist)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArtistsContainer);
