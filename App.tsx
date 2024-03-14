import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CitiesNames from './src/screens/CitiesNames';
import WeatherDetailes from './src/screens/WeatherDetailes';
import CityHistory from './src/screens/CityHistory';
import db from './src/helpers/DB';

const Stack = createStackNavigator();

function App() {
  db.transaction((tx: {executeSql: (arg0: string) => void}) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS CitiesNames (id INTEGER PRIMARY KEY AUTOINCREMENT, CityName TEXT, InsertionDate TEXT)',
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS CitiesDetailes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        CityId INTEGER,
        CityHistory TEXT,
        InsertionDate TEXT,
        FOREIGN KEY (CityId) REFERENCES CitiesNames(id)
      )`,
    );
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={CitiesNames}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WeatherDetailes"
          component={WeatherDetailes}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CityHistory"
          component={CityHistory}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
