import { Component } from "../core/core";
import store from "../store/weather"

export default class Weather extends Component {
    constructor() {
        super({
            tagName: "div",
        });
        this.getWeatherData();
    }

    getWeatherData() {
        const cityName = 'Seoul';
        const apikey = "4df2c44f2654a2beaee498f3dc7a1a59"
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apikey}`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                const newWeatherData = {
                    temp: data.main.temp,
                    feels_like: data.main.feels_like,
                    humidity: data.main.humidity,
                    desc: data.weather[0].description,
                    icon: data.weather[0].icon,
                    loading: false,
                };

                store.setState({
                    weatherData: newWeatherData,
                });
                this.render();
            })
            .catch((error) => {
                console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
            });
    }

    render() {
        const imgSrc = `https://openweathermap.com/img/w/${store.state.weatherData.icon}.png`;
        const humidityIconSrc = 'https://png.pngtree.com/png-clipart/20190614/original/pngtree-humidity-vector-icon-png-image_3725331.jpg';
        this.el.innerHTML = /* html */`
            <div class="Wrapper">
                <div class="SpaceAround">
                    <div class="TempDiv">
                        <p>${(store.state.weatherData.temp - 273.15).toFixed(0)}°</p>
                    </div>
                    <div class="WeatherWrapper">
                        <div class="ImgFlex">
                            <img src="${imgSrc}" alt="Weather Icon">
                        </div>
                        <p>${store.state.weatherData.desc}</p>
                    </div>
                </div>
                <div class="SpaceAround">
                    <p>체감온도: ${(store.state.weatherData.feels_like - 273.15).toFixed(0)}° </p>
                    <p class="hum"><span class="slDrop"><img src="${humidityIconSrc}" alt="Humidity Icon"></span><span class="hum-degree">${store.state.weatherData.humidity}%</span></p>
                </div>
            </div>`;
    }
}
