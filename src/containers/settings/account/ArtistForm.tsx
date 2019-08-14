import { Artist } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, Text } from '@kitten/ui';
import { CameraIconFill } from '@src/assets/icons';
import { NameValidator, StringValidator } from '@src/core/validators';
import React from 'react';
import { ButtonProps, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ProfileSetting } from './ProfileInfo';
import { ProfilePhoto } from './ProfilePhoto';

import { ContainerView, textStyle, ValidationInput } from '@src/components/common';

interface ComponentProps {
  artist: Artist;
}

export type Props = ThemedComponentProps & ComponentProps;

type State = Artist;

class AccountComponent extends React.Component<Props, State> {
  public state: State = {};

  public componentWillMount() {
    this.setState({ ...this.props.artist });
  }

  public render(): React.ReactNode {
    const { themedStyle, artist } = this.props;

    return (
      <KeyboardAwareScrollView>
        <View style={themedStyle.container}>
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <ValidationInput
              value={this.state.artisticName}
              style={themedStyle.input}
              textStyle={[textStyle.paragraph, themedStyle.inputText]}
              labelStyle={textStyle.label}
              placeholder='Nome Artístico'
              validator={NameValidator}
              onChangeText={this.handleArtisticNameChange}
            />
          </View>
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <ValidationInput
              value={`${this.state.price}`}
              style={themedStyle.input}
              textStyle={[textStyle.paragraph, themedStyle.inputText]}
              labelStyle={textStyle.label}
              placeholder='Preço'
              validator={StringValidator}
              onChangeText={this.handlePriceChange}
            />
          </View>
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <ValidationInput
              value={this.state.mainCategory}
              style={themedStyle.input}
              textStyle={[textStyle.paragraph, themedStyle.inputText]}
              labelStyle={textStyle.label}
              placeholder='Grupo'
              validator={NameValidator}
              onChangeText={this.handleMainCategoryChange}
            />
          </View>
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <TextInput
              style={themedStyle.inputMultiLine}
              multiline={true}
              numberOfLines={4}
              placeholderTextColor='#8893ab'
              placeholder='Biografia'
              maxLength={240}
              onChangeText={this.handleBiographyChange}
              value={this.state.biography}
            />
          </View>
          <Text appearance='hint' style={themedStyle.text}>
            {`${240 - this.state.biography.length} Caracteres restantes`}
          </Text>
        </View>
      </KeyboardAwareScrollView>
    );
  }

  private handleArtisticNameChange = (artisticName) => this.setState({ artisticName });
  private handlePriceChange = (price) => this.setState({ price: parseFloat(price) });
  private handleBiographyChange = (biography) => this.setState({ biography });
  private handleMainCategoryChange = (mainCategory) => this.setState({ mainCategory });
}

export const ArtistForm = withStyles(AccountComponent, (theme: ThemeType) => ({
  container: {
    marginTop: 24,
    backgroundColor: theme['background-basic-color-1'],
  },
  middleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  inputText: {
    color: theme['text-alternative-color'],
  },
  input: {
    flexWrap: 'wrap',
    flex: 1,
    backgroundColor: theme['background-alternative-color-1'],
    borderColor: theme['text-alternative-color'],
  },
  inputMultiLine: {
    flexWrap: 'wrap',
    flex: 1,
    backgroundColor: theme['background-alternative-color-1'],
    height: 150,
    borderRadius: 5,
    borderColor: theme['text-alternative-color'],
    borderWidth: 1,
    padding: 10,
    fontSize: 17,
    fontFamily: 'opensans-regular',
    width: '100%',
  },
  text: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'opensans-regular',
  },
}));
