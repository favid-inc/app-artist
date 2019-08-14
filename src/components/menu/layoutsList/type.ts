import { StyleType } from '@kitten/theme';
import { ThemeKey } from '@src/core/themes';
import React from 'react';
import { ImageProps } from 'react-native';

export interface LayoutsListItemData {
  title: string;
  icon: (style: StyleType, currentTheme: ThemeKey) => React.ReactElement<ImageProps>;
}
