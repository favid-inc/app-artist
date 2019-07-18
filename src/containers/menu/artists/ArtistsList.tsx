import React from 'react';
import { ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View, ViewProps } from 'react-native';
import { withStyles, ThemeType, ThemedComponentProps, StyleType } from '@kitten/theme';
import { Artist, CategoryOfArtistModel } from '@src/core/model';
import { ArtistCard, ArtistCardProps } from '@src/components/artist/artistCard.component';
import { List, Text, InputProps, Input } from '@kitten/ui';
import { textStyle } from '@src/components/common';
import { SearchIconOutline } from '@src/assets/icons';

interface ComponentProps {
  categoryOfArtists: CategoryOfArtistModel[];
  onDetails: (Artist) => void;
  onSearchStringChange: (text: string) => void;
}

interface State {
  selectedExerciseIndex: number;
}

export type ArtistsListComponentProps = ThemedComponentProps & ComponentProps;

class ArtistListComponent extends React.Component<ArtistsListComponentProps, State> {
  public state: State = {
    selectedExerciseIndex: 0,
  };

  private onExerciseListScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { themedStyle } = this.props;

    const { x: xOffset } = event.nativeEvent.contentOffset;
    const { width: itemWidth } = themedStyle.pagerCard;

    const selectedExerciseIndex: number = Math.round(xOffset / itemWidth);

    if (selectedExerciseIndex !== this.state.selectedExerciseIndex) {
      this.setState({ selectedExerciseIndex });
    }
  };

  private renderPagerCard = (info: ListRenderItemInfo<Artist>): React.ReactElement<ArtistCardProps> => {
    const { themedStyle, categoryOfArtists } = this.props;

    const marginStyle: StyleType = info.index === categoryOfArtists[0].artists.length - 1 ? null : themedStyle.pagerCardMargin;

    return <ArtistCard index={info.index} style={[themedStyle.pagerCard, marginStyle]} artist={info.item} onDetails={this.props.onDetails} />;
  };

  private onSearchStringChange = (text: string): void => {
    this.props.onSearchStringChange(text);
  };

  private renderSearchInput = (): React.ReactElement<InputProps> | null => {
    const { themedStyle } = this.props;

    return <Input style={themedStyle.input} textStyle={textStyle.paragraph} icon={SearchIconOutline} placeholder='Search Artist...' onChangeText={this.onSearchStringChange} />;
  };

  public render(): React.ReactNode {
    const { themedStyle } = this.props;
    let categoryList: React.ReactNode = <Text>Loading...</Text>;
    if (this.props.categoryOfArtists) {
      categoryList = this.props.categoryOfArtists.map(artistsList => {
        return (
          <View key={artistsList.key}>
            <Text style={themedStyle.pagerLabel} appearance='hint'>
              {artistsList.key}
            </Text>
            <List style={themedStyle.pagerContainer} horizontal={true} renderItem={this.renderPagerCard} data={artistsList.artists} showsHorizontalScrollIndicator={false} onScroll={this.onExerciseListScroll} />
          </View>
        );
      });
    }
    return (
      <View style={themedStyle.container}>
        {this.renderSearchInput()}
        <ScrollView contentContainerStyle={themedStyle.container}>{categoryList}</ScrollView>
      </View>
    );
  }
}

export const ArtistList = withStyles(ArtistListComponent, (theme: ThemeType) => ({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  pagerContainer: {
    marginVertical: 8,
  },
  pagerLabel: {
    marginVertical: 16,
    ...textStyle.paragraph,
  },
  pagerCard: {
    width: 226,
  },
  listCard: {
    marginVertical: 8,
  },
  pagerCardMargin: {
    marginRight: 16,
  },
  pagerIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  pagerIndicatorSelected: {
    backgroundColor: theme['background-basic-color-4'],
  },
  indicatorMarginRight: {
    marginRight: 12,
  },
  input: {
    marginHorizontal: 10,
  },
}));
