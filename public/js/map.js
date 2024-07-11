mapboxgl.accessToken =mapToken;  
console.log(mapboxgl.accessToken);
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v9",
  projection: "globe", // Display the map as a globe, since satellite-v9 defaults to Mercator
  zoom: 1,
  center: [77.209, 28.6139],
});
