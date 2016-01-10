var elements = [];

function parseData(data) {
    var $data = $(data);
    var elements = [];

    $("Element", $data).each(function() {
        var element = {
            heading: $("Heading", this).text(),
            question: $("Question", this).text(),
            tag: $("Tag", this).text(),
            options: [],
            default: null,
            score: $("Score", this).text(),
            validate: $("Validate", this).text()
        };

        $("Option", this).each(function() {
            var option = {
                label: $("Label", this).text(),
                value: $("Value", this).text(),
                default: $("Default", this).length > 0
            };

            if (option.default)
                element.default = option.value;

            element.options.push(option);
        });

        elements.push(element);
    });

    return elements;
}

function mathSum(arr) {
    var sum = 0;
    $.each(arr, function(_, val) {
        sum += val;
    });
    return sum;
}

function mathAvg(arr) {
    return mathSum(arr) / arr.length;
}

function mathStdDev(arr) {
    var avg = mathAvg(arr);

    var sqdiffs = $.map(arr, function(val) {
        return Math.pow(val - avg, 2);
    });

    return Math.sqrt(mathAvg(sqdiffs));
}

var colcnt = null;

function colsCnt() {
    var colcnt = 1;
    if ($("body").width() >= 768)
        colcnt = 2;
    if ($("body").width() >= 1200)
        colcnt = 3;
    return colcnt;
}

function colsReset() {
    $(".panel", "#elements").detach().appendTo($("#col-0", "#elements"));
}

function colsSort() {
    console.log("colsSort");

    $(".col", "#elements").removeClass("col-xs-12 col-xs-6 col-xs-4");
    if (colcnt == 1) {
        $("#col-0").addClass("col-xs-12");
    }
    else if (colcnt == 2) {
        $("#col-0, #col-1").addClass("col-xs-6");
    }
    else if (colcnt == 3) {
        $("#col-0, #col-1, #col-2").addClass("col-xs-4");
    }

    var heights = [];
    $(".panel", "#elements").each(function(i) {
        heights[i] = $(this).outerHeight(true);
    });

    var bestpart = null;
    genPartitions(heights.length, colcnt, function(partition) {
        var colheights = $.map(partition, function(block) {
            var sum = 0;
            $.each(block, function(_, i) {
                sum += heights[i];
            })
            return sum;
        });
        var score = mathStdDev(colheights);

        if (bestpart === null || bestpart.score > score) {
            bestpart = {
                score: score,
                partition: partition
            }
        }
    });

    $(".panel", "#elements").each(function(i) {
        var col = null;
        for (var j = 0; j < colcnt; j++) {
            if (bestpart.partition[j].indexOf(i) >= 0) {
                col = j;
                break;
            }
        }
        $(this).data("col", col);
    });

    $(".panel", "#elements").each(function() {
        var col = $(this).data("col");
        if (col > 0)
            $(this).detach().appendTo($("#col-" + col, "#elements"));
    });
}

function buildElements() {
    var panels = {};

    $.each(elements, function(i, element) {
        var $item = $("<li></li>").addClass("list-group-item clearfix").attr("id", element.tag);
        $item.append(element.question);

        var $group = $("<div></div>").addClass("btn-group pull-right").attr('data-toggle', 'buttons');

        $.each(element.options, function(j, option) {
            var $label = $("<label></label>").addClass("btn btn-default").text(option.label);
            var $input = $("<input></input>").attr("type", "radio").attr("name", element.tag).attr("autocomplete", "off").val(option.value);

            if (option.default)
            {
                $label.addClass("active");
                $input.attr("checked", "checked");
            }

            $input.on("change", function() {
                doScore();
                checkDefault(element.tag);
            });

            $label.append($input);
            $group.append($label);
        });

        $item.append($group);

        if (!(element.heading in panels))
        {
            var $panel = $("<div></div>").addClass("panel panel-default");
            var $heading = $("<div></div>").addClass("panel-heading").text(element.heading);
            var $list = $("<ul></ul>").addClass("list-group");

            var $error = $("<li></li>").addClass("list-group-item list-group-item-danger error").hide();
            $list.append($error);

            $panel.append($heading);
            $panel.append($list);

            panels[element.heading] = $panel;
        }

        $(".list-group", panels[element.heading]).append($item);
    });

    $.each(panels, function(heading, $panel) {
        $("#col-0", "#elements").append($panel);
    });

    colcnt = colsCnt();
    colsSort();
}

function checkDefault(tag) {
    var answer = $("input[name=" + tag + "]:checked").val();

    $.each(elements, function(i, element) {
        if (element.tag == tag) {
            var $item = $("#" + tag);
            $item.removeClass('list-group-item-info');

            if (answer != element.default)
                $item.addClass('list-group-item-info');

            return true;
        }
    });
}

function loadAnswers(answers) {
    $.each(answers, function(tag, answer) {
        $("input[name=" + tag + "]").attr("checked", "").parent().removeClass("active");
        $("input[name=" + tag + "][value=" + answer + "]").attr("checked", "checked").parent().addClass("active");

        checkDefault(tag);
    });
}

$(function() {
    $.get("data/trashtrek.xml", function(data) {
        elements = parseData(data);
        buildElements();
        loadAnswers(JSON.parse($("#formanswers").val()));
        doScore();
    });

    $(window).resize(function() {
        var ncolcnt = colsCnt();
        /*if (ncolcnt != colcnt)*/ {
            colcnt = ncolcnt;
            colsReset();
            colsSort();
        }
    });

    $("#submitform").on("submit", function(e) {
        var score = doScore();
        var good = doValidate();
        if (good) {
            $("#submit").removeClass("btn-danger").addClass("btn-success");

            var answers = JSON.stringify(getAnswers());
            $("#formanswers").val(answers);

            var alertStr = $("#submitform input").map(function() {
                return $(this).attr("name") + "=" + $(this).val();
            }).get().join("\n");

            alert(alertStr);
        }
        else {
            $("#submit").addClass("btn-danger");

            // http://stackoverflow.com/a/6677069
            $("html, body").animate({
                scrollTop: $(".error:visible", "#elements").first().parents(".panel").offset().top - $("#elements").offset().top
            }, "slow");

            e.preventDefault();
        }
    });
});

// Used in data functions
function isEmpty(val) {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

function getAnswers() {
    var answers = {};
    $.each(elements, function(i, element) {
        answers[element.tag] = $("input[name=" + element.tag + "]:checked").val();
    });
    return answers;
}

function getScore() {
    var context = {
        answers: getAnswers()
    };

    var score = 0;

    // http://stackoverflow.com/a/25859853
    function evalInContext(js, context) {
        //# Return the results of the in-line anonymous function we .call with the passed context
        return function() { return eval(js); }.call(context);
    }

    $.each(elements, function(i, element) {
        evalInContext(element.score, context);
    });

    return Math.max(0, score);
}

function getErrors() {
    var context = {
        answers: getAnswers()
    };

    // http://stackoverflow.com/a/25859853
    function evalInContext(js, context) {
        //# Return the results of the in-line anonymous function we .call with the passed context
        return function() { return eval(js); }.call(context);
    }

    var errors = {};
    $.each(elements, function(i, element) {
        var ret = evalInContext(element.validate, context);

        if (ret && ret.highlight) {
            errors[element.tag] = ret.msg;
        }
    });

    return errors;
}

function doScore() {
    var score = getScore();
    $("#score").text(score);
    $("#formscore").val(score);
    return score;
}

function doValidate() {
    $icon = $("<span></span>").addClass("glyphicon glyphicon-alert").html("&nbsp;");

    var errors = getErrors();
    var errorcnt = 0;

    $(".error", "#elements").data("current", false);

    $.each(elements, function(i, element) {
        var $panel = $("#" + element.tag, "#elements").parents(".panel");
        var $error = $(".error", $panel);

        if (element.tag in errors) {
            errorcnt++;

            $error.text(errors[element.tag]);
            $error.prepend($icon.clone());
            if ($error.is(":hidden"))
                $error.slideDown();

            $error.data("current", true);
        }
        else {
            if ($error.is(":visible") && !$error.data("current"))
                $error.slideUp();
        }
    });

    return errorcnt == 0;
}
