import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import React from 'react';
import { View, ViewProps } from 'react-native';

import { textStyle } from '@src/components/common';

interface ComponentProps {
  hint?: string;
  value: string;
}

type Props = ComponentProps & ViewProps & ThemedComponentProps;

class ProfileInfoComponent extends React.Component<Props> {
  public render() {
    const { themedStyle, hint, value } = this.props;
    return (
      <View style={themedStyle.container}>
        {hint && (
          <Text style={themedStyle.hintLabel} appearance='hint'>
            {hint}
          </Text>
        )}
        <Text style={themedStyle.valueLabel} appearance='hint'>
          {value}
        </Text>
      </View>
    );
  }
}

export const ProfileInfo = withStyles<ComponentProps>(ProfileInfoComponent, (theme: ThemeType) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme['border-basic-color-2'],
  },
  hintLabel: textStyle.caption2,
  valueLabel: {
    color: theme['text-basic-color'],
    ...textStyle.caption2,
  },
}));
