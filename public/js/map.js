const apiKey = "42ba6efd70774d5c842dcdbbc594d981";

let place = `${window.listingData.location}, ${window.listingData.country}`;

// Initialize map (temporary coordinates)
const map = L.map("map").setView([0, 0], 12);

// Add Geoapify tiles
L.tileLayer(
  `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`,
  { maxZoom: 19 }
).addTo(map);

// Use Geoapify to convert text → coordinates
fetch(
  `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    place
  )}&apiKey=${apiKey}`
)
  .then((res) => res.json())
  .then((data) => {
    const { lat, lon } = data.features[0].properties;

    // Move map to location
    map.setView([lat, lon], 13);

    // Add marker
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(
        `<b>${window.listingData.title}</b><br>${place}`
      )
      .openPopup();
  })
  .catch((err) => console.error(err));
