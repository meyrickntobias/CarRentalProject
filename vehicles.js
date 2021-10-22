var VehicleData = (function() {

    var pub = {};

    /**
     * Fills the modal given a vehicle object and whether or not it can be booked
     *
     * @param vehicle The vehicle object to use to fill in the modal.
     * @param canBook Whether or not the vehicle can be booked.
     */
    function fillModal(vehicle, canBook) {
        // get name, rego, type and img
        let desc = vehicle.description;
        let type = vehicle.vehicleType;
        let img = type.toLowerCase();
        let url = "images/".concat(img, "Car.jpg");
        let rego = vehicle.registration;
        let price = vehicle.pricePerDay;
        $("#modal").append();
        let modalHTML = "<h2>" + desc + "</h2><p id='modal-reg'>" + rego + "</p><img id=\"modal-img\" src='" + url + "'><div id='modal-details'><p id=\"modal-type\">" + type + "</p> <p id=\"modal-price\">$" + price + " / day</p></div> ";
        let nameInput = "<input id='booking-name' type='text' placeholder='Name' />";
        let btnBook = "<button id=\"modal-book\">Book</button>";
        $("#modal").append(modalHTML);
        if (canBook) {
            $("#modal").append(nameInput).append(btnBook);
        }
    }

    /* Adds a given vehicle to the main section */
    function addVehicle(vehicle, canBook) {
        let desc = vehicle.description;
        let type = vehicle.vehicleType;
        let img = type.toLowerCase();
        let url = "images/".concat(img, "Car.jpg");
        let rego = vehicle.registration;
        let regoID = rego.replace(/\s/g, '');
        let html = "<div class='vehicle' id='" + regoID + "'> <div class='caption'>" + desc + "</div> </div>";
        $("#main").append(html);
        $("#" + regoID).css({"background-image": "url(" + url + ")"});
        // Attach an event handler to each vehicle
        $("#" + regoID).click(function() {
            $("#modal").empty();
            fillModal(vehicle, canBook);
            $("#modal-container").fadeToggle();
        });
    }

    /**
     * Takes an array of vehicles and a header and appends it to the DOM.
     *
     * @param header What to add as a header.
     * @param vehicles The available vehicles array.
     */
    function showOptions(header, vehicles) {
        // Given an array of vehicles, find the details from JSON
        // and print them out
        $("#main").empty().append("<h3>Available vehicles from: " + header + "</h3>").append("<p id='booking-msg'>To book a vehicle, click on it and press book</p>");
        $.getJSON('vehicles.json', function(data) {
            let vehicleData = data.fleet.vehicle;
            // loop through available vehicles and
            // match them up to a vehicle, adding it to the screen
            for (let vehicle of vehicleData) {
                for (let v of vehicles) {
                    if (vehicle.registration === v) {
                        addVehicle(vehicle, true);
                    }
                }
            }
        });

    }

    /**
     * Checks if one date is before the other.
     *
     * @param date1 The first date object.
     * @param date 2 The second date object.
     * @return True if date2 is greater than date1.
     */
    function validateDates(date1, date2) {
        if (date2 >= date1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Builds an array of vehicles that are available in the given dates
     * and passes this data to the showOptions function.
     */
    function filterVehicles() {

        let availableVehicles = [];

        // fill availableVehicles with all the vehicles
        $.getJSON('vehicles.json', function(data) {
            let vehicles = data.fleet.vehicle;
            for (let vehicle of vehicles) {
                availableVehicles.push(vehicle.registration);
            }
        });

        let enteredPickup = new Date($("#date-pickup").val());
        let enteredDropoff = new Date($("#date-dropoff").val());

        // validate dates
        if (!validateDates(enteredPickup, enteredDropoff)) {
            alert("Error: dropoff date can not be before pickup date");
            return;
        }

        // get booking dates and compare to entered dates
        $.getJSON('bookings.json', function(data) {
            let bookings = data.bookings.booking;
            let pickup, dropoff, day, month, year, reg;
            let pickupDate, dropoffDate;
            for (let booking of bookings) {
                reg = booking.number;
                day = booking.pickup.day;
                month = booking.pickup.month;
                year = booking.pickup.year;
                pickup = year + "-" + month + "-" + day;
                day = booking.dropoff.day;
                month = booking.dropoff.month;
                year = booking.dropoff.year;
                dropoff = year + "-" + month + "-" + day;
                pickupDate = new Date(pickup);
                dropoffDate = new Date(dropoff);

                // if the dates conflict, remove from available vehicles
                if (pickupDate >= enteredPickup && pickupDate <= enteredDropoff) {
                    availableVehicles.splice(availableVehicles.indexOf(reg), 1);
                } else if (dropoffDate >= enteredPickup && dropoffDate <= enteredDropoff) {
                    availableVehicles.splice(availableVehicles.indexOf(reg), 1);
                }
            }
            let header = enteredPickup.toDateString() + " - " + enteredDropoff.toDateString();
            showOptions(header, availableVehicles);
        });
    }

    /**
     * Add booking details to localStorage
     *
     * @param reg The registration number of the vehicle.
     * @param name The name of the person.
     */
    function makeBooking(reg, name) {

        var booking = {};
        booking.name = name;
        booking.number = reg;
        let pickup = new Date($("#date-pickup").val());
        let dropoff = new Date($("#date-dropoff").val());
        booking.pickup = {};
        booking.pickup.day = pickup.getDate();
        booking.pickup.month = pickup.getMonth();
        booking.pickup.year = pickup.getFullYear();
        booking.dropoff = {};
        booking.dropoff.day = dropoff.getDate();
        booking.dropoff.month = dropoff.getMonth();
        booking.dropoff.year = dropoff.getFullYear();

        window.localStorage.setItem("booking", JSON.stringify(booking));
        alert("Your booking has been recorded, please proceed to booking page to continue");
    }

    /**
     * Check to see if a string is empty.
     *
     * Leading and trailing whitespace are ignored.
     * @param textValue The string to check.
     * @return True if textValue is not just whitespace, false otherwise.
     */
    function checkNotEmpty(textValue) {
        return textValue.trim().length > 0;
    }

    pub.setup = function() {

        // Add the vehicles
        $.getJSON('vehicles.json', function(data) {
            let vehicles = data.fleet.vehicle;
            for (let vehicle of vehicles) {
                addVehicle(vehicle);
            }
        });

        $("#submit-date").click(filterVehicles);

        $("#date-picker-form").submit(function() {
            return false;
        });

        $("#close-modal").click(function() {
            $("#modal-container").fadeOut("fast", "swing");
        });

        $("#modal").on("click", "#modal-book", function() {
            let reg = document.querySelector("#modal-reg").textContent;
            let name = document.querySelector("#booking-name").value;
            if (!checkNotEmpty(name)) {
                alert("Please enter a name");
            } else {
                makeBooking(reg, name);
            }
        });

    };

    return pub;

}());

$(document).ready(VehicleData.setup);