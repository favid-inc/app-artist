import { ArtistRate } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text, Button } from '@kitten/ui';
import React from 'react';
import { View } from 'react-native';
import { FlagIconFill } from '@src/assets/icons';
import { RateBar } from '@src/components/common';
import { textStyle } from '@src/components/common/style';
interface ComponentProps {
  id: number;
  onRemove: (artistRateId: number) => void;
}
type Props = ThemedComponentProps & ArtistRate & ComponentProps;

class ArtistReviewsResumeComponent extends React.Component<Props> {
  public render() {
    const { themedStyle, message, value, customerName } = this.props;
    return (
      <View style={themedStyle.container}>
        <View style={themedStyle.row}>
          <View>
            <View style={themedStyle.row}>
              <RateBar
                style={themedStyle.rateBar}
                max={5}
                value={value}
                iconStyle={themedStyle.rateIconStyle}
                iconDisabledStyle={themedStyle.rateIconDisabledStyle}
              />
              <Text appearance='hint' style={themedStyle.customerName} numberOfLines={1}>
                {customerName}
              </Text>
            </View>
            {message && (
              <View style={themedStyle.message}>
                <Text appearance='hint' style={themedStyle.paragraph}>
                  {`"${message}"`}
                </Text>
              </View>
            )}
          </View>
          <View style={themedStyle.button}>
            <Button
              size='large'
              status='danger'
              appearance='ghost'
              icon={FlagIconFill}
              onPress={this.onRemove} />
          </View>
        </View>
      </View>
    );
  }
  private onRemove = () => {
    this.props.onRemove(this.props.id);
  }
}

export const ArtistReviewsResume = withStyles(ArtistReviewsResumeComponent, (themeType: ThemeType) => ({
  container: {
    paddingVertical: 10,
  },
  button: {
    textAlign: 'right',
  },
  rateBar: {
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'space-between',
  },
  customerName: {
    ...textStyle.paragraph,
    flexWrap: 'wrap',
    maxWidth: 160,
  },
  rateIconStyle: { width: 18, height: 18 },
  rateIconDisabledStyle: { tintColor: '#dedede', width: 15, height: 15 },
  message: {
    marginTop: 5,
  },
  paragraph: textStyle.paragraph,
}));
