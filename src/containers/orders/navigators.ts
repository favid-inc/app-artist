import React from 'react';
import { NavigationContainer, createStackNavigator } from 'react-navigation';

import { DeclineOrderContainer } from './declineOrder';
import { RecordOrderVideoContainer } from './recordOrderVideo';
import { UploadOrderVideoContainer } from './uploadOrderVideo';
import { PlayOrderVideoContainer } from './playOrderVideo';
import { SelectOrderContainer } from './selectOrder';

export const OrdersNavigator: NavigationContainer = createStackNavigator(
  {
    SelectOrder: SelectOrderContainer,
    PlayOrderVideo: PlayOrderVideoContainer,
    RecordOrderVideo: RecordOrderVideoContainer,
    UploadOrderVideo: UploadOrderVideoContainer,
    DeclineOrder: DeclineOrderContainer,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      headerTransparent: true,
    },
  },
);
