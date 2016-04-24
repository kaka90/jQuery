/* global jQuery:false */

(function ($) {

    $.fn.fillCity = function () {

        return this.each(function () {

            var postalCodeField = $("#postal-code");
            var cityField = $("#city");
            var postalCode = postalCodeField.val();

            // kod pocztowy

            var postalPattern = new RegExp("^[0-9]{2}\-[0-9]{3}$");
            var isPostalValid = postalPattern.test(postalCode);

            if (isPostalValid) {

                $.get('kody.csv', function(data) {
                    var lines = data.split("\n");
                    for (var i = 0; i < lines.length; i++) {
                        var s = lines[i].split("\t");
                        if (s[0] === postalCode) {
                            cityField.val(s[1]);
                            break;
                        }
                    }
                });

                postalCodeField.css("border-color", "green");
                cityField.css("border-color", "green");
            } else {
                postalCodeField.css("border-color", "");
                cityField.css("border-color", "");
            }
        });
    };


    $.fn.fieldsValidate = function (options) {
        var strengthType = options.type;

        // wyznacza string powstaly z unikalnych liter wejsciowego stringa
        function uniqueChar(str) {
            var uniq = "";
            for (var x=0;x < str.length;x++) {
                if(uniq.indexOf(str.charAt(x))==-1) {
                    uniq += str[x];
                }
            }
            return uniq;
        }

        return this.each(function () {

            var emailField = $("#email");
            var passwordField = $("#password");

            var email = emailField.val();
            var password = passwordField.val();

            // walidacja email
            var emailPattern = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
            var isEmailValid = emailPattern.test(email);

            if (isEmailValid) {
                emailField.css("border-color", "green");
            } else {
                emailField.css("border-color", "red");
            }

            var msg = "";

            // sila hasla / entropia hasla
            var letters = "abcdefghijklmnopqrstuvwxyz";
            var digits = "0123456789";
            var punctuation1 = "!@#$%^&*()";
            var punctuation2 = '~`-_=+[]{}\\|;:\'",.<>?/';


            var lettersLowercaseCnt = 0;
            var lettersUpperCaseCnt = 0;
            var digitsCnt = 0;
            var punctuation1Cnt = 0;
            var punctuation2Cnt = 0;

            var puncLen1 = punctuation1.length;
            var puncLen2 = punctuation2.length;

            var j;

            for (var i = 0, len = password.length; i < len; i++) {
                for (j = 0; j < 26; j++) {

                    if (password[i] === letters[j]) {
                        lettersLowercaseCnt++;
                        break;
                    } else if (password[i] === letters[j].toUpperCase()) {
                        lettersUpperCaseCnt++;
                        break;
                    }
                }

                for (j = 0; j < 10; j++) {
                    if (password[i] === digits[j]) {
                        digitsCnt++;
                        break;
                    }
                }

                for (j = 0; j < puncLen1; j++) {
                    if (password[i] === punctuation1[j]) {
                        punctuation1Cnt++;
                        break;
                    }
                }

                for (j = 0; j < puncLen2; j++) {
                    if (password[i] === punctuation2[j]) {
                        punctuation2Cnt++;
                        break;
                    }
                }
            }

            var groupsCnt = 0;
            var alphabetSize = 0;
            if (lettersLowercaseCnt > 0) {
                groupsCnt++;
                alphabetSize += letters.length;
            }
            if (lettersUpperCaseCnt > 0) {
                groupsCnt++;
                alphabetSize += letters.length;
            }
            if (digitsCnt > 0) {
                groupsCnt++;
                alphabetSize += digits.length;
            }
            if (punctuation1Cnt > 0) {
                groupsCnt++;
                alphabetSize += punctuation1.length;
            }

            if (punctuation2Cnt > 0) {
                groupsCnt++;
                alphabetSize += punctuation2.length;
            }

            var uniquePassword = uniqueChar(password);
            var passwordWeightedLen = 0.2 * password.length + 0.8 * uniquePassword.length;

            // wlasna ocena
            var passwordStrength = groupsCnt * passwordWeightedLen;



            // ocena za pomoca entropii
            var passwordStrengthEntropy;
            if (alphabetSize == 0) {
                passwordStrengthEntropy = 0;
            } else {
                passwordStrengthEntropy = Math.round(passwordWeightedLen * (Math.log(alphabetSize) / Math.log(2)));
            }

            console.log(passwordStrengthEntropy);

            if (strengthType === "entropy") {

                if (passwordStrengthEntropy < 45) {
                    msg += "Password is weak<br>";
                   passwordField.css("border-color", "red");
                } else if (passwordStrengthEntropy < 90) {
                    msg += "Password is average<br>";
                    passwordField.css("border-color", "orange");
                } else {
                    msg += "Password is strong<br>";
                    passwordField.css("border-color", "green");
                }
            } else {
                if (passwordStrength < 35) {
                    msg += "Password is weak<br>";
                    passwordField.css("border-color", "red");
                } else if (passwordStrength < 70) {
                    msg += "Password is average<br>";
                    passwordField.css("border-color", "orange");
                } else {
                    msg += "Password is strong<br>";
                    passwordField.css("border-color", "green");
                }
            }


            // kod pocztowy (tylko sprawdzenie poprawnosci)
            var postalCodeField = $("#postal-code");
            var postalCode = postalCodeField.val();
            var postalPattern = new RegExp("^[0-9]{2}\-[0-9]{3}$");
            var isPostalValid = postalPattern.test(postalCode);

            if (!isPostalValid) {
                postalCodeField.css("border-color", "red");
            }
            $("#msg").html(msg);
        });
    }
})(jQuery);