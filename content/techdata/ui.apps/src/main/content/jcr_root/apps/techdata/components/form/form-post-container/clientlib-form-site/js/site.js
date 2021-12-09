var submitButton = document.getElementById("formSubmit");
var apacForm = document.getElementById("apac-form");

if (submitButton) {

    submitButton.addEventListener("click",(e) => {
        let data = new FormData(apacForm);
        data.delete(":formstart");
        data.delete("_charset_");
        let endPoint = "/bin/form";
        let newFormData = new FormData();
        var xhr = new XMLHttpRequest();
        xhr.open("POST", endPoint, true);
        xhr.send(data);
    });
}else {
    console.log("submit button null");
}
