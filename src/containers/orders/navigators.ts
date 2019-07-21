import { NavigationContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';

import { DeclineOrderContainer } from './declineOrder';
import { RecordOrderVideoContainer } from './recordOrderVideo';
import { UploadOrderVideoContainer } from './uploadOrderVideo';
import { PlayOrderVideoContainer } from './playOrderVideo';
import { SelectOrderContainer } from './selectOrder';

const DeclineOrderNavigator: NavigationContainer = createStackNavigator(
  { DeclineOrder: DeclineOrderContainer },
  {
    headerMode: 'screen',
    defaultNavigationOptions: { header: null },
  },
);

const AcceptOrderNavigator: NavigationContainer = createStackNavigator(
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
    SelectOrder: SelectOrderContainer,
    AcceptOrder: AcceptOrderNavigator,
    DeclineOrder: DeclineOrderNavigator,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: { header: null },
  },
);
