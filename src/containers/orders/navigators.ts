import { NavigationContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';

import { DeclineOrderContainer } from './declineOrder';
import { RecordOrderVideoContainer } from './recordOrderVideo';
import { UploadOrderVideoContainer } from './uploadOrderVideo';
import { PlayOrderVideoContainer } from './playOrderVideo';

export const DeclineOrderNavigator: NavigationContainer = createStackNavigator(
  { DeclineOrder: DeclineOrderContainer },
  {
    headerMode: 'screen',
    defaultNavigationOptions: { header: null },
  },
);

export const AcceptOrderNavigator: NavigationContainer = createStackNavigator(
  {
    RecordOrderVideo: RecordOrderVideoContainer,
    PlayOrderVideo: PlayOrderVideoContainer,
    UploadOrderVideo: UploadOrderVideoContainer,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: { header: null },
  },
);

export const OrdersNavigator: NavigationContainer = createStackNavigator(
  {
    AcceptOrder: AcceptOrderNavigator,
    DeclineOrder: DeclineOrderNavigator,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: { header: null },
  },
);
