var Admin = (function() {

    var pub = {};

    /**
     * Converts a booking date object to a String.
     *
     * @param obj The date object from the booking JSON file.
     * @return The date in String format.
     */
    function stringDate(obj) {
        let day = obj.day;
        let month = obj.month;
        let year = obj.year;
        return day + "/" + month + "/" + year;
    }

    pub.setup = function() {
        $.getJSON( 'bookings.json', function(data) {
           let bookings = data.bookings.booking;
           for (let booking of bookings) {
               let reg = booking.number;
               let name = booking.name;
               let pickup = booking.pickup;
               let dropoff = booking.dropoff;
               let html = "<div class='booking'> <span class='reg'>" + reg + "</span> <p class=\"booked-by\">Booked by: " + name + "</p> <p class=\"label-pickup\">Pickup date: " + stringDate(pickup) + "</p> <p class=\"label-dropoff\">Dropoff date: " + stringDate(dropoff) + "</p> </div>";

               $("#bookings").append(html);
           }
        });
    };

    return pub;

}());

$(document).ready(Admin.setup);