import { Artist, ArtistCategory } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { View } from 'react-native';

import { textStyle, ValidationInput } from '@src/components/common';
import { currencyFormatter } from '@src/core/formatters';
import { NameValidator, StringValidator } from '@src/core/validators';

interface ComponentProps {
  artist: Artist;
  categories: ArtistCategory[];
  onArtisticNameChange: (val: string) => void;
  onBiographyChange: (val: string) => void;
  onCategoriesChange: (val: string[]) => void;
  onMainCategoryChange: (val: string) => void;
  onPriceChange: (val: string) => void;
}

export type Props = ThemedComponentProps & ComponentProps;

type State = Artist;

class RegisterInformationFormComponent extends React.Component<Props, State> {
  public state: State = {};

  public render() {
    const { themedStyle } = this.props;

    const { artist } = this.props;

    let categories = [];

    if (Array.isArray(this.props.categories)) {
      categories.push(...this.props.categories);
    }

    if (Array.isArray(artist.categories)) {
      categories.push(...artist.categories);
    }

    if (artist.mainCategory) {
      categories.push(artist.mainCategory);
    }

    categories = Array.from(new Set(categories));

    return (
      <View style={themedStyle.container}>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <ValidationInput
            label='Nome Artístico'
            labelStyle={textStyle.label}
            onChangeText={this.props.onArtisticNameChange}
            style={themedStyle.input}
            textStyle={[textStyle.paragraph, themedStyle.inputText]}
            validator={NameValidator}
            value={artist.artisticName}
          />
        </View>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <ValidationInput
            keyboardType='numeric'
            label='Preço'
            formatter={currencyFormatter}
            labelStyle={textStyle.label}
            onChangeText={this.props.onPriceChange}
            style={themedStyle.input}
            textStyle={[textStyle.paragraph, themedStyle.inputText]}
            validator={StringValidator}
            value={`R$ ${artist.price || 0}`}
          />
        </View>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <CategorySelector
            selectText='Categorias'
            single={false}
            value={artist.categories}
            categories={categories}
            onChange={this.props.onCategoriesChange}
            styleMainWrapper={themedStyle.input}
            styleDropdownMenu={themedStyle.input}
            styleTextDropdown={themedStyle.inputText}
            searchInputStyle={themedStyle.input}
            styleSelectorContainer={[
              themedStyle.middleContainer,
              themedStyle.profileSetting,
              { flexDirection: 'column' },
            ]}
          />
        </View>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <CategorySelector
            selectText='Categoria Principal'
            single={true}
            value={artist.mainCategory}
            categories={artist.categories}
            onChange={this.props.onMainCategoryChange}
            styleMainWrapper={themedStyle.input}
            styleDropdownMenu={themedStyle.input}
            searchInputStyle={themedStyle.input}
            styleSelectorContainer={[
              themedStyle.middleContainer,
              themedStyle.profileSetting,
              { flexDirection: 'column' },
            ]}
          />
        </View>
        <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
          <ValidationInput
            label={`Biografia (${(artist.biography && artist.biography.length) || 0}/240)`}
            labelStyle={textStyle.label}
            maxLength={240}
            multiline={true}
            numberOfLines={6}
            onChangeText={this.props.onBiographyChange}
            style={themedStyle.input}
            textStyle={[textStyle.paragraph, themedStyle.inputText]}
            validator={StringValidator}
            value={artist.biography}
          />
        </View>
      </View>
    );
  }
}

};

export const RegisterInformationForm = withStyles<ComponentProps>(RegisterInformationFormComponent, (theme: ThemeType) => ({
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
