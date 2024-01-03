import { Store } from "../core/core";

const store = new Store({
    weatherData: {
        temp: 0,
        feels_like: 0,
        humidity: 0,
        desc: '',
        icon: '',
        loading: true,
    }
});

export default store;
 