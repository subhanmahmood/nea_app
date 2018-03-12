//Create a class for the FinanceObject
class FinanceObject {
    constructor(jobs){
        //Initialize values
        this.jobs = jobs;
        this.financeJobs = []
        this.sortJobs()
    }  
    getFinanceJobs(){
        //Getter method to return financejobs
        return this.financeJobs;
    }
    calculateTotal(array, prop, n){
        //Method to calculate total
        n |= 0;
		if(n === array.length){
			return 0;
		} else {
			return array[n][prop] + this.calculateTotal(array, prop, n + 1);
		}
    }
    addFinanceJob(financeJobs, job){
        //Method to add finance job
        //Split the date string to get values for year, month, date
        const date = job.date_added.split('-');
        const year = date[0];
        const month = date[1];
        const day = date[2]
        //Create array of years in the financeJobs array
        const years = Object.keys(financeJobs);
        //Check if year has already been added to the array
        if(years.indexOf(year) !== -1){
            //Create array of months in the year
            const months = Object.keys(financeJobs[year])
            //Check if month has already been added to the array
            if(months.indexOf(month) !== -1){
                //Add the job to array
                financeJobs[year][month].push(job)
                //Return the array
                return financeJobs
            }else{
                //Create an empty array inside the year array with the month as the key
                financeJobs[year][month] = []
                //Call itself to add the next item
                this.addFinanceJob(financeJobs, job)
                return financeJobs
            }
        } else {
            //Create an empty array with the year as the key
            financeJobs[year] = {}
            //Call itself to keep adding items
            this.addFinanceJob(financeJobs, job)
            return financeJobs
        }
    }
    sortJobs(){
        let updatedJobs = this.jobs
        //Use nested for loop to iterate over items in jobs array
        for(let j = 0; j < updatedJobs.length; j++){
            for(let i = 0; i < updatedJobs.length; i++){
                //Make sure that i is less than array length to prevent out of bounds error
                if(i < updatedJobs.length - 1){
                    const currentJob = updatedJobs[i];                    
                    const nextJob = updatedJobs[i + 1];
                    //Compare date_added of jobs
                    if(currentJob.date_added > nextJob.date_added){
                        //Swap them if first item is greater than second item
                        updatedJobs[i] = nextJob;
                        updatedJobs[i + 1] = currentJob;
                    }
                }
            }
        }
        //Set jobs
        this.jobs = updatedJobs
        //Call sortJobsIntoMonths
        this.sortJobsIntoMonths()
    }
    sortJobsIntoMonths(){
        const jobs = this.jobs;
        //Create empty array for financeJobs
        let financeJobs = [];
        //Iterate over jobs and call addFinanceJob for each one
        jobs.forEach((job) => {
            this.addFinanceJob(financeJobs, job)
        })
        //Set value of financeJobs
        this.financeJobs = financeJobs;
    }
}

export default FinanceObject