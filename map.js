var Map = (function() {

    var pub = {};

    /**
     * Adds text to the right hand side pane of map.html given a feature
     *
     * @param feature The feature object.
     */
    function addToPane(feature) {
        var type = feature.properties.type;
        var name = feature.properties.name;
        if (type === "restaurant") {
            html = "<p class='restaurant'>" + name + "</p>";
            $("#restaurants").after(html);
        } else if (type === "landmark") {
            html = "<p class='activity'>" + name + "</p>";
            $("#activities").after(html);
        }

    }

    pub.setup = function() {
        // Add the map
        map = L.map('map').setView([-45.902, 170.509], 12);

        // Add the tile
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18,
            attribution: 'Map data &copy; ' +
                '<a href="http://www.openstreetmap.org/copyright">' +
                'OpenStreetMap contributors</a> CC-BY-SA'
        }).addTo(map);

        // Get the JSON file and use it to add the markers on the map
        $.getJSON('POI.geojson', function(data) {
            L.geoJSON(data, {
                style: function (feature) {
                    console.log(feature.properties.markerColor);
                    return {color: feature.properties.markerColor};
                }
            }).bindPopup(function (layer) {
                return layer.feature.properties.name;
            }).addTo(map);

            for (let feature of data.features) {
                addToPane(feature);
            }
        });

    };

    return pub;

}());

$(document).ready(Map.setup);

