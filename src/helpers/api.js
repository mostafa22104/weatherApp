import axios from 'axios';
export const Call_Weather_APi=(cityName,Success,Faulier)=>{
  axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      q: cityName,
      appid: 'f5cb0b965ea1564c50c6f1b74534d823'
    }
  })
  .then(response => {
   
    Success(response)
  })
  .catch(error => {
  Faulier(error)
    console.error('There was a problem with the axios request:', error);
  });
}
