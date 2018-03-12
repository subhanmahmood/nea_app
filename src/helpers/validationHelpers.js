const validationHelpers = {
	checkRegExp: function(value, regex){
		//Test value against regular expression, returns boolean
		return regex.test(value)
	},
	checkAllTrue: function (obj){
		//Iterate over object, if a value is false, return false, else return true
		for(const o in obj)
			if(!obj[o]) return false;			
		return true;
	},
	checkAllFalse: function(obj){
		//Iterate over object, if a value is true, return false, else return true
		for(const o in obj)
			if(obj[o]) return true;
		return false;
	},
	presenceCheck(value){
		//Check if value is not empty
		return value != ''
	},
	rangeCheck(value, min, max){
		//Check if value is within given range
		if(value.length >= min && value.length <= max){
			return true;
		} else {
			return false;
		}
	},
	checkAlpha: function(char){
		//Create array of accepted letters
		const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' '];
		//Check if letter is in string
		return (alpha.indexOf(char) != -1)
	},
	checkNumber: function(char){
		//Create array of accepted numbers
		const num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
		//Check if number is in string
		return (num.indexOf(char) != -1)
	},
	checkAlphaNumeric: function(value){
		const errors = new Array()
		for(let i = 0; i < value.length; i++){
			//Iterate over each character in string and validate
			errors.push(!(!validationHelpers.checkAlpha(value[i]) && !validationHelpers.checkNumber(value[i])))
		}
		//Check if all errors are true
		return validationHelpers.checkAllTrue(errors);
	},
	checkAlphaString: function(value){
		const errors = new Array()
		for(let i = 0; i < value.length; i++){
			//Iterate over each character in string and validate
			errors.push(validationHelpers.checkAlpha(value[i]))
		}
		//Check if all errors are true
		return validationHelpers.checkAllTrue(errors);
	},
	checkNumericString: function(value){
		const errors = new Array()
		for(let i = 0; i < value.length; i++){
			//Iterate over each character in string and validate
			errors.push(validationHelpers.checkNumber(value[i]))
		}
		//Check if all errors are true
		return validationHelpers.checkAllTrue(errors);
	}
}

export default validationHelpers