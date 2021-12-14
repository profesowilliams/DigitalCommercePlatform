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
        var textAreas = form.getElementsByTagName('textarea');
        var textAreasList = Array.prototype.slice.call(textAreas);
        var errorBlockId = "cmp-form-error-block";
        var invalidFileSizeText = "Validation Failed for file upload: invalid file size.";
        var invalidFileExtnText = "Validation Failed for file upload: invalid file extension.";
        var WRONG_FILE_SIZE_STATUS = "-1";
        var WRONG_FILE_EXTN_STATUS = "-2";

        inputsList.forEach(
            function (i, e) {
                if (!i.name.startsWith(":formstart") && !i.name.startsWith("_charset_")) {
                    let fsize = 0;
                    let file = 0;
                    if (i.type.startsWith("file")) {
                        if (i.files.length > 0) {
                            newData.append(i.name, i.files[0], i.files[0].name);
                            console.log("name of file is " + i.files[0].name);
                            processFileValidations(i.files[0], e);
                        }
                    } else if (i.type.startsWith("radio")) {
                        if (i.checked) {
                            newData.append(i.name, i.value);
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

        textAreasList.forEach(
            function (i) {
                newData.append(i.name, i.value);
            }
        );

        return newData;
    }

    function processFileValidations(fileEle, e) {
        //  validate file for invalid file size and extensions
        var invalidFileStatusCode = invalidFile(fileEle);
        if(invalidFile(fileEle) == WRONG_FILE_SIZE_STATUS) {
                document.getElementById(errorBlockId).innerHTML = invalidFileSizeText;
            e.preventDefault();
        } else if(invalidFile(fileEle) == WRONG_FILE_EXTN_STATUS) {
            document.getElementById(errorBlockId).innerHTML = invalidFileExtnText;
            e.preventDefault();
        }
    }

    function invalidFile(fileEle) {
        var formEle = document.getElementById('tdForm');
        var thresholdFileSize = formEle.getAttribute('data-thresholdFileSize');
        var allowedFileTypes = formEle.getAttribute('data-allowedFileTypes');
        var fileThresholdInMB = 10;
        if(thresholdFileSize) {
            fileThresholdInMB = parseInt(thresholdFileSize);
        }
        let fsize = fileEle.size;
        let fileSizeInMB = Math.round((fsize / (1024*1000)));
        if (fileSizeInMB >= fileThresholdInMB) {
            return WRONG_FILE_SIZE_STATUS;
        }
        var fileSplits = fileEle.name.split('.');
        var fileExtension = fileSplits[fileSplits.length - 1];

        if(fileExtension && !allowedFileTypes.indexOf('.' + fileExtension)) {
            return WRONG_FILE_EXTN_STATUS;
        }
        return "0";
    }

    function successFlow(redirectSuccess) {
        if (redirectSuccess && redirectSuccess.length > 0) {
            window.location = redirectSuccess[0].value;
        } else {
            window.location = "/";
        }
    }

    function inputErrorMessageDisplay(type, e, inputElement) {
        var originalBorderColor = e.target.style.borderColor;
        var targetElement = e.target;
        var parentDiv = targetElement.closest("div");
        var errorLabel = document.createElement("label");
        parentDiv.appendChild(errorLabel);
        errorLabel.style.color = "red";
        const validityState = inputElement.validity;

        if (validityState.valueMissing)
        {
            errorLabel.innerText = (parentDiv.dataset.cmpRequiredMessage ? parentDiv.dataset.cmpRequiredMessage : "This field is required");
        }else if (validityState.typeMismatch) {
            errorLabel.innerText = (parentDiv.dataset.cmpConstraintMessage ? parentDiv.dataset.cmpConstraintMessage : "This field content does not match the type of " + type);
        }

        setTimeout(function() { parentDiv.removeChild(errorLabel); e.target.style.borderColor = originalBorderColor  }, 10000);
    }

    function initValidation(form)
    {
        var inputs = form.getElementsByTagName('input');
        var selects = form.getElementsByTagName('input');
        var inputsList = Array.prototype.slice.call(inputs);
        var selects = form.getElementsByTagName('select');
        var selectsList = Array.prototype.slice.call(selects);
        var textAreas = form.getElementsByTagName('textarea');
        var textAreasList = Array.prototype.slice.call(textAreas);

        inputsList.forEach(
            function (i, e) {
                var addEventListener = i.addEventListener('invalid', function(e) {
                    inputErrorMessageDisplay(i.type, e, i);
                });
            }
        );

        textAreasList.forEach(
            function (i, e) {
                var addEventListener = i.addEventListener('invalid', function(e) {
                    inputErrorMessageDisplay(i.type, e, i);
                });
            }
        );

    }

    documentReady(function() {
        var submitButton = document.getElementById("formSubmit");
        var tdForm = document.getElementById("tdForm");
        var redirectSuccess = document.getElementsByName(":redirect");

        initValidation(tdForm);

        if (!tdForm)
        {
            console.error("Form ID not configured");
        }

        if (submitButton) {


            submitButton.addEventListener("click", (e) => {
                if (tdForm.reportValidity())
                {
                    submitButton.disabled = true;
                    let data = createFormData(tdForm);
                    let endPoint = "/bin/form";
                    var xhr = new XMLHttpRequest();
                    var handlePOSTRequest = function () { // Call a function when the state changes.
                        if (xhr.status === 200) {
                            console.log("Successfully submitted");
                            successFlow(redirectSuccess);
                        } else if (xhr.status === 404 || xhr.status === 500 || xhr.status === 503) {
                            console.error("Error in submitting form")
                        }
                    };
                    xhr.onreadystatechange = handlePOSTRequest;
                    xhr.open("POST", endPoint, true);
                    xhr.send(data);
                }else{
                    e.preventDefault();
                    console.error();
                }

            });
        } else {
            console.error("Submit Button Not Configured.");
        }
    });

})();