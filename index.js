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
        $('#elements').append($panel);
    });
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

    return score;
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
    var errors = getErrors();
    var errorcnt = 0;

    $.each(elements, function(i, element) {
        var $panel = $("#" + element.tag, "#elements").parents(".panel");
        var $error = $(".error", $panel);

        if (element.tag in errors) {
            errorcnt++;

            $error.text(errors[element.tag]);
            if ($error.is(":hidden"))
                $error.slideDown();
        }
        else {
            if ($error.is(":visible"))
                $error.slideUp();
        }
    });

    return errorcnt == 0;
}
