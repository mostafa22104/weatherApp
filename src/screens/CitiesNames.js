import React, {useEffect, useState} from 'react';
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MainLayout from '../components/MainLayout';
import db from '../helpers/DB';
import {Call_Weather_APi} from '../helpers/api';

function CitiesNames({}) {
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM CitiesNames', [], (_, {rows}) => {
        if (rows !== null) {
          const data = rows.raw();
          console.log('Here', data);
          setCities(data);
        }
      });
    });
  };

  const getWeather = (goToHistory, name, cityId) => {
    setIsLoading(true);

    const success = result => {
      if (result) {
        const sql =
          'INSERT INTO CitiesDetailes (CityId, CityHistory, InsertionDate) VALUES (?, ?, ?)';
        let cityHistory = JSON.stringify(result.data);

        db.transaction(tx => {
          tx.executeSql(
            sql,
            [cityId, cityHistory, new Date()],
            (tx, results) => {
              console.log('Insert successful');
              setIsLoading(false);
              if (goToHistory) {
                console.log('here 1', goToHistory);
                navigation.navigate('CityHistory', {
                  cityID: cityId,
                  cityTitle: name,
                });
              } else {
                console.log('here 2', goToHistory);
                navigation.navigate('WeatherDetailes', {
                  item: result.data,
                  date: new Date(),
                });
              }
            },
            (tx, error) => {
              console.error('Error inserting city details:', error);
              setIsLoading(false);
            },
          );
        });
      }
    };
    const failure = e => {
      Alert.alert('Error', 'City name not correct');
      const sql = 'DELETE FROM CitiesNames WHERE CityName = ?';

      db.transaction(tx => {
        tx.executeSql(
          sql,
          [name],
          (tx, results) => {
            console.log('Delete successful');
            fetchCities();
          },
          (tx, error) => {
            console.error('Error deleting city:', error);
          },
        );
      });
      setIsLoading(false);
    };

    Call_Weather_APi(name, success, failure);
  };

  const addNewCity = () => {
    if (!cityName) {
      Alert.alert('Error', 'City name cannot be empty');
      return;
    }

    const sql =
      'INSERT INTO CitiesNames (CityName, InsertionDate) VALUES (?, ?)';

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [cityName, new Date()],
        (tx, results) => {
          console.log('Insert successful');
          fetchCities();
          setModalVisible(false);
          setCityName('');
        },
        (tx, error) => {
          console.error('Error inserting city:', error);
        },
      );
    });
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => getWeather(false, item.CityName, item.id)}
          style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
          <Image
            source={require('../assets/Images/mdpi/location_city-24px.png')}
            style={{width: 30, height: 30, marginRight: 30}}
          />
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            {item.CityName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => getWeather(true, item.CityName, item.id)}
          style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
          <Image
            source={require('../assets/Images/mdpi/info-24px.png')}
            style={{width: 30, height: 30, marginRight: 10}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <MainLayout title={'Cities'} showLeftHeaderIcon={false}>
      <FlatList
        data={cities}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: 'absolute',
          bottom: 26,
          left: 26,
        }}>
        <Image
          source={require('../assets/Images/add.png')}
          style={{
            width: 50,
            height: 50,
          }}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Enter city name"
              value={cityName}
              onChangeText={setCityName}
              style={styles.input}
            />
            <Button title="Confirm" onPress={addNewCity} />
          </View>
        </View>
      </Modal>

      {/* Overlay Loading */}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeButtonText: {
    color: 'red',
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CitiesNames;
