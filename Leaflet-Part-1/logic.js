// URL for the earthquake GeoJSON data
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Initialize the map
const map = L.map('map').setView([37.7749, -122.4194], 5);

// Add a tile layer (map background)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to get color based on earthquake depth
function getColor(depth) {
  if (depth > 70) return 'darkred';
  if (depth > 50) return 'red';
  if (depth > 30) return 'orange';
  if (depth > 10) return 'yellow';
  return 'lightgreen';
}

// Fetch earthquake data and create markers
fetch(earthquakeUrl)
  .then(response => response.json())
  .then(data => {
    data.features.forEach(earthquake => {
      const lat = earthquake.geometry.coordinates[1];
      const lon = earthquake.geometry.coordinates[0];
      const magnitude = earthquake.properties.mag;
      const depth = earthquake.geometry.coordinates[2];

      // Define circle marker options, adjusting color based on depth
      const circleOptions = {
        radius: magnitude * 3,  // Scale radius with magnitude
        fillColor: getColor(depth), // Dynamically set color based on depth
        color: "darkgreen",     // Outline color (could change to match or contrast)
        weight: 0.5,
        fillOpacity: 0.7
      };

      // Add circle marker to the map
      L.circleMarker([lat, lon], circleOptions)
        .bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth} km<br>Location: ${earthquake.properties.place}`)
        .addTo(map);
    });
  })
  .catch(error => console.error('Error fetching earthquake data:', error));

// Add a gradient legend
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'legend');
  div.innerHTML += '<strong>Depth (km)</strong><br>';

  // Define gradient colors and labels to match the getColor function
  const ranges = [
    { label: '90+', color: 'red' },
    { label: '70 to 90', color: 'orange' },
    { label: '50 to 70', color: 'yellow' },
    { label: '30 to 50', color: 'lightgreen' },
    { label: '10 to 30', color: 'green' },
    { label: '-10 to 10', color: 'darkgreen' }
  ];

  // Loop through the ranges and add to the legend
  ranges.forEach(range => {
    div.innerHTML += `<div class="gradient-box" style="background:${range.color};"></div>${range.label}<br>`;
  });

  return div;
};

legend.addTo(map);