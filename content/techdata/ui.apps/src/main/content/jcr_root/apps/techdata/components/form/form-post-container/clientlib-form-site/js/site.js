var submitButton = document.getElementById("formSubmit");
var apacForm = document.getElementById("apac-form");

function createFormData(form)
{
    var newData    = new FormData();
    var inputs     = form.getElementsByTagName('input');
    var selects     = form.getElementsByTagName('input');
    var inputsList = Array.prototype.slice.call(inputs);

    inputsList.forEach(
        function (i) {
            if (!i.name.startsWith(":formstart") && !i.name.startsWith("_charset_")) {
                newData.append(i.name, i.value);
            }
        }
    );

    return newData;
}

if (submitButton) {

    submitButton.addEventListener("click",(e) => {
        let data = createFormData(apacForm);
        let endPoint = "/bin/form";
        var xhr = new XMLHttpRequest();
        xhr.open("POST", endPoint, true);
        xhr.send(data);
    });
}else {
    console.error("Submit Button Not Configured.");
}