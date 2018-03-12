import React from 'react';
import superagent from 'superagent';

//Material-UI imports
import { cyan500, grey500, red500, green500, deepOrange500, brown500, purple500 } from 'material-ui/styles/colors';
import { MenuItem } from 'material-ui/IconMenu';
import {Grid, Row, Col} from 'react-flexbox-grid';
import AddJobPart from '../../container/jobs/AddJobDialog/Table/AddJobPart'
import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import JobPartTable from '../../container/jobs/AddJobDialog/Table/JobPartTable';
import SelectField from 'material-ui/SelectField/SelectField';
import Slider from 'material-ui/Slider'
import Snackbar from 'material-ui/Snackbar'
import TextField from 'material-ui/TextField/TextField';
import Toggle from 'material-ui/Toggle'

class Job extends React.Component{
	constructor(props){
		super(props)
		//Initialize component state
		this.state = {
			job: new Array(),
			notFound: false,
			jobParts: new Array(),
			newJobParts: new Array(),
			parts: new Array(),
			snackbarOpen: false,
			snackbarMessage: ''
		}
		//Bind methods to component
		this.addJobPart = this.addJobPart.bind(this);
		this.deleteJobPart = this.deleteJobPart.bind(this);
		this.statusChange = this.statusChange.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.openSnackbar = this.openSnackbar.bind(this);
		this.closeSnackbar = this.closeSnackbar.bind(this);
		this.handleToggle = this.handleToggle.bind(this);
		this.deleteJob = this.deleteJob.bind(this);
		this.handleQuotePriceChange = this.handleQuotePriceChange.bind(this);
	}
	componentDidMount(){
		//Get job id from HTML
		const id = document.getElementById('id').innerHTML;
		//API request to get job data
		superagent.get(`/api/job/${id}`)
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + err)
			}else if(res.body.status === 404){
				//Set notFound in state to true if 404 code received
				this.setState({notFound: true});
			}else if(res.body.status === 200){
				//Add job data to component state
				const job = res.body.response[0]
				this.setState({job: job});
			}
		})

		//API request to get all job item data with same id as job
		superagent.get(`/api/jobitem/${id}`)
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + err)
			}
			const jobParts = res.body.response;
			this.setState({jobParts: jobParts,  newJobParts: jobParts});
		});

		//API request to get all part data
		superagent.get(`/api/part`)
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + err)
			}
			const parts = res.body.response;
			this.setState({parts: parts});
		});
	}
	statusChange(event, value){
		//Set job status when slider value changes and update state
		let updatedJob = Object.assign([], this.state.job);
		if(value === 0){
			updatedJob.status = 'Quote';
		}else if(value === 0.5){
			updatedJob.status = 'Ongoing';
		}else {
			updatedJob.status = 'Completed'
		}
		this.setState({job: updatedJob});
	}
	handleQuotePriceChange(event){
		//Update quote price in state when quote price TextField changes
		let updatedJob = Object.assign({}, this.state.job);
		updatedJob.quote_price = event.target.value;
		this.setState({job: updatedJob});
	}
	addJobPart(jobPart){
		//Parse jobPart quantity from string to int
		jobPart.quantity = parseInt(jobPart.quantity)
		let part = new Array({});
		//Iterate over parts array to find the right part
		for(let i = 0; i < this.state.parts.length; i++){
			if(this.state.parts[i].idpart === jobPart.idpart){
				part = this.state.parts[i];
			}
		}
		jobPart.name = part.name;
		jobPart.cost_per_unit = part.cost_per_unit
		let updatedJobParts = Object.assign([], this.state.newJobParts);
		let jpExists = false;
		let totalCost = 0
		//Iterate over jobParts to make sure that there isn't already an item with the same idpart
		for(let i = 0; i < updatedJobParts.length; i++){
			if(updatedJobParts[i].idpart === jobPart.idpart){
				jpExists = true
				//If jobPart exists perform API request to update jobPart's quantity
				superagent.put(`/api/jobitem/${this.state.job.idjob}`)
				.set('Content-Type', 'application/json')
				.send({fieldName: `quantity`, quantity: (jobPart.quantity + updatedJobParts[i].quantity), idpart: jobPart.idpart})
				.end((err, res) => {
					if(err){
						//If error display error message in snackbar
						this.setState({snackbarMessage: "Couldn't update that job item! Try again"}, this.openSnackbar);
					}else{
						//If successful add cost of additional items to total cost and update expenses
						updatedJobParts[i].quantity = parseInt(updatedJobParts[i].quantity) + parseInt(jobPart.quantity)
						const cost = part.cost_per_unit * jobPart.quantity;
						totalCost = this.state.expenses + cost;
						let updatedJob = Object.assign({}, this.state.job)
						updatedJob.expenses = totalCost
						this.setState({newJobParts: updatedJobParts, job: updatedJob}, console.log(this.state.newJobParts));
					}
				})				
			}
		}
		if(!jpExists){
			//Parse jobPart quantity
			jobPart.quantity = parseInt(jobPart.quantity)
			//Prepare jobPart data to be posted to the server
			const postPart = {
				idjob: this.state.job.idjob,
				idpart: jobPart.idpart,
				quantity: jobPart.quantity
			}
			//API request to add the jobPart to the db
			superagent.post('/api/jobitem')
			.set('Content-Type', 'application/json')
			.send(postPart)
			.end((err, res) => {
				if(err){
					//If error show error message in snackbar
					this.setState({snackbarMessage: "Couldn't add that part! Try again"}, this.openSnackbar)
				}else{			
					//Update total cost with cost of jobPart	
					console.log(res)	
					const cost = part.cost_per_unit * jobPart.quantity;
					totalCost = this.state.expenses + cost;
					updatedJobParts.push(jobPart);
					let updatedJob = Object.assign({}, this.state.job)
					updatedJob.expenses = totalCost
					this.setState({newJobParts: updatedJobParts, job: updatedJob}, console.log(this.state.newJobParts));
				}
			})
		}
	}
	deleteJobPart(jobPart){
		//API request to delete jobPart from db
		const idpart = jobPart.idpart
		superagent.delete(`/api/jobitem/${jobPart.idjob}`)
		.query({'idpart': idpart})
		.end((err, res) => {
			if(err){
				//Show error message in snackbar
				this.setState({snackbarMessage: 'There was an error'}, this.openSnackbar);
			}else{
				//Subtract cost of jobPart from total cost
				const newCost = this.state.job.expenses - (jobPart.quantity * jobPart.cost_per_unit);
				let updatedJob = Object.assign({}, this.state.job);
				updatedJob.expenses = newCost;
				updatedJob.quote_price = newCost * 1.5;

				//Remove jobPart from array
				let updatedJobParts = this.state.newJobParts.filter((jp) => {
					return jp.idpart !== jobPart.idpart
				})
				//Update state
				this.setState({job: updatedJob, newJobParts: updatedJobParts, snackbarMessage: 'Deleted successfully'}, this.openSnackbar);
			}			
		})		
	}
	openSnackbar(){
		this.setState({snackbarOpen: true});
	}
	closeSnackbar(){
		this.setState({snackbarOpen: false});
	}
	handleToggle(event, isInputChecked){
		//Update paid status of job when paid toggle changes value
		let updatedJob = Object.assign({}, this.state.job);
		const paid = isInputChecked ? 1 : 0 
		updatedJob.paid = paid;
		this.setState({job: updatedJob});
	}
	handleUpdate(){
		let job = {};
		//Set values for job data for update
		job['idjob'] =        this.state.job.idjob;
		job['job_type'] =     this.state.job.job_type;
		job['description'] =  this.state.job.description;
		job['quote_price'] =  this.state.job.quote_price;
		job['expenses'] =     this.state.job.expenses;
		job['status'] =       this.state.job.status;
		job['paid'] =         this.state.job.paid;
		job['date_added'] =   this.state.job.date_added;
		job['idcustomer'] =   this.state.job.idcustomer;
		job['idcontractor'] = this.state.job.idcontractor;

		//API request to update job data
		superagent.put(`/api/job/${this.state.job.idjob}`)
		.set('Content-Type', 'application/json')
		.send(job)
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + err)
			}
			if(res.body.status === 200){
				//Show success message in snackbar
				this.setState({snackbarMessage: 'Changes saved successfully!'}, this.openSnackbar);
			}
		})
	}
	deleteJob(){
		//API request to delete job from db
		superagent.delete(`/api/job/${this.state.job.idjob}`)
		.end((err, res) => {
			if(err){
				this.setState({snackbarMessage: 'Ooops! There was an error'});
			}else{
				//Take user to main jobs page on success
				window.location = '/jobs'
			}
		})
	}
	render(){
		let statusColor = grey500;

		//Set color of status element
		const job = this.state.job;
		let statusValue = 0
		if(this.state.job.status === 'Ongoing'){
			statusColor = red500
			statusValue = 0.5
		}else if(this.state.job.status === 'Completed'){
			statusColor = green500
			statusValue = 1
		}
		let jobTypeColor = cyan500;

		//Set color of job type element
		switch (job.job_type) {
			case 'Conservatory':
				jobTypeColor = deepOrange500;
				break;
			case 'Doors/Windows':
				jobTypeColor = brown500;
				break;
			case 'General':
				jobTypeColor = purple500;
				break;
			default:
				break;
		}

		return(
			<div>				
				<Snackbar
					open={this.state.snackbarOpen}
					message={this.state.snackbarMessage}
					autoHideDuration={4000}
					onRequestClose={this.closeSnackbar}/>
				{this.state.job.job_type === undefined ? 
				(this.state.notFound ? 'Job not found' : <CircularProgress/>) 
				:
				<div className="container" style={{marginTop: 20}}>
					<Grid>
						<Row>
							<Col xs={12} sm={12} md={10} lg={8} mdOffset={1} lgOffset={2}>
								<Grid fluid>
									<Row middle="xs">
										<Col xs={12} sm={12} md={8} lg={10}>
											<h2 style={{fontWeight: 200}}>
												<span 
													style={{backgroundColor: jobTypeColor}}
													className="highlight">
													{job.job_type}
												</span> -&nbsp; 
												<span 
													style={{backgroundColor: statusColor}}
													className="highlight">
													{job.status}
												</span> - {job.first_name + " " + job.last_name}
											</h2>
										</Col>
										<Col xs={12} sm={12} md={4} lg={2}>
											<Toggle 
												style={{width: 'auto', float: 'right'}} 
												label="Paid" 
												onToggle={this.handleToggle} 
												toggled={this.state.job.paid === 0 ? false : true}/>
										</Col>
									</Row>
									<Row>
										<Col xs={12} sm={12} md={12} lg={12}>
											<div style={{width: '100%'}}>
												<Slider 
													step={0.5} 
													value={statusValue} 
													style={{padding: 0}} 
													sliderStyle={{marginBottom: 0, marginTop: 8}} 
													onChange={this.statusChange}/>
											</div>
										</Col>
									</Row>
									<Row>
										<Col xs={12} sm={12} md={12} lg={12}>
											<div style={{paddingTop: 20}}>
												<p style={{margin: 0}}>
													<span style={{color: grey500, fontStyle: 'italic'}}>Date added:</span> 
													{job.date_added}
												</p>
											</div>						
										</Col>
									</Row>
									<Row>
										<Col xs={12} sm={12} md={12} lg={12}>
											<p style={{
												margin: 0, 
												width: '100%', 
												fontStyle: 'italic', 
												color: grey500}}>Description</p>
											<p style={{margin: 0}}>{job.description}</p>
										</Col>
									</Row>
									<Row>
										<Col xs={12} sm={12} md={12} lg={12}>
											<p style={{
												margin: 0, 
												width: '100%', 
												fontStyle: 'italic', 
												color: grey500}}>Job Items</p>
											<TextField 
												label="Quote Price" 
												floatingLabelText="Quote Price" 
												hintText="Quote Price" 
												value={this.state.job.quote_price.toFixed(2)}
												onChange={this.handleQuotePriceChange} />
											<JobPartTable jobParts={this.state.newJobParts} delete={this.deleteJobPart}/>
											<AddJobPart add={this.addJobPart}/>
										</Col>
									</Row>
								</Grid>
							</Col>
						</Row>
					</Grid>	
				</div>
				}
				<div style={{position: 'fixed', bottom: 24, right: 24}}>
					<div style={{width: '100%'}}>
						<FloatingActionButton style={{postition: 'relative', marginBottom: 20}} backgroundColor={red500} onClick={this.deleteJob}>
							<FontIcon className="material-icons">delete</FontIcon>
						</FloatingActionButton>	
					</div>
					<div style={{width: '100%'}}>
						<FloatingActionButton style={{postition: 'relative', marginBottom: 20}} onClick={this.handleUpdate}>
							<FontIcon className="material-icons">save</FontIcon>
						</FloatingActionButton>	
					</div>
						<FloatingActionButton style={{postition: 'relative', bottom: 24}} href={`/jobs/${this.state.job.idjob}/invoice`}>
							<FontIcon className="material-icons">receipt</FontIcon>
						</FloatingActionButton>
				</div>
			</div>
		)
	}
}

export default Job