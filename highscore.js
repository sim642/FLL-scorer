var logoprefix = "logo/"; // TODO: muuda logode kausta
var logos = [
    ["1_Robootika_logo_taustata.png", "2_ FIRSTLego_iconHorz_RGB.png"],
    ["3_EMT_Elion_f.png", "4_SEB_k_rgb.png"],
    ["5_nutilabor.png", "6_swedbank.png"],
    ["Suur_1_HMN_valge.png"],
    ["Suur_2_MEIE VILISTLANE MUUDAB MAAILMA_us.png"],
    ["Suur_3_robomiku_final.png"]
];
var logoi = 0; // current logo index

var scrolls = 5; // scroll count before refresh

function renderLogos() {
    // http://stackoverflow.com/a/8793546
    $(".onelogo, .twologo", "#header").fadeOut(400).promise().done(function() {
        var logo = logos[logoi];
        if (logo.length == 1) {
            $("#onelogo").attr("src", logoprefix + logo[0]);
            $(".onelogo", "#header").fadeIn(400);
        }
        else if (logo.length == 2) {
            $("#leftlogo").attr("src", logoprefix + logo[0]);
            $("#rightlogo").attr("src", logoprefix + logo[1]);
            $(".twologo", "#header").fadeIn(400);
        }

        logoi++;
        logoi %= logos.length;
    });
}

function animateScroll() {
    setTimeout(function() {
        $("html").animate({
            scrollTop: $(".panel", "#highscore").last().offset().top - $("#highscore").offset().top
        }, $(".col-name", "#highscore").length * 1500 /* ms per score row */, "linear", function() {
            scrolls--;
            if (scrolls) {
                $("html").animate({
                    scrollTop: $(".panel", "#highscore").first().offset().top - $("#highscore").offset().top
                }, "slow", "swing", function() {
                    animateScroll();
                });
            }
            else {
                location.reload();
            }
        });
    }, 10 * 1000); // ms to wait at top
}
$(function() {
    renderLogos();
    setInterval(renderLogos, 15 * 1000); // ms to change logos

    $("html").scrollTop(0);
    animateScroll();
});
