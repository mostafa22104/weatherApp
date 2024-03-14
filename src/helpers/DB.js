import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({
 name: 'UserDatabase',
 location: 'default'
});
export default db