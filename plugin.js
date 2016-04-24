/* global jQuery:false */

(function ($) {

    $.fn.fieldsValidate = function (options) {

	
        var strengthType = options.type;

        return this.each(function () {

            var emailField = $("#email");
            var passwordField = $("#password");
            var postalCodeField = $("#postal-code");
            var cityField = $("#city");

            var email = emailField.val();
            var password = passwordField.val();
            var postalCode = postalCodeField.val();
			var city = cityField.val();

			var msg = "";
			
            // walidacja email
            var emailPattern = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
            var isEmailValid = emailPattern.test(email);

            if (isEmailValid) {
                $("#email").css("border-color", "green");
            } else {
                $("#email").css("border-color", "red");
				msg += "Popraw email<br>";
            }

            // sila hasla / entropia hasla
            var letters = "aąśćżąśźćębcdefghijklmnopqrstuvwxyz";
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
                for (j = 0; j < letters.length; j++) {

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

            // wlasna ocena
            var passwordStrength = groupsCnt * password.length;

            // ocena za pomoca entropii
            var passwordStrengthEntropy;
            if (alphabetSize === 0) {
                passwordStrengthEntropy = 0;
            } else {
                passwordStrengthEntropy = Math.round(password.length * (Math.log(alphabetSize) / Math.log(2)));
            }

            if (strengthType === "entropy") {

                if (passwordStrengthEntropy < 50) {
                    msg += "Siła hasła jest słaba<br>";
                   passwordField.css("border-color", "red").slideUp(1000).slideDown(1000);
                } else if (passwordStrengthEntropy < 110) {
                    msg += "Hasło jest średnie<br>";
                    passwordField.css("border-color", "orange");
                } else {
                    
                    passwordField.css("border-color", "green");
                }
            } else {
                if (passwordStrength < 35) {
                    msg += "Siła hasła jest słaba<br>";
                    passwordField.css("border-color", "red").slideUp(1000).slideDown(1000);
                } else if (passwordStrength < 70) {
                    msg += "Hasło jest średnie<br>";
                    passwordField.css("border-color", "orange");
                } else {
                    
                    passwordField.css("border-color", "green");
                }
            }

            // kod pocztowy

            var postalPattern = new RegExp("^[0-9]{2}\-[0-9]{3}$");
            var isPostalValid = postalPattern.test(postalCode);

            if (isPostalValid) {
                postalCodeField.css("border-color", "green");
                
            } else {
                postalCodeField.css("border-color", "red");
				msg += "Popraw kod pocztowy<br>";
                
            }

			
			var cityPattern = new RegExp("^[a-zA-Z _][a-zA-Z0-9]{1,32}$");
            var isCityValid = cityPattern.test(city);

			if (isCityValid) {
                cityField.css("border-color", "green");
			} else {
                cityField.css("border-color", "red");
				msg += "Popraw miasto<br>";
            }

			
            $("#msg").html(msg);
        });
    };
})(jQuery);