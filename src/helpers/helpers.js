const helpers = {
	date: function(){
		//Get JS Date object for current day
		const today = new Date();
		let d = today.getDate();
		let m = today.getMonth();
		//Add 0 in front of single digits
		if(d < 10){
			d = ('0' + d).slice(-2)
		}
		if(m + 1 < 10){
			m = ('0' + (m + 1)).slice(-2);
		}
		//Create date string and return value
		const date = today.getFullYear() + "-" + (m) + "-" + d;
		return date
	},
	newDate: function(){
		//Create JS Date object two weeks in the future by adding number of
		//milliseconds in two weeks
		var today = new Date(+new Date + 12096e5);
		let d = today.getDate();
		let m = today.getMonth();
		//Add 0 in front of single digits
		if(d < 10){
			d = ('0' + d).slice(-2)
		}
		if(m + 1 < 10){
			m = ('0' + (m + 1)).slice(-2);
		}
		//Create date string and return value
		const date = today.getFullYear() + "-" + (m) + "-" + d;
		return date
	},
	mergeSort(arr, type, options){
		function mSort (arr) {
			//Check that array is not empty
			if(arr.length > 0){
				if (arr.length === 1) {
					//Return the array if it only contains one item
					return arr
				}
				//Calculate middle index of array
				const middle = Math.floor(arr.length / 2) 
				//Get first half of array
				const left = arr.slice(0, middle)
				//Get second half of array
				const right = arr.slice(middle)		
				//Call mSort recursively
				return mergeArrays(
					mSort(left),
					mSort(right)
				)
			}
		}
		function mergeArrays (left, right) {
			let result = []
			let indexLeft = 0
			let indexRight = 0
			
			//Make sure that indexes are not out of bounds
			while (indexLeft < left.length && indexRight < right.length) {
				//Create empty strings for comparison values
				let leftString = ''
				let rightString = ''
				//Iterate over options array
				options.forEach(option => {
					//Add value of the item to the corresponding strings
					leftString = leftString + left[indexLeft][option] + " "
					rightString = rightString + right[indexRight][option] + " "
				});
				if(type === 'asc'){
					//Check if leftString is less than rightString
					if (leftString < rightString) {
						//Add left item to results array
						result.push(left[indexLeft])
						//Increment indexLeft
						indexLeft++
					} else {
						//Add right item to results array
						result.push(right[indexRight])
						//Increment rightIndex
						indexRight++
					}
				}else if(type === 'desc'){
					//Check if leftString is greater than rightString
					if (leftString > rightString) {
						//Add leftitem to results array
						result.push(left[indexLeft])
						//Increment indexLeft
						indexLeft++
					} else {
						//Add right item to results array
						result.push(right[indexRight])
						//increment indexRight
						indexRight++
					}
				}
				
			} 	
			//Merge arrays
			return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight))
		}
		//Call mSort and return value
		return mSort(arr)
	},
	size: function(obj){
		var size = 0, key;
		//Iterate over object
		for (key in obj) {
			//If object has value increment size
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	}
}

export default helpers