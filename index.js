$(function() {
    $.get("data/trashtrek.xml", function(data) {
        $("#dump").text("");

        var panels = {};

        var $data = $(data);
        $("Element", $data).each(function() {
            var heading = $("Heading", this).text();
            var question = $("Question", this).text();
            var tag = $("Tag", this).text();

            var $row = $("<div></div>").addClass("row");
            $row.append($("Question", this).text());

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

            $row.append($group);

            if (!(heading in panels))
            {
                var $panel = $("<div></div>").addClass("panel panel-default");
                var $heading = $("<div></div>").addClass("panel-heading").text(heading);
                var $body = $("<div></div>").addClass("panel-body");

                $panel.append($heading);
                $panel.append($body);

                panels[heading] = $panel;
            }

            $(".panel-body", panels[heading]).append($row);
        });

        for (var heading in panels)
        {
            $("#elements").append(panels[heading]);
        }
    });
});
