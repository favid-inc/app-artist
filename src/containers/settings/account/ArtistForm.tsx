import { Artist } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { NameValidator, StringValidator } from '@src/core/validators';
import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { textStyle, ValidationInput } from '@src/components/common';

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
    const { themedStyle } = this.props;

    return (
      <KeyboardAwareScrollView>
        <View style={themedStyle.container}>
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <ValidationInput
              label='Nome Artístico'
              labelStyle={textStyle.label}
              onChangeText={this.handleArtisticNameChange}
              style={themedStyle.input}
              textStyle={[textStyle.paragraph, themedStyle.inputText]}
              validator={NameValidator}
              value={this.state.artisticName}
            />
          </View>
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <ValidationInput
              keyboardType='numeric'
              label='Preço'
              labelStyle={textStyle.label}
              onChangeText={this.handlePriceChange}
              style={themedStyle.input}
              textStyle={[textStyle.paragraph, themedStyle.inputText]}
              validator={StringValidator}
              value={`${this.state.price}`}
            />
          </View>
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <ValidationInput
              label='Grupo'
              labelStyle={textStyle.label}
              onChangeText={this.handleMainCategoryChange}
              style={themedStyle.input}
              textStyle={[textStyle.paragraph, themedStyle.inputText]}
              validator={NameValidator}
              value={this.state.mainCategory}
            />
          </View>
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <ValidationInput
              label={`Biografia (${this.state.biography.length}/240)`}
              labelStyle={textStyle.label}
              maxLength={240}
              multiline={true}
              numberOfLines={6}
              onChangeText={this.handleBiographyChange}
              style={themedStyle.input}
              textStyle={[textStyle.paragraph, themedStyle.inputText]}
              validator={StringValidator}
              value={this.state.biography}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }

  private handleArtisticNameChange = (artisticName = '') => this.setState({ artisticName });
  private handlePriceChange = (price = '0') => this.setState({ price: parseFloat(price) });
  private handleBiographyChange = (biography = '') => this.setState({ biography });
  private handleMainCategoryChange = (mainCategory = '') => this.setState({ mainCategory });
}

export const ArtistForm = withStyles(AccountComponent, (theme: ThemeType) => ({
  container: {
    marginTop: 24,
    backgroundColor: theme['background-basic-color-1'],
  },
  middleContainer: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
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
  text: {
    width: '100%',
    fontFamily: 'opensans-regular',
  },
}));
