var Booking = (function() {

    var pub = {};

    pub.setup = function() {
        if (window.localStorage.getItem("booking") == null) {
            $("#mybooking").empty().css({"height": "100px"}).append("<h2>There is no booking to proceed with currently</h2>");
        } else {
            let booking = $.parseJSON(window.localStorage.getItem("booking"));
            $("#booking-details").append("<p>For " + booking.name + "</p>" + "<p>Registration: " + booking.number + "</p>" + "<p>Pickup date: " + booking.pickup.day + "/" + booking.pickup.month + "/" + booking.pickup.year + "</p>" + "<p>Dropoff date: " + booking.dropoff.day + "/" + booking.dropoff.month + "/" + booking.dropoff.year + "</p>");
            let pricePerDay;
            $.getJSON("vehicles.json", function(data) {
                let vehicles = data.fleet.vehicle;
                for (let vehicle of vehicles) {
                    if (vehicle.registration === booking.number) {
                        pricePerDay = vehicle.pricePerDay;
                        let pickupDateStr = booking.pickup.year + "-" + booking.pickup.month + "-" + booking.pickup.day;
                        let pickupDate = new Date(pickupDateStr);
                        let dropoffDateStr = booking.dropoff.year + "-" + booking.dropoff.month + "-" + booking.dropoff.day;
                        let dropoffDate = new Date(dropoffDateStr);
                        let diffTime = Math.abs(dropoffDate - pickupDate);
                        let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                        $("#booking-details").append("<p class='money'>Price per day: $" + pricePerDay + "</p>" + "<p class='money'>Total price: $" + pricePerDay * days  + "</p>");
                    }
                }
            });
        }

        $("#booking-submit").click(function() {
            alert("Booking submitted");
           $("#mybooking").empty().css({"height": "100px"}).append("<h2>There is no booking to proceed with currently</h2>");
           window.localStorage.clear();
        });
    };



    return pub;

}());

$(document).ready(Booking.setup);