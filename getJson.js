var getJSON = (function() {

    var pub = {};

    /*
         - Function to return all of the features in an array
         - Function to display all of the features on the map
     */

    function addVehicle(vehicle) {
        let desc = vehicle.description;
        let type = vehicle.type;
        let img = type.toLowerCase()
        let html = "<div class='vehicle'> <div class='caption'>" + desc + "</div> </div>";
        $("#main").append(html);
    }

    pub.setup = function() {
        $.getJSON('vehicles.json', function (data) {
            var vehicles = data.fleet.vehicle;
            for (let vehicle of vehicles) {
                addVehicle(vehicle);
            }
        });
    };

    return pub;

}());

$(document).ready(getJSON.setup);
