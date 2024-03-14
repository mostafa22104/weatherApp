import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import MainLayout from '../components/MainLayout';
import {useRoute} from '@react-navigation/native';
import moment from 'moment';
const WeatherCard = ({item}) => {
  const {name, weather, main, wind, sys} = item;
  const {description, icon} = weather[0];
  const tempCelsius = (main.temp - 273.15).toFixed(2);
  const {humidity} = main;
  const {speed} = wind;
  const {country} = sys;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name + ', ' + country}</Text>
      <Image
        style={styles.weatherIcon}
        source={{uri: `http://openweathermap.org/img/w/${icon}.png`}}
      />
      <View style={styles.weatherContainer}>
        <View style={styles.weatherDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Description:</Text>
            <Text style={styles.detailValue}>{description}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Temperature:</Text>
            <Text style={styles.detailValue}>{tempCelsius} °C</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Humidity:</Text>
            <Text style={styles.detailValue}>{humidity} %</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Wind Speed:</Text>
            <Text style={styles.detailValue}>{speed} m/s</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

function WeatherDetailes({}) {
  const route = useRoute();
  const {item, date} = route.params;
  return (
    <MainLayout title={''} showLeftHeaderIcon={true}>
      <WeatherCard item={item} />
      <Text
        style={{
          width: '70%',
          position: 'absolute',
          bottom: 10,
          alignSelf: 'center',
          textAlign: 'center',
          fontSize: 12,
          color: '#3D4548',
        }}>
        Weather information for {item.name} received on{' '}
        {moment(item.date).format('DD.MM.YYYY - HH:mm')}
      </Text>
    </MainLayout>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 6,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: 'center',
    width: '80%',
    height: '60%',
    marginTop: -50,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    alignSelf: 'center',
    color: '#000000',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  weatherIcon: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    margin: 30,
  },
  weatherDetails: {
    marginTop: 20,
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  detailTitle: {
    fontWeight: 'bold',
    color: '#000000',
    fontSize: 14,
  },
  detailValue: {
    color: '#2388C7',
    fontSize: 20,
  },
});

export default WeatherDetailes;
