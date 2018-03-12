import React from 'react';
import superagent from 'superagent';

//Material-UI imports
import AddJobPart from './Table/AddJobPart';
import CustomerSelect from './Select/CustomerSelect';
import DatePicker from 'material-ui/DatePicker';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import JobPartTable from './Table/JobPartTable';
import JobTypeSelect from './Select/JobTypeSelect';
import PartSelect from './Select/PartSelect';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

//User defined imports
import helpers from '../../../../helpers/helpers';
import validationHelpers from '../../../../helpers/validationHelpers';

import styles from './styles';

//Create array with validation functions
const validationMethods = {
	description: function(value){
		let errors = new Array();
		//Array to check that value is not empty
		errors = {
			presenceCheck: validationHelpers.presenceCheck(value)
		}
		return validationHelpers.checkAllTrue(errors)
	}
}

/*
OBJECTIVE 
5.0 - Allow the user to create new jobs
5.1 - Once the user has clicked on the 
add button on the main jobs page, they 
will be taken to a new page which contains 
a form. The user will be able to input 
information about a job including the job 
type, a description of the job, any parts 
required and an estimate for the number of 
labour hours.
5.2 - Once the user has input all the details 
and clicks the submit button, the data will be 
inserted into the MySQL database.
*/

class AddJobDialog extends React.Component {
	constructor(props){
		super(props);
		//Initialize component state
		this.state = {
			open: false,
			customers: '',
			valueCustomer: 1,
			valuePart: 1,
			valueJobType: 1,
			expenses: 0,
			job: {
				job_type: '',
				description: '',
				idcustomer: '',
				expenses: 0,
				status: 'Quote',
				paid: false,
				date_added: ''
			},
			errors: {
				description: false,
				jp: false
			},
			jobParts: [],
			parts: new Array([]),
			currentJobId: 0
		}
		//Bind methods to component
		this.addJobPart = this.addJobPart.bind(this);
		this.handleCustomerSelectChange = this.handleCustomerSelectChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleJobTypeSelectChange = this.handleJobTypeSelectChange.bind(this);
		this.deleteJobPart = this.deleteJobPart.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.resetJob = this.resetJob.bind(this);
	}
	componentDidMount(){
		//API request to get all customers in db
		superagent.get('/api/customer')
		.end((err, res) => {
				if(err){
						alert('ERROR: ' + err);
				}
				const customers = res.body.response;
			this.setState({customers: customers})
		});
		//API request to get all parts in db
		superagent.get('/api/part')
		.end((err, res) => {
			if(err){
					alert('ERROR: ' + err);
			}
			const parts = res.body.response;
			this.setState({parts: parts})
		})
	}
	handleOpen(){
		//Open dialog
		this.setState({open: true})
	}
	handleClose(){
		//Call resetJob and close dialog
		this.resetJob()
		this.setState({open: false})
	}
	handleJobTypeSelectChange(event, index, value){
		//Get value of SelectField and update job with corresponding job type
		const types = ['Conservatory', 'Doors/Windows', 'General']
		const type = types[index];
		let updatedJob = Object.assign({}, this.state.job)
		updatedJob.job_type = type;
		this.setState({
			job: updatedJob,
			valueJobType: value
		});
	}
	handleCustomerSelectChange(event, index, value){
		//Update job with id of selected customer
		const idcustomer = this.state.customers[index].idcustomer;
		let updatedJob = Object.assign({}, this.state.job)
		updatedJob.idcustomer = idcustomer;
		//Update job state
		this.setState({
			valueCustomer: value,
			job: updatedJob
		});
	}
	handleDescriptionChange(event){
		const name = event.target.name;
		const value = event.target.value;
		//Use validation function to validate TextField  
		let validation = validationMethods[name];
		const error = !validation(value.toLowerCase())
		let updatedErrors = Object.assign({}, this.state.errors);
		updatedErrors[name] = error;
		//Update errors and job state
		this.setState({errors: updatedErrors})
		let updatedJob = Object.assign({}, this.state.job)
		updatedJob.description = value;
		this.setState({job: updatedJob})
	}
	handleDateChange(a, date){
		let d = date.getDate();
		let m = date.getMonth();
		//Make sure that single numbers have a 0 before them e.g 01, 02		
		if(d < 10){
			d = ('0' + d).slice(-2)
		}
		if(m + 1 < 10){
			m = ('0' + (m + 1)).slice(-2);
		}
		const newDate = `${date.getFullYear()}-${m}-${d}`
		let updateJob = Object.assign({}, this.state.job);
		updateJob.date_added = newDate;
		this.setState({job: updateJob});
	}
	addJobPart(jobPart){
		//Parse jobPart quantity from string to integer
		jobPart.quantity = parseInt(jobPart.quantity)
		let part = new Array({});
		//Iterate over parts array to find the right part
		for(let i = 0; i < this.state.parts.length; i++){
			if(this.state.parts[i].idpart === jobPart.idpart){
				part = this.state.parts[i];
			}
		}
		//Set values for jobParts
		jobPart.name = part.name;
		jobPart.cost_per_unit = part.cost_per_unit
		let updatedJobParts = Object.assign([], this.state.jobParts);
		let jpExists = false;
		let totalCost = 0
		//Check if there is already a jobPart with the part id in the array
		for(let i = 0; i < updatedJobParts.length; i++){
			if(updatedJobParts[i].idpart === jobPart.idpart){
				jpExists = true
				//Add jobPart quantity to existing quantity
				updatedJobParts[i].quantity = parseInt(updatedJobParts[i].quantity) + parseInt(jobPart.quantity)
				//Calculate cost of jobParts and the total cost
				const cost = part.cost_per_unit * jobPart.quantity;
				totalCost = this.state.expenses + cost;
			}
		}
		if(!jpExists){
			//Add new jobPart to array
			jobPart.quantity = parseInt(jobPart.quantity)
			const cost = part.cost_per_unit * jobPart.quantity;
			totalCost = this.state.expenses + cost;
			updatedJobParts.push(jobPart);
		}
		//Update jobParts in state
		this.setState({jobParts: updatedJobParts, expenses: totalCost});
	}	
	deleteJobPart(jobPart){
		let part = new Array({});
		//Iterate over parts to find part with matching id
		for(let i = 0; i < this.state.parts.length; i++){
			if(this.state.parts[i].idpart === jobPart.idpart){
				part = this.state.parts[i];
			}
		}		
		//Calculate cost for the jobPart and subtract it from the total cost
		const cost = part.cost_per_unit * jobPart.quantity;
		const totalCost = this.state.expenses - cost;
		const oldJobParts = Object.assign([], this.state.jobParts);
		const newJobParts = Object.assign([], []);
		//Remove the jobPart from the array by filtering the items into a new array
		oldJobParts.forEach((jp) => {	
			if(jp.idpart !== jobPart.idpart){
				newJobParts.push(jp);				
			}
		})	
		this.setState({expenses: totalCost, jobParts: newJobParts})
	}
	resetJob(){
		//Reset all job values
		this.setState({
			valueCustomer: 1,
			valuePart: 1,
			valueJobType: 1,
			expenses: 0,
			job: {
				job_type: '',
				description: '',
				idcustomer: '',
				expenses: 0,
				status: 'Quote',
				paid: false,
				date_added: ''
			},
			errors: {
				job_type: false,
				description: false,
				idcustomer: false,
				expenses: false,
				quote_price: 0,
				status: false,
				paid: false
			},
			jobParts: [],
		});
	}
	handleSubmit(){
		//Get date
		const date = helpers.date();
		const job = this.state.job;
		//Round expenses and quote price to two decimal places
		job.expenses = this.state.expenses.toFixed(2) ;
		job.quote_price = (job.expenses * 1.5).toFixed(2);
		//API request to add job to db
		superagent.post('/api/job/')
		.set('Content-Type', 'application/json')
		.send(job)
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + err)
			}
			if(res.body.status === 200){
				//If request is successful, add jobParts to db
				//Get id of inserted record for the jobParts
				const currentId = res.body.response.insertId;
				const currentJob = this.state.job;
				currentJob.idjob = currentId;
				//Add job to parent component's state
				this.props.addJob(currentJob)
				this.state.jobParts.forEach((jobPart) => {
					//Iterate over jobParts and perform an API request for each to add them to the db
					console.log(jobPart)
					delete jobPart.cost_per_unit
					delete jobPart.name
					jobPart.idjob = currentId;
					superagent.post('/api/jobitem')
					.set('Content-Type', 'application/json')					
					.send(jobPart)
					.end((err, res) => {
						if(err){
							console.log(err)
						}
						if(res.body.status === 200){
							//Close dialog on success
							this.handleClose()
						}
					})
				})
				this.resetJob()
			}				
		})
	}
	render(){
		const actions = [
			<FlatButton 
				key={1}
				label="Submit"
				type="submit"
				onClick={this.handleSubmit}
				primary={true} />,
			<FlatButton 
				key={2}
				label="Cancel"
				primary={true}
				onClick={this.handleClose.bind(this)} />
		]
		const style = styles.main;	
		return(
			<div>
				<FloatingActionButton style={style.addButton} onClick={this.handleOpen.bind(this)}>
					<FontIcon className="material-icons">add</FontIcon>
				</FloatingActionButton>				
				<Dialog
		          title="Add Job"
				  modal={true}
				  actions={actions}
				  open={this.state.open}
				  className="add-job"
				  autoScrollBodyContent={true}
		          onRequestClose={this.handleClose.bind(this)}
				>				
					<div className="row">
						<div className="col s12 m4">
							Estimated Cost: £{(this.state.expenses).toFixed(2)}
						</div>
						<div className="col s12 m4">
							Estimated Profit: £{(this.state.expenses * 1.5 - this.state.expenses).toFixed(2)}
						</div>
						<div className="col s12 m4">
							Estimated Quote Price: £{(this.state.expenses * 1.5).toFixed(2)}
						</div>
					</div>
					<div className="row">
						<div className="col s12 m6">
							<JobTypeSelect 
								handleChange={this.handleJobTypeSelectChange} 
								value={this.state.valueJobType}/>
						</div>
						<div className="col s12 m6">
							<CustomerSelect 
								handleChange={this.handleCustomerSelectChange} 
								value={this.state.valueCustomer}
								customers={this.state.customers}/>
						</div>
					</div>
					<div className="row">
						<div className="col s12">
							<DatePicker
								style={{width: '100%'}}
								textFieldStyle={{width: '100%'}}
								autoOk={true}
								hintText="Select Date"
								onChange={this.handleDateChange}/>
						</div>
					</div>
					<div className="row">
						<div className="col s12">
							<TextField 
								style={{width:'100%'}}
								name="description"
								onChange={this.handleDescriptionChange}
								textareaStyle={{width: '100%'}}
								hintText="Description"
								errorText={this.state.errors.description ? 'Make sure that this field is not empty' : ''}
								multiLine={true}
								rows={1}
								rowsMax={4} 
							/>
						</div>
					</div>
					<div className="row">
						<div className="col s12">
							<JobPartTable jobParts={this.state.jobParts} delete={this.deleteJobPart}/>
						</div>
					</div>						
					<div className="row">
						<AddJobPart add={this.addJobPart}/>
					</div>
		        </Dialog>
			</div>
		)
	}
}

export default AddJobDialog;