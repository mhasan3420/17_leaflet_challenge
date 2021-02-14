//  create the tile layer 
var graymap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }
);

//  create the map 
var map = L.map("map", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

//  add the 'graymap' 
graymap.addTo(map);

// make an AJAX call 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {


  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.75
    };
  }

  // the color of the marker based on the magnitude of the earthquake.
  function getColor(depth) {
    switch (true) {
    case depth > 100:
      return "#ea2c2c";
    case depth > 75:
      return "#ea822c";
    case depth > 55:
      return "#ee9c00";
    case depth > 35:
      return "#eecc00";
    case depth > 5:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }

  // the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  //  add a GeoJSON layer 
  L.geoJson(data, {
    //  a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    //  set the style 
    style: styleInfo,
    //  create a popup 
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2]
          + "<br>Location: "
          + feature.properties.place
      );
    }
  }).addTo(map);

  //  create a legend 
  var legend = L.control({
    position: "bottomright"
  });

  // add all the details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [-15, 5, 35, 55, 75, 100];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // Looping through our intervals 
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  //  legend to the map.
  legend.addTo(map);
});
