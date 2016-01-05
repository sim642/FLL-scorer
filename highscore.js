var logos = ["swedbank.png", "nutilabor.jpg",
            "nutilabor.jpg", "swedbank.png"];
var logoi = 0;

function renderLogos()
{
    $("#leftlogo").attr("src", logos[logoi]);
    $("#rightlogo").attr("src", logos[logoi + 1]);
    logoi += 2;
    logoi %= logos.length;
}

function animateScroll() {
    setTimeout(function() {
        $("html").animate({
            scrollTop: $(".panel", "#highscore").last().offset().top - $("#highscore").offset().top
        }, $(".col-name", "#highscore").length * 750, "linear", function() {
            $("html").animate({
                scrollTop: $(".panel", "#highscore").first().offset().top - $("#highscore").offset().top
            }, "slow", "swing", function() {
                animateScroll();
            });
        });
    }, 5 * 1000);
}
$(function() {
    renderLogos();
    setInterval(renderLogos, 15 * 1000);

    $("html").scrollTop(0);
    animateScroll();
}); 
