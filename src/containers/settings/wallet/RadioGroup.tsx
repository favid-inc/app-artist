import React from 'react';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Radio, RadioGroup as RadioGroupComp, RadioProps, Text } from '@kitten/ui';
import { textStyle } from '@src/components/common';
import { ViewProps, View } from 'react-native';

interface ComponentProps {
  label: string;
  value: string;
  items: string[];
  onSelect: (bank: string) => void;
}

interface State {
  selectedIndex: number;
}

export type Props = ThemedComponentProps & ViewProps & ComponentProps;

class RadioGroupComponent extends React.Component<Props, State> {
  public state: State = {
    selectedIndex: null,
  };

  public componentWillReceiveProps(nextProps) {
    if (this.state.selectedIndex) {
      return;
    }

    this.props.items.forEach((item, i) => {
      if (item === nextProps.value) {
        this.setState({ selectedIndex: i });
      }
    });
  }

  public render() {
    const { themedStyle, label, items } = this.props;
    return (
      <View style={themedStyle.detailsContainer}>
        <Text style={themedStyle.nameLabel} appearance='hint'>
          {label}
        </Text>
        <RadioGroupComp
          style={themedStyle.Selector}
          selectedIndex={this.state.selectedIndex}
          onChange={this.onSelectChange}
        >
          {items.map(this.renderRadio)}
        </RadioGroupComp>
      </View>
    );
  }
  private onSelectChange = (selectedIndex: number) => {
    this.props.onSelect(this.props.items[selectedIndex]);
    this.setState({ selectedIndex });
  };

  private renderRadio = (color: string, index: number): React.ReactElement<RadioProps> => {
    const { themedStyle } = this.props;

    return <Radio key={index} style={themedStyle.radioItem} text={color} />;
  };
}

export const RadioGroup = withStyles(RadioGroupComponent, (theme: ThemeType) => ({
  detailsContainer: { marginTop: 15, marginBottom: 20 },
  nameLabel: textStyle.headline,
  typeLabel: textStyle.paragraph,
  costLabel: {
    ...textStyle.headline,
    fontSize: 26,
    lineHeight: 32,
  },
  descriptionText: textStyle.paragraph,
  Selector: {
    marginHorizontal: 10,
  },
  radioItem: {
    marginTop: 10,
  },
  labelBottomSpace: {
    marginBottom: 16,
  },
}));
