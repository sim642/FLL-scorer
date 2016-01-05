var logos = [
    ["1_Robootika_logo_taustata.png", "2_ FIRSTLego_iconHorz_RGB.png"],
    ["3_EMT_Elion_f.png", "4_SEB_k_rgb.png"],
    ["5_nutilabor.png", "6_swedbank.png"],
    ["Suur_1_HMN_valge.png"],
    ["Suur_2_MEIE VILISTLANE MUUDAB MAAILMA_us.png"],
    ["Suur_3_robomiku_final.png"]
];
var logoi = 0;


function renderLogos() {
    $(".onelogo, .twologo", "#header").fadeOut(400).promise().done(function() {
        var logo = logos[logoi];
        if (logo.length == 1) {
            $("#onelogo").attr("src", "logo/" + logo[0]);
            $(".onelogo", "#header").fadeIn(400);
            //$(".onelogo", "#header").show();
        }
        else if (logo.length == 2) {
            $("#leftlogo").attr("src", "logo/" + logo[0]);
            $("#rightlogo").attr("src", "logo/" + logo[1]);
            $(".twologo", "#header").fadeIn(400);
            //$(".twologo", "#header").show();
        }

        logoi++;
        logoi %= logos.length;
    });
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
