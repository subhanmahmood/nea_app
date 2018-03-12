import React from 'react';
import superagent from 'superagent';

//Material-UI imports
import {Table,TableHeader,TableHeaderColumn,TableBody,TableRow,TableRowColumn} from 'material-ui/Table';
import JobCard from '../../presentation/jobs/JobCard';
import CustomerCard from '../../presentation/customers/CustomerCard';
import JobPartTable from '../../container/jobs/AddJobDialog/Table/JobPartTable';
import FlatButton from 'material-ui/FlatButton';
import {red500, grey500, grey100} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Paper from 'material-ui/Paper';

//User defined inputs
import helpers from '../../../helpers/helpers';

class Invoice extends React.Component {
	constructor(props){
		super(props);
		//Initialize component state
		this.state = {
			job: new Array(),
			jobParts: new Array(),
			parts: new Array()	
		}
		//Bind methods to component state
		this.print = this.print.bind(this);
		this.calculateTotalCost = this.calculateTotalCost.bind(this);
	}
	componentDidMount(){
		//Get job id from HTML
		const id = document.getElementById('id').innerHTML;
		//API request to get job data
		superagent.get(`/api/job/${id}`)
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + err)
			}
			const job = res.body.response[0]
			console.log(job)
			this.setState({job: job});
		})
		//API request to get jobParts for the job
		superagent.get(`/api/jobitem/${id}`)
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + err)
			}
			const jobParts = res.body.response;
			this.setState({jobParts: jobParts});
		});
	}
	print(){
		//Store invoice HTML in divElem
		const divElem = document.getElementById("invoice").innerHTML;
		//Store entire page HTML in old
		const old = document.body.innerHTML;
		//Set page HTML to only contain invoice HTML
		document.body.innerHTML = "<html><head><title></title></head><body>" + 
		divElem + "</body>";
		//Open print dialog
		window.print();
		//Set page HTML to original value
		document.body.innerHTML = old;
	}
	calculateTotalCost(array, n){
		//Set value of n to 0 if it has not been defined
		n |= 0;
		if(n === array.length){
			return 0;
		} else {
			//Calculate total cost
			return (array[n].cost_per_unit * array[n].quantity) + this.calculateTotalCost(array, n + 1);
		}
	}
	render(){
		const job = this.state.job;
		const td = helpers.date();
		const dd = helpers.newDate();
		const rows = this.state.jobParts.map((jp, i) => {
			return (
				<TableRow>
					<TableRowColumn>{jp.name}</TableRowColumn>
					<TableRowColumn style={{width: 40}}>{jp.quantity}</TableRowColumn>
					<TableRowColumn style={{width: 40}}>£{jp.cost_per_unit.toFixed(2)}</TableRowColumn>
					<TableRowColumn style={{width: 60}}>£{(jp.cost_per_unit * jp.quantity).toFixed(2)}</TableRowColumn>
				</TableRow>
			)
		})
		return(
			<div style={{marginBottom: 30}}>
				<div style={{ width: '100%', marginTop: 20, textAlign: 'center'}}>
					<Paper style={{display: 'inline-block', textAlign: 'left', width: 794, height: 1123}} id="invoice" zDepth={2}>
						<div style={{padding: 30, height: 1063, position: 'relative'}}>
							<p style={{margin: 0}}><span style={{color: grey500, fontStyle: 'italic'}}>Date: </span> {td}</p>
							<p style={{margin: 0}}><span style={{color: grey500, fontStyle: 'italic'}}>Due Date: </span> {dd}</p>
							<div style={{width: '100%', marginTop: 30}}>
								<p style={{margin: 0}}><span style={{color: grey500, fontStyle: 'italic'}}>From: </span></p>
								<p style={{margin: 0}}><span style={{fontWeight: 700}}>TA Home Improvements</span></p>
								<p style={{margin: 0}}>8 Dartmouth Path</p>
								<p style={{margin: 0}}>Woking, Surrey</p>
								<p style={{margin: 0}}>GU21 5PN</p>
							</div>

							<div style={{width: '100%', marginTop: 30}}>
								<p style={{margin: 0}}><span style={{color: grey500, fontStyle: 'italic'}}>To: </span></p>
								<p style={{margin: 0}}><span style={{fontWeight: 700}}>{job.first_name + " " + job.last_name}</span></p>
								<p style={{margin: 0}}>{job.address_line_1}</p>
								<p style={{margin: 0}}>{job.postcode}</p>
							</div>
							<div style={{width: '100%', textAlign: 'center', display: 'inline-block'}}>
								<h3 style={{margin: 0}}>Additional Comments</h3>
								<p style={{marginTop: 10, textAlign: 'left'}}>{job.description}</p>
							</div>
							<div style={{width: '100%', marginTop: 20}}>
								<Table>
									<TableHeader
										displaySelectAll={false}
										adjustForCheckbox={false}>
										<TableRow>
											<TableHeaderColumn>Description</TableHeaderColumn>											
											<TableHeaderColumn style={{width: 40}}>Quantity</TableHeaderColumn>																	
											<TableHeaderColumn style={{width: 40}}>Unit Price</TableHeaderColumn>
											<TableHeaderColumn style={{width: 60}}>Cost</TableHeaderColumn>
										</TableRow>
									</TableHeader>
									<TableBody displayRowCheckbox={false}>
										{rows}
									</TableBody>
								</Table>
							</div>
							<div style={{width: '100%', textAlign: 'right'}}>
								<p style={{margin: 0}}><span style={{fontWeight: 700}}>Total:    </span> £{this.calculateTotalCost(this.state.jobParts).toFixed(2)}</p>
								<p style={{margin: 0}}><span style={{fontWeight: 700}}>VAT:          </span> 20%</p>
								<p style={{margin: 0}}><span style={{fontWeight: 700}}>Bill due: </span> £{(this.calculateTotalCost(this.state.jobParts) * 1.2).toFixed(2)}</p>
							</div>
							<div style={{position: 'absolute', left: 30, bottom: 30}}><p style={{margin: 0, fontStyle: 'italic', color: grey500}}>Please pay within 14 days</p></div>
						</div>					
					</Paper>
				</div>
				<FloatingActionButton style={{position: 'fixed', right: 24, bottom: 24}} onClick={this.print}>
					<FontIcon className="material-icons">print</FontIcon>
				</FloatingActionButton>
			</div>
		)
	}
}

export default Invoice;