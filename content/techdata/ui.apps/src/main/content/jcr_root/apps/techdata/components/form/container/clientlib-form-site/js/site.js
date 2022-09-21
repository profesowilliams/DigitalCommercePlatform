(function() {
    var errorMessage = document.getElementById("errorMessage");
    var errorBlockId = "cmp-form-error-block";
    var WRONG_FILE_SIZE_STATUS = "-1";
    var WRONG_FILE_EXTN_STATUS = "-2";
    const errorLabelClass = 'error-label';
    const INVALID_CHARACTERS_MSG = 'This field contains Invalid Characters. Please correct';
    const INVALID_FILE_MSG = 'Invalid file size or type, recheck and try again.';
    const pdfRegex = new RegExp('^.*\.(pdf | PDF)$');

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
        var labels = form.getElementsByTagName('label');
        // Remove error message when submit and try again
        Array.from(labels).forEach(function (label) {
            if (label.innerText == INVALID_CHARACTERS_MSG) {
                label.remove();
            }
        });

        var inputsList = Array.prototype.slice.call(inputs);
        var selects = form.getElementsByTagName('select');
        var selectsList = Array.prototype.slice.call(selects);
        var textAreas = form.getElementsByTagName('textarea');
        var textAreasList = Array.prototype.slice.call(textAreas);
        var invalidFileStatus = false;
        var invalidInputStatus = false;
        setErrorMessage('');

        inputsList.forEach(
            function (input) {
                if (!input.name.startsWith(":formstart") && !input.name.startsWith("_charset_")) {
                    let fsize = 0;
                    let file = 0;
                    if (input.type.startsWith("file")) {
                        if (input.files.length > 0) {
                            var fileExtension = input.files[0].name;
                            if(pdfRegex.test(fileExtension)){
                                newData.append(input.name, input.files[0], input.files[0].name);
                                if(!processFileValidations(input.files[0])) {
                                    invalidFileStatus = true;
                                    return;
                                }
                            }else {
                              setErrorMessage('Invalid file size or type, recheck and try again.');
                                invalidFileStatus = true;
                                validateFileOnSubmit();
                                return;
                            }
                        }

                    } else if (input.type.startsWith("radio") || input.type.startsWith("checkbox")) {
                        if (input.checked) {
                            newData.append(input.name, input.value);
                        }else {
                            newData.append(input.name, "");
                       }
                    }

                    else {
                        // see if is neccesary to apply the validation for that input
                        if (input.hasAttribute('required') || input.value !== '' ){
                            if (validateAddress(input, input.value)){
                                newData.append(input.name, input.value);
                            } else {
                                invalidInputStatus = true;
                                return;
                            }
                       }
                    }
                }
            }
        );

        selectsList.forEach(
            function (input) {
                if (!input.name.startsWith(":formstart") && !input.name.startsWith("_charset_")) {
                    newData.append(input.name, input.options[input.selectedIndex].value);
                }
            }
        );

        textAreasList.forEach(
            function (input) {
                if(validateAddress(input, input.value)){
					newData.append(input.name, input.value);
                } else {
                    invalidInputStatus = true;
                    return;
                }
            }
        );
        if(invalidFileStatus || invalidInputStatus) return null;
        var currPageName = document.getElementById("tdForm").getAttribute('currentpage-path');
        if(currPageName) {
            newData.append("currentpage", currPageName);
        }
        return newData;
    }

    function setErrorMessage(message) {
        document.getElementById(errorBlockId).innerHTML = message;
    }

    function validateFileOnSubmit(){
        $("#formSubmit").click(function(event){
            event.preventDefault();
        });
    }

    function handlerInputFile() {
        let submitButton = document.getElementById("formSubmit");
        submitButton.disabled = false;
    }

    function validateAddress(element,value){
        handlerInputFile();
        var formEle = document.getElementById('tdForm');
        var excludedChars = formEle.getAttribute('data-excludedChars');
        var originalBorderColor = element.style.borderColor;
        var parentDiv = element.closest("div");
        var errorLabel = document.createElement("label");
        parentDiv.appendChild(errorLabel);
        errorLabel.style.color = "red";
        //building regex based on exclude chars
        if(excludedChars) {
			var expression = `.*${excludedChars}.*`;
			var re = new RegExp(expression, 'g');
            if(re.test(value)) {
                parentDiv.childNodes.forEach(child => {
                  if (child.nodeName == 'LABEL' && child.innerText == INVALID_CHARACTERS_MSG) {
                        parentDiv.removeChild(child);
                        parentDiv.removeChild(errorLabel);
                    }
                });
                errorLabel.innerText = INVALID_CHARACTERS_MSG;
                element.focus();
                setTimeout(function() {
                    element.style.borderColor = originalBorderColor  },
                10000);
                return false;
            }
    	}
        return true;
    }


    function processFileValidations(fileEle) {
        //  validate file for invalid file size and extensions
        var invalidFileStatusCode = invalidFile(fileEle);
        if(invalidFile(fileEle) == "-1" || invalidFile(fileEle) == "-2") {
            setErrorMessage("Invalid file size or type, recheck and try again.");
            return false;
        }
        return true;
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
            return "-1";
        }
        var fileSplits = fileEle.name.split('.');
        var fileExtension = null;
        if(fileSplits.length > 1) {
            fileExtension = fileSplits[fileSplits.length - 1];
        }
        if(fileExtension) {
            if(allowedFileTypes && allowedFileTypes?.indexOf('.' + fileExtension) == -1) {
                return "-2";
            }
        } else {
            return "-2";
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

    function validateRepeatedLabels(parentDiv, errorLabelInnertext) {
        const nodeList = parentDiv.querySelectorAll("label");
        let flagErrorMessage = true; 
        nodeList.forEach(n => {
            if (n.innerText == errorLabelInnertext) {
                flagErrorMessage = false;
            }
        });
        return flagErrorMessage;
    }

    function inputErrorMessageDisplay(type, e, inputElement) {
        var originalBorderColor = e.target.style.borderColor;
        var targetElement = e.target;
        var parentDiv = targetElement.closest("div");
        var errorLabel = document.createElement("label");
        errorLabel.className = errorLabelClass;
        let errorLabelInnertext = parentDiv.dataset.cmpRequiredMessage ? parentDiv.dataset.cmpRequiredMessage : "This field is required";
        const querySelector = parentDiv.querySelector("fieldset");
        const lineBreak = document.createElement('br');
        let flagOptionBR = false;
        let flagFileBR = parentDiv.querySelector('input[type=file]');
        if (querySelector) {
            parentDiv = querySelector;
            flagOptionBR = querySelector.querySelector('input[type=checkbox]');// validate if is type checkbox
            errorLabelInnertext = querySelector.dataset.cmpConstraintMessage ? querySelector.dataset.cmpConstraintMessage : "This field is required";
        }
        errorLabel.style.color = "red";
        const validityState = inputElement.validity;
        if (validityState.valueMissing) {
            flagOptionBR && parentDiv.appendChild(lineBreak);
            flagFileBR && parentDiv.appendChild(lineBreak);
            errorLabel.innerHTML = errorLabelInnertext;
        }else if (validityState.typeMismatch) {
            
            errorLabel.innerText = (parentDiv.dataset.cmpConstraintMessage ? parentDiv.dataset.cmpConstraintMessage : "This field content does not match the type of " + type);
        } else {
            validateAddress(inputElement, inputElement.value);
        }
        const flagErrorMessage = validateRepeatedLabels(parentDiv, errorLabelInnertext)
        if (flagErrorMessage) {
            parentDiv.appendChild(errorLabel);
        }
    }

    function initValidation(form)
    {
        var inputs = form.getElementsByTagName('input');
        var inputsList = Array.prototype.slice.call(inputs);
        var selects = form.getElementsByTagName('select');
        var selectsList = Array.prototype.slice.call(selects);
        var textAreas = form.getElementsByTagName('textarea');
        var textAreasList = Array.prototype.slice.call(textAreas);

        inputsList.forEach(
            function (input, e) {
                input.addEventListener('invalid', function(e) {
                    inputErrorMessageDisplay(input.type, e, input);
                    // onChange handler
                    input.addEventListener('input', function(e) {
                        removeErrorLabelChild(input)
                    });
                });
                    
            }
        );

        textAreasList.forEach(
            function (input, e) {
                input.addEventListener('invalid', function(e) {
                    inputErrorMessageDisplay(input.type, e, input);
                    // onChange handler
                    input.addEventListener('input', function(e) {
                        removeErrorLabelChild(input)
                    });
                });
            }
        );

        selectsList.forEach((input) => {
                input.addEventListener('invalid', (e) => {
                    inputErrorMessageDisplay(input.type, e, input);
                    // Add CLICK event listener to parent of the element 
                    const parentDiv = input.closest("fieldset");
                    parentDiv.addEventListener('click', (e) => removeErrorLabelChild(input));
                });
            }
        );
    }
    
    function removeErrorLabelChild(input) {
        const inputType = input.type;
        const flagFieldsetField = inputType === 'checkbox' || inputType === 'select' || inputType === 'radio' || inputType === 'select-one' || inputType === 'select-multiple'; ;
        const parentDiv = flagFieldsetField ? input.closest("fieldset") : input.closest("div");
        const errorLabel = parentDiv.getElementsByClassName(errorLabelClass)[0];
        if (flagFieldsetField) {
            try {
                const br = parentDiv.querySelector('br');
                br.remove();    
            } catch (error) {
                console.error("try catch error", error)    
            }
        }
        parentDiv.removeChild(errorLabel);
    }

    documentReady(function() {
        var submitButton = document.getElementById("formSubmit");
        var tdForm = document.getElementById("tdForm");
        var redirectSuccess = document.getElementsByName(":redirect");
        if (tdForm) {
            initValidation(tdForm);
        }
        if(tdForm) {
            var inputs = tdForm.getElementsByTagName('input'); // get input files in the form
            var inputsList = Array.prototype.slice.call(inputs); // creating an array
            inputsList.forEach( // iterating array to search the input file
              function (input, e) {
                    if (!input.name.startsWith(":formstart") && !input.name.startsWith("_charset_")) {
                        if (input.type.startsWith("file")) { // Founding input file
                            var addEventListener = input.addEventListener("change", handlerInputFile, false); // Adding event listener
                        } else {
                            var addEventListener = input.addEventListener("change", handlerInputFile, false); // Adding event listener
                        }
                    }
                }
            );
        }

		/**
         * handler that change the attribute of the submit button when the user upload something
         * and permit validate again the file
         */

        if (submitButton) {
            submitButton.addEventListener("click", (e) => {
                if (tdForm.reportValidity())
                {
                    submitButton.disabled = true;
                    let data = createFormData(tdForm);
                    if(data == null) {
                        e.preventDefault();
                        console.warn('validation failed for form');
                    } else {
                        let endPoint = "/content/techdata/apis/tdpostform";
                        var xhr = new XMLHttpRequest();
                        var handlePOSTRequest = function () { // Call a function when the state changes.
                            if (xhr.status === 200) {
                                console.log("Successfully submitted");
                                successFlow(redirectSuccess);
                            } else if (xhr.status === 404 || xhr.status === 500 || xhr.status === 503 || xhr.status === 415) {
                                console.error("Error in submitting form");
                            }
                        };
                        xhr.onreadystatechange = handlePOSTRequest;
                        xhr.open("POST", endPoint, true);
                        xhr.send(data);
                    }
                }else{
                    e.preventDefault();
                    console.error();
                }
            });
        }
    });
})();