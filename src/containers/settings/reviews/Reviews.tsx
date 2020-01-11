import { ThemedComponentProps, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import React from 'react';
import { View, ViewProps, ActivityIndicator } from 'react-native';
import { ArtistReviewsResume } from './ArtistReviewsResume';
import { ArtistRate } from '@favid-inc/api';
interface ComponentProps {
  artistRates: ArtistRate[];
  onCensorArtistRate: (artistRateId: number) => void;
  sending: boolean;
  loading: boolean;
}
export type Props = ComponentProps & ThemedComponentProps & ViewProps;

class ReviewsComponent extends React.Component<Props> {

  public onCensorArtistRate = (artistRateId: number) => {
    this.props.onCensorArtistRate(artistRateId);
  }

  public render() {
    const { style, themedStyle, artistRates, loading } = this.props;

    return (
      <View style={[themedStyle.container, style]}>
        <ArtistRates
          loading={loading}
          onCensorArtistRate={this.onCensorArtistRate}
          artistRates={artistRates}
          themedStyle={themedStyle}
        ></ArtistRates>
      </View>
    );
  }
}

const ArtistRates = (props) => {
  const { themedStyle, artistRates, loading, onCensorArtistRate } = props;
  let reviewList =  <Text style={{ textAlign: 'center' }}>Nenhuma avaliação</Text>;
  if (loading) {
    reviewList = <ActivityIndicator size='large' />;
  }
  if (artistRates && artistRates.length) {
    reviewList = (
      <View>
        <Text >{`${props.artistRates.length} Avaliações`}</Text>
        {props.artistRates.map((rate, i) => <ArtistReviewsResume key={i} {...rate} onRemove={onCensorArtistRate}/>)}
      </View>
    );
  }

  return <View style={themedStyle.container}>{reviewList}</View>;
};

export const Reviews = withStyles(ReviewsComponent, () => ({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 30,
  },
}));
