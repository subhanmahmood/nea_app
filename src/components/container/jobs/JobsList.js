import React from 'react';
import superagent from 'superagent'

//Material-UI imports
import AddJobDialog from './AddJobDialog/AddJobDialog'
import Card from 'material-ui/Card/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardText from 'material-ui/Card/CardText';
import CardTitle from 'material-ui/Card/CardTitle';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import { grey500, red500, green500, cyan500, deepOrange500, brown500, purple500 } from 'material-ui/styles/colors';

//User defined imports
import JobCard from '../../presentation/jobs/JobCard'

/*
OBJECTVE
4.0 - Display a list of all jobs, sorted by date 
on the jobs page. On this page the user will be 
able to view all completed and ongoing jobs and 
will be able to create new jobs by clicking on 
a button. When a user clicks on one of the jobs, 
they will be taken to a page which includes more 
details about the job.
*/

class JobsList extends React.Component {
	constructor(props){
		super(props);
		//Initialize component state
		this.state = {
			jobs: [],
			jobList: new Array(),
			columns: 1,
			value: 1,
			valueJobType: 1,
			valueJobStatus: 1
		}
		//Bind methods to component
		this.addJob = this.addJob.bind(this);
		this.onCellClick = this.onCellClick.bind(this);
		this.handleJobTypeChange = this.handleJobTypeChange.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this)
		this.handleJobStatusChange = this.handleJobStatusChange.bind(this);
	}	
	componentDidMount(){
		const initialColumnSize = this.props.columns;
		this.setState({value: initialColumnSize});
		//API request to get all jobs from db with customer details
		superagent.get('/api/job?customer=true')
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + err)
			}
			const jobs = res.body.response;
			this.setState({jobs: jobs, jobList: jobs})
		})
	}
	handleJobTypeChange(event, value, index){
		//Update state when job type select is changed
		this.setState({valueJobType: value + 1}, this.handleSelectChange);
	}
	handleJobStatusChange(event, value, index){		
		//Update state when status select is changed
		this.setState({valueJobStatus: value + 1}, this.handleSelectChange);
	}
	handleSelectChange(){
		//Create arrays for job types and statuses so an API route can be built
		const types = ['All', 'Conservatory', 'Doors/Windows', 'General'];
		const status = ['All', 'Quote', 'Ongoing', 'Completed'];
		//Create the base route string
		let query = `/api/job?`
		
		if(this.state.valueJobStatus === 1 && this.state.valueJobType !== 1){
			//Check if the user has selected all for status and a different value for job type
			//Add the query for job type with the user's chosen value. e.g. '/api/job?job_type=Conservatory
			query = query + 'job_type=' + types[this.state.valueJobType - 1] + "&"
		}else if(this.state.valueJobStatus !== 1 && this.state.valueJobType === 1){
			//Check if the user has selected all for job type and a different value for status
			//Add the query for status with the user's chosen value. e.g. '/api/job?status=Ongoing
			query = query + 'status=' + status[this.state.valueJobStatus - 1] + "&"
		}else if(this.state.valueJobStatus !== 1 && this.state.valueJobType !== 1){
			//Check if the user has selected a value other than 'all' for both job type and status
			//Add the queries for status and job type with the user's chosen values .e.g. '/api/job?status=Ongoing&job_type=Conservatory'
			query = query + `status=${status[this.state.valueJobStatus - 1]}&job_type=${types[this.state.valueJobType - 1]}&`;
		}
		//Add 'customer=true' so that the customer details are also returned
		query = query + 'customer=true'
		console.log(query)
		//Perform the API request
		superagent.get(query)
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + err)
			}else if(res.body.status === 200){
				const jobs = res.body.response;
				//Update component state
				this.setState({jobs: jobs});
			}
		})
	}
	addJob(job){
		//Add job to component state
		let updatedJobs = Object.assign(this.state.jobs);
		let customer = new Array()
		//API reques to get customer data for the job to display the customer details
		superagent.get(`/api/customer/${job.idcustomer}`)
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + err);
			}else{
				customer  = res.body.response[0]
				job.first_name = customer.first_name;
				job.last_name = customer.last_name;
				console.log(job)
				updatedJobs.push(job)
				this.setState({jobs: updatedJobs});
			}
		})		
	}	
	onCellClick(rowNumber, columnId){
		//Take user to job page when a cell is clicked
		const job = this.state.jobs[rowNumber]
		window.location = `/jobs/${job.idjob}`
	}
	render(){
		const columnSize = 12 / this.state.value;
		const columnClass = "card col s12 m" + columnSize;
		const colWidth = {
			id: {
				width: 20
			},
			paid: {
				width: 30
			}
		};
		const JobCards = this.state.jobList.map((job, i) => {
			return (<div className={columnClass} key={i} ><JobCard job={job} /></div>)
		});
		
		const Rows = this.state.jobs.map((job, i) => {
			let jobTypeColor = cyan500;
			switch (job.job_type.toLowerCase()) {
				case 'conservatory':
					jobTypeColor = deepOrange500;
					break;
				case 'doors/windows':
					jobTypeColor = brown500;
					break;
				case 'general':
					jobTypeColor = purple500;
					break;
				default:
					break;
			}
			let statusColor = grey500;
			if(job.status.toLowerCase() === 'ongoing'){
				statusColor = red500;
			} else if (job.status.toLowerCase() === 'completed') {
				statusColor = green500;
			}
			const paid = job.paid === 0 ? 'No' : 'Yes'
			const color = job.paid === 0 ? red500 : green500
			return(
				<TableRow key={i}>
					<TableRowColumn style={colWidth.id}>{job.idjob}</TableRowColumn>
					<TableRowColumn style={{padding: 0}}><span className="highlight" style={{backgroundColor: jobTypeColor}}>{job.job_type}</span></TableRowColumn>
					<TableRowColumn><span style={{color: statusColor}}>{job.status}</span></TableRowColumn>
					<TableRowColumn>{job.first_name + " " + job.last_name}</TableRowColumn>
					<TableRowColumn>£{job.quote_price.toFixed(2)}</TableRowColumn>
					<TableRowColumn style={colWidth.paid}><span style={{color: color}}>{paid}</span></TableRowColumn>
				</TableRow>
			)
		})
		return(
			<div>
				<Toolbar style={{backgroundColor: '#fff', marginBottom: 20}}>
					<ToolbarGroup firstChild={true} style={{width: '40%'}}>
						<SelectField    
							style={{width: '100%'}}
							floatingLabelText="Filter job type"
							value={this.state.valueJobType}
							onChange={this.handleJobTypeChange}>
							<MenuItem value={1} primaryText="All"/>
							<MenuItem value={2} primaryText="Conservatory"/>
							<MenuItem value={3} primaryText="Doors/Windows"/>
							<MenuItem value={4} primaryText="General"/>
						</SelectField>
					</ToolbarGroup>
					<ToolbarGroup style={{width: '40%'}}>
						<SelectField    
							style={{width: '100%'}}
							floatingLabelText="Filter job status"
							value={this.state.valueJobStatus}
							onChange={this.handleJobStatusChange}>
							<MenuItem value={1} primaryText="All"/>
							<MenuItem value={2} primaryText="Quote"/>
							<MenuItem value={3} primaryText="Ongoing"/>
							<MenuItem value={4} primaryText="Completed"/>
						</SelectField>
					</ToolbarGroup>
					<ToolbarGroup>
						<IconMenu
							onChange={this.handleSelectChange.bind(this)}
							iconButtonElement={
								<IconButton touch={true} >
									<FontIcon color='#a9a9a9' className="material-icons">view_columns</FontIcon>
								</IconButton>
							}
							value={this.state.value}>
							<MenuItem primaryText="1" value={1}/>
							<MenuItem primaryText="2" value={2}/>
							<MenuItem primaryText="3" value={3}/>
						</IconMenu>
					</ToolbarGroup>
				</Toolbar>
				<Table
					onCellClick={this.onCellClick}>
					<TableHeader
						displaySelectAll={false}
						adjustForCheckbox={false}>
						<TableRow>
							<TableHeaderColumn style={colWidth.id}>ID</TableHeaderColumn>                            
							<TableHeaderColumn>Job Type</TableHeaderColumn>
							<TableHeaderColumn>Status</TableHeaderColumn>
							<TableHeaderColumn>Customer</TableHeaderColumn>
							<TableHeaderColumn>Quote Price</TableHeaderColumn>
							<TableHeaderColumn style={colWidth.paid}>Paid</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody
						showRowHover={true}
						displayRowCheckbox={false}>
						{Rows}
					</TableBody>
				</Table>
				{this.state.jobs.length === 0 ?
					<div style={{width: '100%', color: grey500, textAlign: 'center'}}>
						No Jobs Found
					</div>
					: 
					''
				}
				<AddJobDialog addJob={this.addJob}/>			
			</div>
		)
	}
}

export default JobsList;