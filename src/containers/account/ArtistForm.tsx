import { Artist, ArtistCategory, ArtistRegisterStatus } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { View } from 'react-native';
import MultiSelect from 'react-native-multiple-select';

import { textStyle, ValidationInput } from '@src/components/common';
import { currencyFormatter } from '@src/core/formatters';
import { NameValidator, StringValidator } from '@src/core/validators';

interface ComponentProps {
  artist: Artist;
  categories: ArtistCategory[];
  onNameChange: (val: string) => void;
  onArtisticNameChange: (val: string) => void;
  onBiographyChange: (val: string) => void;
  onCategoriesChange: (val: string[]) => void;
  onMainCategoryChange: (val: string) => void;
  onPriceChange: (val: string) => void;
}

export type Props = ThemedComponentProps & ComponentProps;

type State = Artist;

class ArtistFormComponent extends React.Component<Props, State> {
  public state: State = {};

  // public componentWillMount() {
  //   this.setState({ ...this.props.artist });
  // }

  public render(): React.ReactNode {
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
            label='Nome'
            labelStyle={textStyle.label}
            onChangeText={this.props.onNameChange}
            style={themedStyle.input}
            textStyle={[textStyle.paragraph, themedStyle.inputText]}
            validator={NameValidator}
            value={artist.name}
          />
        </View>
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
            styleTextDropdownSelected={{ paddingHorizontal: 10 }}
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
            styleTextDropdownSelected={{ paddingHorizontal: 10 }}
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

const CategorySelector = ({ categories, value, single, onChange, ...restProps }) => {
  const items = React.useMemo(() => {
    return (categories || []).map((c) => ({ c }));
  }, [categories]);

  const selectedItems = Array.isArray(value) ? value : [value];

  const handleSelectedItemsChange = React.useCallback(
    (selection) => {
      onChange(single ? selection[0] : selection);
    },
    [onChange],
  );

  return (
    <MultiSelect
      uniqueKey='c'
      displayKey='c'
      items={items}
      selectedItems={selectedItems}
      onSelectedItemsChange={handleSelectedItemsChange}
      searchInputPlaceholderText='Pesquisar'
      single={single}
      itemTextColor='#000'
      selectedItemIconColor='#CCC'
      selectedItemTextColor='#CCC'
      submitButtonColor='#CCC'
      submitButtonText='Concluido'
      tagBorderColor='#CCC'
      tagRemoveIconColor='#CCC'
      tagTextColor='#CCC'
      {...restProps}
    />
  );
};

export const ArtistForm = withStyles<ComponentProps>(ArtistFormComponent, (theme: ThemeType) => ({
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
