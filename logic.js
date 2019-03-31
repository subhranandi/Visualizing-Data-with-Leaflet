var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log(quakeUrl);
var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log(platesUrl);

function markerSize (magnitude){
    return magnitude * 4;
};

var earthquakes = new L.layerGroup();

// Perform a GET request to the query URL
d3.json(quakeUrl, function(geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.2,
                color: 'black'

            }
        },

onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

var plateBoundary = new L.layerGroup();

d3.json(platesUrl, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 2.5,
                color: 'teal'
            }
        },
    }).addTo(plateBoundary);
})

function Color(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'darkorange'
    } else if (magnitude > 3) {
        return 'orange'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'lightgreen'
    } else {
        return 'darkgreen'
    }
};

function createMap() {

    var highContrastMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a \"href="https://openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://mapbox.com/\">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.high-contrast',
        accessToken: API_KEY
    });

  // Define streetmap and darkmap layers
    var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://mapbox.com/\">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });


  // Define a baseMaps object to hold our base layers
    var baseLayers = {
    "High Contrast": highContrastMap,
    "Street": streetMap,
    "Dark": darkMap,
    "Satellite": satellite
    };

 // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        Plate_Boundary: plateBoundary
    };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
    var mymap = L.map("mymap", {
        center: [
        40, -99
        ],
        zoom: 4,
        layers: [ streetMap , earthquakes , plateBoundary ]
    });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
    L.control.layers(baseLayers, overlayMaps)
        .addTo(mymap);
        var legend = L.control({ position: 'bottomright' });

        legend.onAdd = function (map) {
    
            var div = L.DomUtil.create('div', 'info legend'),
                magnitude = [0, 1, 2, 3, 4, 5],
                labels = [];
    
            div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"
    
            for (var i = 0; i < magnitude.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
                    magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
            }
    
            return div;
        };
        legend.addTo(mymap);
    
};



