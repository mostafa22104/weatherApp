import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  PixelRatio,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';

const MainLayout = props => {
  let {title, showLeftHeaderIcon, onLeftHeaderIconPress} = props;
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, zIndex: -999}}>
      <StatusBar backgroundColor="#2388C7" barStyle="dark-content" />
      <View
        style={{
          justifyContent: 'flex-start',
          paddingHorizontal: 6 * PixelRatio.get(),
          paddingTop: 6 * PixelRatio.get(),
          backgroundColor: '#2388C7',
          height: '20%',
        }}>
        {showLeftHeaderIcon && (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={require('../assets/Images/mdpi/arrow_back-24px.png')}
            />
          </TouchableOpacity>
        )}
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            bottom: 10 * PixelRatio.get(),
            left: 26 * PixelRatio.get(),
            position: 'absolute',
            color: '#FFFFFF',
          }}>
          {title}
        </Text>
      </View>

      <Image
        source={require('../assets/Images/xxhdpi/Group.png')}
        style={{position: 'absolute', bottom: 0, width: '100%', height: '30%'}}
      />
      {props.children}
    </View>
  );
};

export default MainLayout;
