const styleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapToken}`;

const map = new maplibregl.Map({
  container: "map",
  style: styleUrl,
  center: listing.geometry.coordinates, // Use the listing's coordinates to center the map
  zoom: 9,
});

// Setting the marker using maplibregl
const marker = new maplibregl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new maplibregl.Popup({ offset: 25 }).setHTML(
      `<h3>${listing.title}</h3><p>Exact Location will be provided after booking</p>`
    )
  )
  .addTo(map);
