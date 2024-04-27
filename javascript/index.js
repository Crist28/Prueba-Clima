let map; 

document.getElementById('cityForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    fetchWeather(city);
});

document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('cityInput').value = '';
    document.getElementById('weatherTableBody').innerHTML = '';
    
    if (map) {
        map.remove();
        map = null; 
    }
});

function fetchWeather(city) {
    const apiKey = 'a61c57a3bcf5c4005acae23d05ca9d2a';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        displayWeather(data);
        displayMap(data.coord.lat, data.coord.lon);
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        const tableBody = document.getElementById('weatherTableBody');
        tableBody.innerHTML = '<tr><td colspan="3" class="error-message">Ciudad no encontrada</td></tr>';
    });
}

function displayWeather(weatherData) {
    const tableBody = document.getElementById('weatherTableBody');
    tableBody.innerHTML = '';

    const row = tableBody.insertRow();
    const cityNameCell = row.insertCell();
    cityNameCell.textContent = weatherData.name;
    const temperatureCell = row.insertCell();
    temperatureCell.textContent = weatherData.main.temp + ' °C';
    const descriptionCell = row.insertCell();
    descriptionCell.textContent = weatherData.weather[0].description;
}

function displayMap(lat, lon) {
    
    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        
        map.setView([lat, lon], 10);
    }
    
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    L.marker([lat, lon]).addTo(map)
        .bindPopup('Ubicación de la ciudad')
        .openPopup();
}
