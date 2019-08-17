import { StyleType } from '@kitten/theme';
import { ThemeKey } from '@src/core/themes';
import React from 'react';
import { ImageProps } from 'react-native';

export interface ComponentsListItemData {
  title: string;
  icon: (style: StyleType, theme: ThemeKey) => React.ReactElement<ImageProps>;
}
