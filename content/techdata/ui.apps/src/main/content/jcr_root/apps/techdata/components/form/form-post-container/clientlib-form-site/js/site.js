(function() {

    var errorMessage = document.getElementById("errorMessage");

    function documentReady(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function createFormData(form) {
        var newData = new FormData();
        var inputs = form.getElementsByTagName('input');
        var selects = form.getElementsByTagName('input');
        var inputsList = Array.prototype.slice.call(inputs);
        var selects = form.getElementsByTagName('select');
        var selectsList = Array.prototype.slice.call(selects);

        inputsList.forEach(
            function (i) {
                if (!i.name.startsWith(":formstart") && !i.name.startsWith("_charset_")) {
                    if (i.type.startsWith("file")) {
                        if (i.files.length > 0) {
                            newData.append(i.name, i.files[0], i.files[0].name);
                            console.log("name of file is " + i.files[0].name);
                        }

                    } else {
                        newData.append(i.name, i.value);
                    }

                }
            }
        );

        selectsList.forEach(
            function (i) {
                if (!i.name.startsWith(":formstart") && !i.name.startsWith("_charset_")) {
                    newData.append(i.name, i.options[i.selectedIndex].value);
                }
            }
        );

        return newData;
    }

    function successFlow(redirectSuccess) {
        if (redirectSuccess && redirectSuccess.length > 0) {
            window.location = redirectSuccess[0].value;
        } else {
            window.location = "/";
        }
    }

    documentReady(function() {
        var submitButton = document.getElementById("formSubmit");
        var tdForm = document.getElementById("tdForm");
        var redirectSuccess = document.getElementsByName(":redirect");

        if (!tdForm)
        {
            console.error("Form ID not configured");
        }

        if (submitButton) {

            submitButton.addEventListener("click", (e) => {
                submitButton.disabled = true;
                let data = createFormData(tdForm);
                let endPoint = "/bin/form";
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () { // Call a function when the state changes.
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                        console.log("successfully submitted");
                        successFlow(redirectSuccess);
                    } else if (this.status === 404 || this.status === 500 || this.status === 503) {
                        console.error("Error in submitting form")
                    }
                }
                xhr.open("POST", endPoint, true);
                xhr.send(data);
            });
        } else {
            console.error("Submit Button Not Configured.");
        }
    });

})();