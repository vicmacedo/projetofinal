// importações //
import { useState } from 'react'; // react
import 'bootstrap/dist/css/bootstrap.min.css'; // bootstrap
import Container from 'react-bootstrap/Container'; // bootstrap container
import Button from 'react-bootstrap/Button'; // bootstrap button
import Row from 'react-bootstrap/Row'; // bootstrap row
import Col from 'react-bootstrap/Col'; // bootstrap col
import Weather from './weather'; // componente weather
import './App.css'; // css
import axios from 'axios'; // biblioteca axios para fazer requisições HTTP (api) //

// Configuração da API GeoNames //
const GEO_API_USERNAME = 'vicmacedo'; // username do GeoNames

// Função para buscar coordenadas no GeoNames //
const fetchCityFromGeoNames = async (cityQuery) => {

  const url = `https://secure.geonames.org/searchJSON?q=${cityQuery}&maxRows=1&username=${GEO_API_USERNAME}`;
    try {
      const response = await axios.get(url);

    if (response.data.geonames && response.data.geonames.length > 0) { // verifica se foram encontradas cidades
      const { lat, lng, name, adminName1 } = response.data.geonames[0]; // obtem as coordenadas e o nome da cidade
        return { lat, lng, cityName: name, state: adminName1 };
    } 
    
    else { // se nao foram encontradas cidades
      return null;
    }
  
      // exibe erros ao buscar cidade no GeoNames  //
    } catch (error) {
      console.error('Erro ao buscar cidade no GeoNames:', error);
        return null;
    }
};

// Barra de Pesquisa //
function MinimalSearchBar({ onSearch }) {
  const [query, setQuery] = useState(''); //Gerencia o texto digitado pelo usuário no campo de pesquisa

  const handleInputChange = (e) => { // gerencia o texto digitado pelo usuário
    setQuery(e.target.value);
  };

  const handleSearch = async () => { //faz a busca usando a função fetchCityFromGeoNames
    if (query) {
      const result = await fetchCityFromGeoNames(query); // busca a cidade
    
      if (result) { // se a cidade foi encontrada
        onSearch(result); // chama a função de busca passando o resultado

      } else { // se a cidade nao foi encontrada
        alert('Localização não encontrada. Verifique o nome e tente novamente.'); // exibe mensagem de erro
      }
    }
  };

  return ( // componentes da barra de pesquisa
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Digite estado, cidade ou município"
        className="search-input"
        value={query}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch} className="search-button">
        Buscar
      </button>
    </div>
  );
}

// Componente Principal //
function ContainerFluidBreakpointExample() { // container
  const [selectedLocation, setSelectedLocation] = useState(null); // Gerencia a localização selecionada

  const fetchWeatherByLocation = async () => { // busca o clima pela localização através do navegador
    if (navigator.geolocation) { // verifica se o navegador suporta geolocalização
      navigator.geolocation.getCurrentPosition(async (position) => {

        const { latitude, longitude } = position.coords;
        try { // busca o clima pela localização
          const response = await axios.get(
            `https://secure.geonames.org/findNearbyPlaceNameJSON?lat=${latitude}&lng=${longitude}&username=${GEO_API_USERNAME}`
          );
          if (response.data.geonames && response.data.geonames.length > 0) { // verifica se foram encontradas cidades

            const { name, adminName1, lat, lng } = response.data.geonames[0]; // obtem as coordenadas e o nome da cidade
            setSelectedLocation({ cityName: name, state: adminName1, lat, lng });

          } else { // se nao foram encontradas cidades
            alert('Não foi possível encontrar sua localização.'); // exibe mensagem de erro
          }
        } catch (error) { // exibe erros ao buscar dados da localização
          console.error('Erro ao buscar dados da localização:', error);
        }
      });

    } else { // se o navegador nao suportar geolocalização
      alert('Geolocalização não suportada pelo navegador.'); // exibe mensagem de erro
    }
  };

  // Função para lidar com a pesquisa
  const handleSearch = (location) => { // recebe o resultado da busca
    setSelectedLocation(location); // atualiza a localização selecionada
  };

  return ( // componentes do container
    <Container fluid="md" className="custom-container"> {/* Container fluido */} 

      <Row className="custom-row"> {/* aplica propriedades grid de organização aos componentes do layout */}
        <Col className="custom-header"> {/* header com título e texto */}
          <h1>SITE METEOROLÓGICO</h1>
            <p>Encontre informações meteorológicas precisas e atualizadas para sua localização e qualquer lugar do mundo. Tenha acesso rápido às condições climáticas para planejar o seu dia com mais eficiência.</p>
        </Col>
      </Row>
      

      <Row className="custom-row"> 
        <Col className="custom-col-left"> {/* coluna da esquerda  */}
        <p>Veja o clima em sua localização:</p>
          <Button variant="primary" onClick={fetchWeatherByLocation}> Buscar Clima pela Localização </Button> {/* botão para buscar informações pela localização do usuário  */}
            <p>Ou use a barra de pesquisas para monitorar o clima em qualquer lugar do mundo:</p>
          <MinimalSearchBar onSearch={handleSearch} /> {/* barra de pesquisa para buscar informações por texto */}
        </Col>


        <Col className="custom-col-right"> {/* coluna da direita  */}

          {selectedLocation ? ( /* se houver uma localização selecionada  */
            <Weather location={selectedLocation} /> // Exibe diretamente o componente Weather

          ) : ( // se nao houver uma localização selecionada

            <Col className="custom-col-right-default"> {/* coluna da direita default  */}
              <h2>MAPA METEOROLÓGICO</h2>
              <p>Escolha uma cidade ou use a localização atual para visualizar o clima.</p>
              <img src={`img/rotating_earth.gif`} alt="Globo Giratório"/></Col>
          )}
        </Col>

      </Row>
      
    </Container>
  );
}

export default ContainerFluidBreakpointExample;
