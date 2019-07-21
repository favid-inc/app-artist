import { NavigationContainer, createStackNavigator } from 'react-navigation';

import { DeclineOrderContainer as DeclineOrder } from './declineOrder';
import { RecordContainer as Record } from './record';
import { UploadContainer as Upload } from './upload';
import { PlayContainer as Play } from './play';

export const DeclineOrderNavigator: NavigationContainer = createStackNavigator(
  { DeclineOrder },
  {
    headerMode: 'screen',
    defaultNavigationOptions: { header: null },
  },
);

export const AcceptOrderNavigator: NavigationContainer = createStackNavigator(
  { Record, Play, Upload },
  {
    headerMode: 'screen',
    defaultNavigationOptions: { header: null },
  },
);
