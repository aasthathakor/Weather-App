import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import pressure from '../assets/pressure.png';  // Add pressure icon
import sunrise_icon from '../assets/sunrise.png';   // Add sunrise icon
import sunset_icon from '../assets/sunset.png';     // Add sunset icon

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon
    };

    const search = async (city) => {
        if (!city) {
            alert("Enter City Name");
            return;
        }

        try {
            setLoading(true);
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                setWeatherData(null);
                return;
            }

            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                minTemp: Math.floor(data.main.temp_min),
                maxTemp: Math.floor(data.main.temp_max),
                feelsLike: Math.floor(data.main.feels_like),
                pressure: data.main.pressure,
                location: data.name,
                description: data.weather[0].description,
                sunrise: formatTime(data.sys.sunrise),
                sunset: formatTime(data.sys.sunset),
                icon: icon,
                unit: 'C'
            });

        } catch (error) {
            alert("Error fetching weather data.");
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const toggleUnits = () => {
        setWeatherData((prevData) => ({
            ...prevData,
            temperature: prevData.unit === 'C' 
                ? Math.floor((prevData.temperature * 9 / 5) + 32) 
                : Math.floor((prevData.temperature - 32) * 5 / 9),
            unit: prevData.unit === 'C' ? 'F' : 'C'
        }));
    };

    useEffect(() => {
        search('Vadodara');
    }, []);

    return (
        <div className={`weather ${weatherData ? weatherData.description : ''}`}>
            <div className='search-bar'>
                <input ref={inputRef} type='text' placeholder='Search City' />
                <img src={search_icon} alt='Search' onClick={() => search(inputRef.current.value)} />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : weatherData ? (
                <>
                    <img src={weatherData.icon} alt='' className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}°{weatherData.unit}</p>
                    <p className='description'>{weatherData.description}</p>
                    <p className='location'>{weatherData.location}</p>

                    <div className='weather-data'>
                        <div className='col'>
                            <img src={humidity_icon} alt='Humidity' />
                            <p>Humidity: {weatherData.humidity}%</p>
                        </div>
                        <div className='col'>
                            <img src={wind_icon} alt='Wind' />
                            <p>Wind: {weatherData.windSpeed} km/h</p>
                        </div>
                        <div className='col'>
                            <img src={pressure} alt='Pressure' /> {/* Pressure Icon */}
                            <p>Pressure: {weatherData.pressure} hPa</p>
                        </div>
                        <div className='col'>
                            <img src={sunrise_icon} alt='Sunrise' /> {/* Sunrise Icon */}
                            <p>Sunrise: {weatherData.sunrise}</p>
                            <img src={sunset_icon} alt='Sunset' /> {/* Sunset Icon */}
                            <p>Sunset: {weatherData.sunset}</p>
                        </div>
                    </div>

                    <button onClick={toggleUnits}>
                        Switch to {weatherData.unit === 'C' ? '°F' : '°C'}
                    </button>
                </>
            ) : null}
        </div>
    );
};

export default Weather;
