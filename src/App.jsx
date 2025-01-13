// importações
import { useState } from 'react'; // react
import 'bootstrap/dist/css/bootstrap.min.css'; // bootstrap
import Container from 'react-bootstrap/Container'; // bootstrap container
import Button from 'react-bootstrap/Button'; // bootstrap button
import Modal from 'react-bootstrap/Modal'; // bootstrap modal para popup
import Row from 'react-bootstrap/Row'; // bootstrap row
import Col from 'react-bootstrap/Col'; // bootstrap col
import Weather from './weather'; // componente weather
import './App.css'; // css
import axios from 'axios'; // biblioteca axios para fazer requisições HTTP (api)

// Configuração da API GeoNames
const GEO_API_USERNAME = 'vicmacedo'; // username do GeoNames

// Função para buscar cidade na API GeoNames
async function fetchCityFromGeoNames(query) {
  try {
    const response = await axios.get(
      `https://secure.geonames.org/searchJSON?q=${query}&maxRows=1&username=${GEO_API_USERNAME}`
    );

    if (response.data.geonames && response.data.geonames.length > 0) {
      const cityData = response.data.geonames[0]; // Primeiro resultado encontrado
      return {
        cityName: cityData.name,
        state: cityData.adminName1,
        lat: cityData.lat,
        lng: cityData.lng,
      };
    } else {
      return null; // Nenhuma cidade encontrada
    }
  } catch (error) {
    console.error('Erro ao buscar cidade na API GeoNames:', error);
    return null;
  }
}

// Barra de Pesquisa
function MinimalSearchBar({ onSearch }) {
  const [query, setQuery] = useState(''); // Gerencia o texto digitado pelo usuário no campo de pesquisa

  const handleInputChange = (e) => {
    setQuery(e.target.value); // Gerencia o texto digitado pelo usuário
  };

  const handleSearch = async () => { // Faz a busca usando a função fetchCityFromGeoNames
    if (query) {
      const result = await fetchCityFromGeoNames(query); // Busca a cidade
    
      if (result) {
        onSearch(result); // Chama a função de busca passando o resultado
      } else {
        alert('Localização não encontrada. Verifique o nome e tente novamente.'); // Exibe mensagem de erro
      }
    }
  };

  return ( // Componentes da barra de pesquisa
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

// Componente Principal
function ContainerFluidBreakpointExample() {
  const [selectedLocation, setSelectedLocation] = useState(null); // Gerencia a localização selecionada
  const [showModal, setShowModal] = useState(false); // Gerencia a exibição do modal

  const fetchWeatherByLocation = async () => { // Busca o clima pela localização através do navegador
    if (navigator.geolocation) { // Verifica se o navegador suporta geolocalização
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://secure.geonames.org/findNearbyPlaceNameJSON?lat=${latitude}&lng=${longitude}&username=${GEO_API_USERNAME}`
          );
          if (response.data.geonames && response.data.geonames.length > 0) { // Verifica se foram encontradas cidades
            const { name, adminName1, lat, lng } = response.data.geonames[0]; // Obtem as coordenadas e o nome da cidade
            setSelectedLocation({ cityName: name, state: adminName1, lat, lng });
          } else {
            alert('Não foi possível encontrar sua localização.');
          }
        } catch (error) {
          console.error('Erro ao buscar dados da localização:', error);
        }
      });
    } else {
      alert('Geolocalização não suportada pelo navegador.');
    }
  };

  const handleSearch = (location) => {
    setSelectedLocation(location); // Atualiza a localização selecionada
  };

  const handleModalAccept = () => {
    setShowModal(false); // Fecha o modal
    fetchWeatherByLocation(); // Busca a localização
  };

  const handleModalCancel = () => {
    setShowModal(false); // Fecha o modal
  };

  const handleButtonClick = () => {
    setShowModal(true); // Exibe o modal quando o botão é clicado
  };

  // Função para determinar o plano de fundo com base no horário
  function setDynamicBackground() {
    const currentHour = new Date().getHours(); // Obtendo o horário atual
    const bodyElement = document.body; // Elemento do corpo da página

    bodyElement.classList.remove('bg-day', 'bg-night', 'bg-dawn', 'bg-dusk'); // Removendo qualquer classe de plano de fundo previamente aplicada

    if (currentHour >= 5 && currentHour < 7) {
      bodyElement.classList.add('bg-dawn'); // Amanhecer: 5h às 7h
    } else if (currentHour >= 7 && currentHour < 16) {
      bodyElement.classList.add('bg-day'); // Dia: 7h às 16h
    } else if (currentHour >= 16 && currentHour < 19) {
      bodyElement.classList.add('bg-dusk'); // Anoitecer: 16h às 19h
    } else {
      bodyElement.classList.add('bg-night'); // Noite: 19h às 5h
    }
  }

  // Chamando a função para definir o plano de fundo inicial
  setDynamicBackground();

  // Atualizando o plano de fundo a cada hora
  setInterval(setDynamicBackground, 3600000); // Atualiza a cada 1 hora (3600000ms)

  return (
    <Container fluid="md" className="custom-container"> {/* Container fluido */}
      <Row className="custom-row"> {/* Aplica propriedades grid de organização aos componentes do layout */}
        <Col className="custom-header"> {/* Header com título e texto */}
          <h1>APLICAÇÃO METEOROLÓGICA</h1>
          <p>Encontre informações meteorológicas precisas e atualizadas para sua localização e qualquer lugar do mundo. Tenha acesso rápido às condições climáticas para planejar o seu dia com mais eficiência.</p>
        </Col>
      </Row>

      <Row className="custom-row">
        <Col className="custom-col-left"> {/* Coluna da esquerda */}
          <p>Veja o clima em sua localização:</p>
          <Button variant="primary" onClick={handleButtonClick}>Buscar Clima pela Localização</Button> {/* Botão que abre o modal para permissão */}
          <p>Ou use a barra de pesquisas para monitorar o clima em qualquer lugar do mundo:</p>
          <MinimalSearchBar onSearch={handleSearch} /> {/* Barra de pesquisa para buscar informações por texto */}
        </Col>

        <Col className="custom-col-right"> {/* Coluna da direita */}
          {selectedLocation ? ( /* Se houver uma localização selecionada */
            <Weather location={selectedLocation} /> // Exibe diretamente o componente Weather
          ) : ( // Se não houver uma localização selecionada
            <Col className="custom-col-right-default">
              <h2>MAPA METEOROLÓGICO</h2>
              <p>Escolha uma cidade ou use a localização atual para visualizar o clima.</p>
              <img src={`img/rotating_earth.gif`} alt="Globo Giratório"/>
            </Col>
          )}
        </Col>
      </Row>

      {/* Modal para confirmação de permissão de localização */}
      <Modal show={showModal} onHide={handleModalCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Permissão para Localização</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deseja permitir que suas informações de localização atuais sejam usadas para buscar o clima?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="custom-allow-button" onClick={handleModalAccept}>Permitir</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ContainerFluidBreakpointExample;
