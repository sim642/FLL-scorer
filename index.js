var tags = [];
var scoreFuncs = [];
var validateFuncs = [];

$(function() {
    $.get("data/trashtrek.xml", function(data) {
        $("#dump").text("");

        var panels = {};

        var $data = $(data);
        $("Element", $data).each(function() {
            var heading = $("Heading", this).text();
            var question = $("Question", this).text();
            var tag = $("Tag", this).text();
            var score = $("Score", this).text();
            var validate = $("Validate", this).text();

            tags.push(tag);
            scoreFuncs.push(score);
            validateFuncs.push(validate);

            var $item = $("<li></li>").addClass("list-group-item clearfix");
            $item.append(question);

            var $group = $("<div></div>").addClass("btn-group pull-right").attr('data-toggle', 'buttons');
            $("Option", this).each(function() {
                var $label = $("<label></label>").addClass("btn btn-default").text($("Label", this).text());
                var $input = $("<input></input>").attr("type", "radio").attr("name", tag).attr("autocomplete", "off").val($("Value", this).text());

                if ($("Default", this).length > 0)
                {
                    $label.addClass("active");
                    $input.attr("checked", "checked");
                }

                $label.append($input);
                $group.append($label);
            });

            $item.append($group);

            if (!(heading in panels))
            {
                var $panel = $("<div></div>").addClass("panel panel-default");
                var $heading = $("<div></div>").addClass("panel-heading").text(heading);
                var $list = $("<ul></ul>").addClass("list-group");

                $panel.append($heading);
                $panel.append($list);

                panels[heading] = $panel;
            }

            $(".list-group", panels[heading]).append($item);
        });

        for (var heading in panels)
        {
            $("#elements").append(panels[heading]);
        }
    });
});

function isEmpty(val) {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

function calcScore()
{
    var answers = {};
    $.each(tags, function(i, tag) {
        answers[tag] = $("input[name=" + tag + "]:checked").val();
    });

    var context = {
        answers: answers
    };

    var score = 0;

    // http://stackoverflow.com/a/25859853
    function evalInContext(js, context) {
        //# Return the results of the in-line anonymous function we .call with the passed context
        return function() { return eval(js); }.call(context);
    }

    $.each(scoreFuncs, function(i, scoreFunc) {
        evalInContext(scoreFunc, context);
    });

    return score;
}


function validate()
{
    var answers = {};
    $.each(tags, function(i, tag) {
        answers[tag] = $("input[name=" + tag + "]:checked").val();
    });

    var context = {
        answers: answers
    };

    // http://stackoverflow.com/a/25859853
    function evalInContext(js, context) {
        //# Return the results of the in-line anonymous function we .call with the passed context
        return function() { return eval(js); }.call(context);
    }

    $.each(validateFuncs, function(i, validateFunc) {
        var ret = evalInContext(validateFunc, context);

        if (ret && ret.highlight) {
            console.log(tags[i], ret.msg);
        }
    });
}
