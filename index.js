$(function() {
    $.get("data/trashtrek.xml", function(data) {
        $("#dump").text("");

        var $data = $(data);
        $("Element", $data).each(function() {
            var $panel = $("<div></div>").addClass("panel panel-default");
            var $heading = $("<div></div>").addClass("panel-heading");
            var $body = $("<div></div>").addClass("panel-body");

            var tag = $("Tag", this).text();

            $heading.text($("Heading", this).text());
            $body.append($("Question", this).text());

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

            $body.append($group);

            $panel.append($heading);
            $panel.append($body);
            $("#elements").append($panel);
        });
    });
});
