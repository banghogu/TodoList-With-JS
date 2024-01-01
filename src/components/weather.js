import { Component } from "../core/core";

export default class Weather extends Component {
    constructor() {
        super({
            tagName: "div",
            state: {
                weather: {
                    temperature: "",
                    description: "",
                    icon: ""  // 추가: 아이콘 정보를 저장할 프로퍼티
                }
            },
        });
        this.getCurrentLocation();
    }

    getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.getWeatherData(latitude, longitude);
            },
            (error) => {
                console.error("현재 위치를 가져오는 중 오류 발생:", error);
            }
        );
    }

    getWeatherData(latitude, longitude) {
        const myApi = "4df2c44f2654a2beaee498f3dc7a1a59";
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${myApi}&units=metric`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                this.state.weather.temperature = Math.round(data.main.temp);
                this.state.weather.description = data.weather[0].description;
                this.state.weather.icon = data.weather[0].icon;  // 아이콘 정보 저장
                this.render();
            })
            .catch((error) => {
                console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
            });
    }

    render() {
        const iconURL = `http://openweathermap.org/img/wn/${this.state.weather.icon}@2x.png`;

        this.el.innerHTML = /* html */`
            <div id="weatherContainer">
            <img class="weather-icon" src="${iconURL}" alt="Weather Icon">
                <span class="temperature">${this.state.weather.temperature}°C</span>&nbsp;
                <span class="description">${this.state.weather.description}</span>
                
            </div>
        `;
    }
}