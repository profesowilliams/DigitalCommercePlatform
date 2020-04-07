window.addEventListener("load", function () {
    paginator({
    get_rows: function () {
        return document.getElementById(document.getElementById("element").value).getElementsByTagName(document.getElementById("tagId").value);
    },
    box: document.getElementById(document.getElementById("paginationId").value),
    active_class: "color_page"
    });
    }, false);