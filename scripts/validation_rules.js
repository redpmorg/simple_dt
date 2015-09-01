/**
 * General Validation Rules
 * @authors Leonard LEPADATU (lepadatu.leonard-ext@groupehn.com)
 * @date    2015-07-06 10:07:27
 * @version $Id$
 */

 var validationMessageLanguage = !validationMessageLanguage ? "fr" : validationMessageLanguage;
 var validationConstraints = {
	messages: {
		text: {
			notEmpty: {
				en: "This text cannot be empty!",
				fr: "Ce texte ne peut être vide!",
				ro: "Acest text nu poate fi gol!"
			},
		},
		integer: {
			isValid: {
				en: "This must be a number but non zero!",
				fr: "Ce doit être un nombre, mais non nulle!",
				ro: "Acesta trebuie sa fie un numar, dar nu zero!"
			},
		},
		url: {
			isValid: {
				en: "This field must be of the form:http://...!",
				fr: "Ce champ doit être de la forme:http://...!",
				ro: "Acest camp trebuie sa fie de forma: http://...!"
			},
		},
		color: {
			isValid: {
				en: "This color code it seems that is not valid!",
				fr: "Ce code de couleur, il semble que est pas valable!",
				ro: "Acest cod de culoare, se pare că nu este valid!"
			}
		},
		email: {
			isValid: {
				en: "Please enter a valid email!",
				fr: "S'il vous plaît entrer une adresse email valide!",
				ro: "Va rog introduceti o adresa de email valida!"
			},
			validDomain: function(d) {
				return {
					en: "Please enter a valid email on domain &lt;" + d +"&gt; !",
					fr: "S'il vous plaît entrer une adresse email valide on domaine &lt;" + d +"&gt; !",
					ro: "Va rog introduceti o adresa de email valida in domeniul &lt;" + d +"&gt; !"
				}
			}
		},
		date: {
			isValid: {
				en: "Please enter a valid date!",
				fr: "S'il vous plaît entrer une date valide!",
				ro: "Va rog introduceti o data valida!"
			},
			smallerThan: function(d) {
				return {
					en: "Please enter a date smaller than &lt;" + d +"&gt; !",
					fr: "S'il vous plaît entrer une date plus petit que &lt;" + d +"&gt; !",
					ro: "Va rog introduceti o data mai mica decat &lt;" + d +"&gt; !"
				}
			}
		},
		password: {
			areTheSame: {
				en: "Password and confirmation are not the same!",
				fr: "Mot de passe et la confirmation ne sont pas la même chose!",
				ro: "Confirmarea parolei nu este identica!"
			}
		},
	},

	rules: {
		text: {
			notEmpty: function(v) {
				var valid = ("" != v || 0 != v.length) ? true : false;
				return {
					validity: valid,
					message: validationConstraints.messages.text.notEmpty[validationMessageLanguage]
				}
			}
		},

		integer: {
			notZero: function(v) {
				var valid = (0 != v && !isNaN(v)) ? true : false;
				return {
					validity: valid,
					message: validationConstraints.messages.integer.isValid[validationMessageLanguage]
				}
			},
		},

		url: {
			isValid: function(v) {
				var myRegExp = /^(http|https|ftp):\/\//i;
				var valid = (myRegExp.test(v)) ? true : false;
				return {
					validity: valid,
					message: validationConstraints.messages.url.isValid[validationMessageLanguage]
				}
			},
		},

		email:{
			isValid: function(v) {
				var myRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[a-z]{2,4}$/i;
				var valid = (myRegExp.test(v)) ? true : false;
				return {
					validity: valid,
					message: validationConstraints.messages.email.isValid[validationMessageLanguage]
				}
			},
			validDomain: function(v) {
				var validEmailDomain = "groupehn.com";
				var validEmail = validationConstraints.rules.email.isValid(v).validity;
				var valid = (validEmail && validEmailDomain == v.split('@').pop()) ? true : false;
				return {
					validity: valid,
					message: validationConstraints.messages.email.validDomain(validEmailDomain)[validationMessageLanguage]
				}
			}
		},

		color: {
			isValid: function(v) {
				var myRegExp = /^(#):?([a-zA-Z0-9]{3,6})$/i;
				var valid = (myRegExp.test(v)) ? true : false;
				return {
					validity: valid,
					message: validationConstraints.messages.color.isValid[validationMessageLanguage]
				}
			}
		},

		dateSimple: {
			isValid: function(v) {
				if("" !== v){
					var dateArray = v.split("/");
					var newDate = new Date(dateArray[2], dateArray[1], dateArray[0]);
					var valid = ("Invalid Date" != newDate) ? true : false;
				} else {
					valid = true;
				}
				return {
					validity: valid,
					message: validationConstraints.messages.date.isValid[validationMessageLanguage],
					dateObj: newDate
				}
			}
		},

		dateComplex: {
			smallerThan: function(v, param) {
				var refDate = $('[name="'+ param +'"]').val();
				var d = validationConstraints.rules.dateSimple;

				var myDate  = d.isValid(v).dateObj;
				refDate = d.isValid(refDate).dateObj;

				var valid = true;
				var mess = validationConstraints.messages.date.smallerThan(param)[validationMessageLanguage];

				if('undefined' == typeof myDate || 'Invalid Date' == myDate || 'Invalid Date' == refDate) {
					valid = false;
					mess = validationConstraints.messages.date.isValid[validationMessageLanguage];
				} else if( 'Invalid Date' == myDate && 'undefined' == typeof refDate ) {
					valid = true;
				} else if( myDate > refDate ) {
					valid = false;
				}

				return {
					validity: valid,
					message: mess
				}
			}
		},

		password: {
			areTheSame: function(currentPassword, param) {
				var comparedPassword = $('[name="' + param + '"]').val();
				var valid = (currentPassword == comparedPassword);
				return {
					validity: valid,
					message: validationConstraints.messages.password.areTheSame[validationMessageLanguage]
				}
			},
		},
	},
 }

 var validationAction = function() {
	$(".validationMessages").prev("input, select, texarea").removeClass("input-error");
	$(".validationMessages").remove();
	var form = $('#addeditForm');//$(this).closest('form');

	var inp = $("input, select, texarea", form).each(function(){
		$this = $(this);
		if($this.data() && $this.data("req")) {
			var validationConstraint = $this.data("req");

			// rK - ruleKey, rV - ruleValue, cR - complexRule, cK - complexRuleKey, cV - complexRuleValue
			for(ruleId in validationConstraint){
				var param = null,
				rK = ruleId,
				rV = validationConstraint[rK],
				ruleObj = validationConstraints.rules,
				rule = ruleObj[rK][rV],
				ruleValidity = true,
				ruleMessages = "";

				// First check for complex rule with parameter.
				// One level nested. For more use param as array.
				if ("object" == typeof rV) {
					for(cK in rV) {
						rule = ruleObj[rK][cK];
						param = rV[cK];
						rValid = rule($this.val(), param).validity;
						rMess  = rule($this.val(), param).message;
						if(!(ruleValidity && rValid)) {
							ruleValidity = rValid;
							ruleMessages += rMess;
						}
					}
				} else {
					ruleValidity = rule($this.val()).validity;
					ruleMessages += rule($this.val()).message;
				}
				// console.log(ruleValidity); console.log(ruleMessages);   // Debug Rule
				if(!ruleValidity) {
					$this.addClass("input-error");
					$this.after("<p class='validationMessages text-danger input-group'>" +ruleMessages+ "</p>");
				}
			}
		}
	});
	if(0 == $(".validationMessages").length) {
		return true;
	} else {
		return;
	}
}