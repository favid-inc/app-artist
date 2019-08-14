import { createStackNavigator, NavigationContainer } from 'react-navigation';

import { DeclineOrderContainer } from './declineOrder';
import { PlayOrderVideoContainer } from './playOrderVideo';
import { RecordOrderVideoContainer } from './recordOrderVideo';
import { SelectOrderContainer } from './selectOrder';
import { UploadOrderVideoContainer } from './uploadOrderVideo';

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
