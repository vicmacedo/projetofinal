//importações
import React, { useEffect, useState } from 'react'; //react //
import axios from 'axios'; // biblioteca axios para fazer requisições HTTP (api) //
import { countryDictionary } from './dicionario'; // dicionário sigla para países pt-br //
import './weather.css'; //perosnalização css //

//componente weather //
const Weather = ({ location }) => {
const [weatherData, setWeatherData] = useState(null);

  // obtem dados climáticos com base na localização (latitude e longitude de location)
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (location) {

        const { lat, lng } = location;
        try {

          // GET para a API do OpenWeatherMap, passando latitude, longitude, unidade métrica e idioma como parâmetros //
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=bbcf75cf1618bf5f88407365bec40eab&lang=pt_br`);
            setWeatherData(response.data);

               //exibe erros ao buscar dados climáticos //
              } catch (error) {console.error('Erro ao buscar dados climáticos:', error);}
      }
    };
    fetchWeatherData();
  }, [location]);

  // Mensagem de Carregamento
if (!weatherData) { 
  return <p><img src={`./img/infoloading.gif`} alt="Carregando"/></p>; // 
}

  // Aqui você usa o dicionário para substituir a sigla pelo nome completo do país //
  const countryCode = weatherData.sys?.country || "BR";
  const countryName = countryDictionary[countryCode] || "País não disponível"; // Usando o dicionário //

  return (
    // informações climáticas do card //
    <div className="weather-info">

      <div className="weather-location-info">{/* Informações da localização */}

        <h3>{`${countryName}`}</h3> 
          <h2>{`${location.cityName}, ${location.state}`}</h2>

      </div>


      <div className="weather-climate-info"> {/* descrição climática */}

        <h3>{weatherData.weather[0].description}</h3>
          <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} alt={weatherData.weather[0].description}/>

      </div>


      <div className="weather-card-container"> {/* informações nos cards */}

        <div className="weather-card"> {/* temperatura */}
          <h3>Temperatura</h3>
            <p><strong>{weatherData.main.temp}°C</strong></p>
          <img src={`/img/temperatura.png`} alt="Temperatura"/>

      </div>


        <div className="weather-card"> {/* sensação térmica */}

          <h3>Sensação Térmica</h3>
            <p><strong>{weatherData.main.feels_like}°C</strong></p>
            {weatherData.main.temp < 10 && (<img src={`/img/tempb.png`} alt="Temperatura Baixa" />)}
            {weatherData.main.temp >= 10 && weatherData.main.temp < 25 && (<img src={`/img/tempn.png`} alt="Temperatura Normal" />)}
            {weatherData.main.temp >= 25 && (<img src={`/img/tempa.png`} alt="Temperatura Quente" />)}

        </div>


        <div className="weather-card"> {/* umidade */}
          <h3>Umidade</h3>
            <p><strong>{weatherData.main.humidity}%</strong></p>
            <img src={`/img/umidade.png`} alt="Umidade" />

        </div>


        <div className="weather-card"> {/* pressão atmosférica */}

          <h3>Pressão Atmosférica</h3>
            <p><strong>{weatherData.main.pressure} hPa</strong></p>
            {weatherData.main.pressure <= 990 && (<img src={`/img/atmbaixa.png`} alt="Pressão Baixa" />)}
            {weatherData.main.pressure > 990 && weatherData.main.pressure <= 1030 && (<img src={`/img/atmnormal.png`} alt="Pressão Média" />)}
            {weatherData.main.pressure > 1030 && (<img src={`/img/atmalta.png`} alt="Pressão Alta" />)}

        </div>


        <div className="weather-card"> {/* velocidade do vento */}

          <h3>Velocidade do Vento</h3>
            <p><strong>{weatherData.wind.speed} m/s</strong></p>
            <img src={`/img/velocidadedovento.png`} alt="Velocidade do Vento" />

        </div>


      </div>
    </div>
  );
};

export default Weather;
