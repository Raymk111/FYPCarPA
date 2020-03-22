import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

import CustomDash from './customDash';
import StatsDash from './statsDash';
import Settings from './Settings';
import WidgetsSettings from './WidgetSettings';

import MenuDrawer from './components/MenuDrawer';

const WIDTH = Dimensions.get('window').width;

const DrawerConfig = {
	drawerWidth: WIDTH*0.50,
	contentComponent: ({ navigation }) => {
		return(<MenuDrawer navigation={navigation} />)
	}
}

const DrawerNavigator =  createDrawerNavigator(
               {
                   customDash:
                   {
                    screen: CustomDash
                   },
                   settings:
                   {
                    screen: Settings
                   },
                   widgets:
                   {
                    screen: WidgetsSettings
                   },
                   defaultDash:
                   {
                    screen: StatsDash
                   }
               },
               DrawerConfig
);

export default createAppContainer(DrawerNavigator);