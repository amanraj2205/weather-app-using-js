const cityInput = document.querySelector('.city-input');
const errorMessage = document.getElementById('error-message');
const weatherDisplay = document.getElementById('weather-display');

const API_KEY = "b0f3d5450d3f3a364bd62cf12115b6ce";

// Map OpenWeather icons to higher quality Weatherbit icons for premium UI
const iconMap = {
    "01d": "https://www.weatherbit.io/static/img/icons/c01d.png", // Clear day
    "01n": "https://www.weatherbit.io/static/img/icons/c01n.png", // Clear night
    "02d": "https://www.weatherbit.io/static/img/icons/c02d.png", // Few clouds day
    "02n": "https://www.weatherbit.io/static/img/icons/c02n.png", // Few clouds night
    "03d": "https://www.weatherbit.io/static/img/icons/c03d.png", // Scattered clouds day
    "03n": "https://www.weatherbit.io/static/img/icons/c03n.png", // Scattered clouds night
    "04d": "https://www.weatherbit.io/static/img/icons/c04d.png", // Broken clouds day
    "04n": "https://www.weatherbit.io/static/img/icons/c04n.png", // Broken clouds night
    "09d": "https://www.weatherbit.io/static/img/icons/r03d.png", // Shower rain day
    "09n": "https://www.weatherbit.io/static/img/icons/r03n.png", // Shower rain night
    "10d": "https://www.weatherbit.io/static/img/icons/r01d.png", // Rain day
    "10n": "https://www.weatherbit.io/static/img/icons/r01n.png", // Rain night
    "11d": "https://www.weatherbit.io/static/img/icons/t01d.png", // Thunderstorm day
    "11n": "https://www.weatherbit.io/static/img/icons/t01n.png", // Thunderstorm night
    "13d": "https://www.weatherbit.io/static/img/icons/s01d.png", // Snow day
    "13n": "https://www.weatherbit.io/static/img/icons/s01n.png", // Snow night
    "50d": "https://www.weatherbit.io/static/img/icons/a01d.png", // Mist day
    "50n": "https://www.weatherbit.io/static/img/icons/a01n.png", // Mist night
};

// Listen for 'Enter' key press to search
cityInput.addEventListener("keyup", async (event) => {
    if (event.key === "Enter") {
        const city = cityInput.value.trim();
        if (!city) return;

        // Hide old error message
        showError("");
        weatherDisplay.classList.remove("active");

        try {
            const weatherData = await getFetchData(city);
            displayWeatherData(weatherData);
        } catch (error) {
            console.error(error);
            showError("City not found. Please try again.");
        }
        cityInput.value = ""; // clear input field
        cityInput.blur(); // dismiss keyboard
    }
});

function showError(msg) {
    if (msg) {
        errorMessage.querySelector("p").textContent = msg;
        errorMessage.classList.add("active");
    } else {
        errorMessage.classList.remove("active");
    }
}

async function getFetchData(city) {
    const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await fetch(apiurl);

    if (!response.ok) {
        throw new Error("City not found");
    }
    const data = await response.json();
    return data;
}

function displayWeatherData(data) {
    const cityNameDisplay = document.querySelector('.cityName');
    const temperatureDisplay = document.querySelector('.temp-txt');
    const conditionDisplay = document.querySelector('.condition-txt');
    const humiditvalueDispaly = document.querySelector('.humidity-value-txt');
    const windvalueDisplay = document.querySelector('.wind-value-txt');
    const weatherIconImg = document.getElementById('main-weather-icon');

    const { name, main, weather, wind } = data;

    cityNameDisplay.textContent = name;
    temperatureDisplay.innerHTML = `${Math.round(main.temp)}<span class="celsius">°C</span>`;
    conditionDisplay.textContent = weather[0].description;
    humiditvalueDispaly.textContent = `${main.humidity}%`;
    windvalueDisplay.textContent = `${Math.round(wind.speed)} m/s`;

    // Map the icon
    const iconCode = weather[0].icon;
    const matchedIcon = iconMap[iconCode] || `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIconImg.src = matchedIcon;

    // Show date
    displayCurrentDate();

    // Show the weather display nicely with animation
    weatherDisplay.classList.add("active");

    // Optional: dynamically alter background slightly based on temp
    adjustBackground(main.temp);
}

function displayCurrentDate() {
    const dateDisplay = document.querySelector('.current-date-txt');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let myDate = new Date();
    dateDisplay.textContent = myDate.toLocaleDateString('en-US', options);
}

function adjustBackground(temp) {
    const bgBefore = document.querySelector('.app-background');
    if (temp > 30) {
        // Hot
        bgBefore.style.background = 'linear-gradient(to bottom right, #451a03, #0f172a)';
    } else if (temp < 10) {
        // Cold
        bgBefore.style.background = 'linear-gradient(to bottom right, #082f49, #0f172a)';
    } else {
        // Mild
        bgBefore.style.background = 'linear-gradient(to bottom right, #1e293b, #0f172a)';
    }
}

// Check if geolocation is available, otherwise default to a city
document.addEventListener("DOMContentLoaded", () => {
    // hide weather module initially
    weatherDisplay.classList.remove("active");

    // Load default city to show off the app UI immediately
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async position => {
                const { latitude, longitude } = position.coords;
                try {
                    const apiurl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
                    const res = await fetch(apiurl);
                    if (res.ok) {
                        const data = await res.json();
                        displayWeatherData(data);
                    } else {
                        throw new Error();
                    }
                } catch (err) {
                    loadDefaultCity();
                }
            },
            () => {
                loadDefaultCity();
            }
        );
    } else {
        loadDefaultCity();
    }
});

async function loadDefaultCity() {
    try {
        const weatherData = await getFetchData("Jaipur");
        displayWeatherData(weatherData);
    } catch (error) {
        // ignore initially
    }
}