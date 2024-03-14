import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import MainLayout from '../components/MainLayout';
import db from '../helpers/DB';
import {useRoute} from '@react-navigation/native';
import moment from 'moment';

function CityHistory() {
  const route = useRoute();
  const {cityTitle, cityID} = route.params;
  const [cityDetails, setCityDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCityDetails();
  }, []);

  const fetchCityDetails = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM CitiesDetailes WHERE CityId = ?',
        [cityID],
        (_, {rows}) => {
          let data = rows.raw();

          data.forEach(item => {
            item.CityHistory = JSON.parse(item.CityHistory);
            item.CityHistory.main.temp -= 273.15;
          });
          console.log('Data', data[0].CityHistory);
          setCityDetails(data);
          setIsLoading(false);
        },
        error => {
          console.error('Error fetching city details:', error);
          setIsLoading(false);
        },
      );
    });
  };

  if (isLoading) {
    return (
      <MainLayout title={cityTitle + ' historical'} showLeftHeaderIcon={true}>
        <ActivityIndicator size="large" color="#0000ff" />
      </MainLayout>
    );
  }

  return (
    <MainLayout title={cityTitle + ' historical'} showLeftHeaderIcon={true}>
      <FlatList
        data={cityDetails}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Image
              source={{
                uri: `http://openweathermap.org/img/w/${item.CityHistory.weather[0].icon}.png`,
              }}
              style={{width: 50, height: 50, marginRight: 30}}
            />
            <View>
              <Text style={{fontSize: 12, color: '#3D4548'}}>
                {moment(item.InsertionDate).format('DD.MM.YYYY - HH:mm')}
              </Text>
              <Text
                style={{fontSize: 14, fontWeight: 'bold', color: '#000000'}}>
                {item.CityHistory.weather[0].main +
                  ', ' +
                  item.CityHistory.main.temp.toFixed(2)}{' '}
                °C
              </Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
  },
});

export default CityHistory;
