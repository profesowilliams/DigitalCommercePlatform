window.addEventListener("load", function () {
    paginator({
    get_rows: function () {
        return document.getElementById("list").getElementsByTagName("li");
    },
    box: document.getElementById("list_index"),
    active_class: "color_page"
    });
    }, false);


