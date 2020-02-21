import axios from 'axios';

const instance =  axios.create({
    baseURL: 'https://react-burger-webapp-3fda0.firebaseio.com/'
});

export default instance;