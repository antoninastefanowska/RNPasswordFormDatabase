import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainView from './views/MainView'
import FormView from './views/FormView';
import ResultView from './views/ResultView';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainView">
        <Stack.Screen name="Main" component={MainView} />
        <Stack.Screen name="Form" component={FormView} />
        <Stack.Screen name="Result" component={ResultView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
