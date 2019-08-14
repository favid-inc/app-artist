import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import React from 'react';
import { View, ViewProps } from 'react-native';

import { textStyle } from '@src/components/common';

interface ComponentProps {
  hint?: string;
  value: string;
}

export type Props = ComponentProps & ViewProps & ThemedComponentProps;

export function InfoComponent(props: Props) {
  const { themedStyle } = this.props;
  return (
    <View style={themedStyle.container}>
      {this.props.hint && (
        <Text style={themedStyle.hint} appearance='hint'>
          {this.props.hint}
        </Text>
      )}
      <Text style={themedStyle.value} appearance='hint'>
        {this.props.value}
      </Text>
    </View>
  );
}

export const ProfileSetting = withStyles(InfoComponent, (theme: ThemeType) => ({
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
