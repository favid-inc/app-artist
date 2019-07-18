import React from 'react';
import { View } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, Text } from '@kitten/ui';
import { ProfileInfo } from './profileInfo.component';
import { EvaCheckmarkOutline, PersonAddIconFill } from '@src/assets/icons';
import { Artist as ArtistModel, ProfileSocials as ProfileSocialsModel } from '@src/core/model';
import { ContainerView, ImageOverlay, textStyle, Chips } from '@src/components/common';
import { imageProfile7Bg, ImageSource } from '@src/assets/images';
import { ShowcaseSection } from '@src/components/common/showcaseSection.component';
import { ProfileSocials } from './profileSocials.component';
import * as Artist from '@favid-inc/core/lib/entities/artist';
import * as firebase from 'firebase';

interface ComponentProps {
  artist: ArtistModel;
  // socials: ProfileSocialsModel;
  cameoOrdered: boolean;
  follow: boolean;
  onFollowPress: () => void;
  onOrderPress: () => void;
  onFollowersPress: () => void;
  onFollowingPress: () => void;
  onPostsPress: () => void;
  onFriendPress: (index: number) => void;
  onPhotoPress: (index: number) => void;
}

export type Profile7Props = ThemedComponentProps & ComponentProps;

class ArtistDetailsComponent extends React.Component<Profile7Props> {
  private backgroundImage: ImageSource = imageProfile7Bg;

  public async componentDidMount() {}

  private onFollowPress = () => {
    this.props.onFollowPress();
  };

  private onOrderPress = () => {
    this.props.onOrderPress();
  };

  private onFollowersPress = () => {
    this.props.onFollowersPress();
  };

  private onFollowingPress = () => {
    this.props.onFollowingPress();
  };

  private onPostsPress = () => {
    this.props.onPostsPress();
  };

  private onFriendPress = (index: number) => {
    this.props.onFriendPress(index);
  };

  private onPhotoPress = (index: number) => {
    this.props.onPhotoPress(index);
  };

  public render(): React.ReactNode {
    const { themedStyle, artist } = this.props;
    const artistImage = {
      uri: artist.photo,
      height: 100,
      width: 100,
    };

    const socials: ProfileSocialsModel = {
      followers: 1500,
      following: 86,
      posts: 116,
    };
    const categories = artist.categories.map((cat, i) => {
      return (
        <Chips style={themedStyle.chips} key={`${cat}-${i}`}>
          <Text style={themedStyle.chipsText}>{cat}</Text>
        </Chips>
      );
    });
    const followStatus = this.props.follow ? 'white' : 'info';
    const cameoOrderedStatus = this.props.cameoOrdered ? 'white' : 'success';
    return (
      <ContainerView style={themedStyle.container}>
        <ImageOverlay style={themedStyle.profileInfoContainer} source={this.backgroundImage.imageSource}>
          <ProfileInfo photo={artistImage} name={artist.artisticName} mainCategory={artist.mainCategory} location={artist.location} />
          <View style={themedStyle.actionContainer}>
            <View style={themedStyle.price}>
              <Text category='h6' style={themedStyle.priceText}>{`R$ ${artist.price}`}</Text>
              <Text appearance='hint' category='s2' style={themedStyle.priceDescription}>
                {`Responde normalmente em até ${artist.responseTime === 1 ? 'artist.responseTime dia' : artist.responseTime + ' dias'}.`}
              </Text>
            </View>
            <Button size='giant' style={themedStyle.orderButton} status={cameoOrderedStatus} onPress={this.onOrderPress}>
              {this.props.cameoOrdered ? 'Pendente' : 'Pedir'}
            </Button>
          </View>
          <ProfileSocials style={themedStyle.profileSocials} textStyle={themedStyle.socialsLabel} followers={socials.followers} following={socials.following} posts={socials.posts} onFollowersPress={this.onFollowersPress} onFollowingPress={this.onFollowingPress} onPostsPress={this.onPostsPress} />
        </ImageOverlay>
        <View style={[themedStyle.profileSection, themedStyle.aboutSection]}>
          <ShowcaseSection title='Tags' style={themedStyle.section}>
            <View style={themedStyle.categories}>{categories}</View>
          </ShowcaseSection>
          <ShowcaseSection title='Sobre' style={themedStyle.section}>
            <Text style={[themedStyle.profileSectionContent, themedStyle.profileAboutLabel]} appearance='hint'>
              {artist.about}
            </Text>
          </ShowcaseSection>
        </View>
      </ContainerView>
    );
  }
}

export const ArtistDetails = withStyles(ArtistDetailsComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
  profileInfoContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  profileSocials: {
    justifyContent: 'space-evenly',
    paddingVertical: 15,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  profileSection: {
    marginTop: 32,
  },
  profileSectionContent: {
    marginTop: 8,
  },
  socialsLabel: {
    color: 'white',
  },
  orderButton: {
    flex: 1,
  },
  price: {
    flex: 1,
    color: 'white',
    ...textStyle.subtitle,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  priceText: {
    ...textStyle.subtitle,
    fontFamily: 'opensans-bold',
    color: 'white',
    textAlign: 'center',
  },
  priceDescription: {
    ...textStyle.paragraph,
    color: 'white',
    textAlign: 'center',
    lineHeight: 14,
  },
  profileSectionLabel: {
    marginHorizontal: 16,
    ...textStyle.subtitle,
  },
  aboutSection: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  profileAboutLabel: {
    marginHorizontal: 16,
    ...textStyle.paragraph,
  },
  shotsSection: {
    marginBottom: 22,
  },
  friendsList: {
    paddingHorizontal: 12,
  },
  chipsText: {
    color: 'white',
    ...textStyle.subtitle,
    textAlign: 'center',
    marginLeft: 5,
    marginRight: 5,
  },
  categories: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginHorizontal: 10,
    marginBottom: 3,
  },
  section: {
    paddingBottom: 30,
  },
}));
