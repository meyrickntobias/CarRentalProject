var Reviews = (function() {

    var pub = {};

    /* Print out all of the reviews from the reviews.json file */
    pub.setup = function() {
        $.getJSON('reviews.json', function(data) {
            let reviewList = data;
            for (let review of reviewList) {
                $("#reviews").append("<div class='review'><p class='review-title'>" + review.title + "</p><p>\"" + review.reviewcontent + "\" - " + review.author + "</p></div>");
            }
        });
    };

    return pub;

}());

$(document).ready(Reviews.setup);