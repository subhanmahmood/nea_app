import React from 'react';
import superagent from 'superagent';

//Recharts imports
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, defs, linearGradient, stop, Legend, Label} from 'recharts';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from 'material-ui/Table';
import {red500, green500} from 'material-ui/styles/colors'

//User defined imports
import FinanceObject from './financeObj';
import helpers from '../../../helpers/helpers'

class Chart extends React.Component {
	constructor(props){
		super(props);
		//Initialize state
		this.state = {
			data: new Array()
		}
		//Bind methods to component
		this.prepareData = this.prepareData.bind(this);
		this.calculateTotal = this.calculateTotal.bind(this);
	}
	calculateTotal(array, prop, n){
		//set n to 0 if the value is null
		n |= 0;
		//Return 0 if the end of the array has been reached
		if(n === array.length){
			return 0;
		} else {
			//Recursively add to the total
			return array[n][prop] + this.calculateTotal(array, prop, n + 1);
		}
	}
	componentDidMount(){  
		//Set component state and prepare data 
		this.setState({financeJobs: this.props.financeJobs}, this.prepareData);
	}
	componentWillReceiveProps(nextProps){
		//Set component state and prepare data
		this.setState({financeJobs: nextProps.financeJobs}, this.prepareData);
	}
	prepareData(){
		const months = ['january', 'februaury', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

		//Check if array is not empty
		if(this.state.financeJobs !== undefined){
			//Create array of keys of the financeJobs array
			const keys = Object.keys(this.state.financeJobs)
			//Create new array for data
			let data = new Array();
			//Get length of financeJobs object
			const length = helpers.size(this.state.financeJobs)
			//Iterate over items in financeJobs and calculate total expenses and quote price
			for(let i = 0; i < length; i++){
				const month = keys[i];
				const index = parseInt(month, 10) - 1
				const m = months[index]
				const pushData = { 
					month: [m], 
					expenses: this.calculateTotal(this.state.financeJobs[month], 'expenses'), 
					quote_price: this.calculateTotal(this.state.financeJobs[month], 'quote_price')
				}
				//Push data to the data array
				data.push(pushData)
			}
			//Set component state
			this.setState({data: data});
		}
	}
	render(){
		const data = this.state.data;
		return(     
			<div>
				<div style={{textAlign: 'center'}}>
				{this.props.year}
				</div>
				<AreaChart width={this.props.width} height={300} data={data}
					margin={{top: 5, right: 30, left: 20, bottom: 5}}>
					<defs>
						<linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
							<stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
						</linearGradient>
						<linearGradient id="colorQuotePrice" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
							<stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
						</linearGradient>
					</defs>
					<XAxis dataKey="month"/>
					<Label value="Month" offset={0} position="insideBottom" />
					<YAxis label={{ value: 'Pounds (£)', angle: -90, position: 'insideLeft' }}/>
					<CartesianGrid strokeDasharray="3 3"/>
					<Tooltip/> 
					<Legend/>        
					<Area type="monotone" dataKey="expenses" stroke="#8884d8" fillOpacity={1} fill="url(#colorExpenses)" />
					<Area type="monotone" dataKey="quote_price" stroke="#82ca9d" fillOpacity={1} fill="url(#colorQuotePrice)" />
				</AreaChart>
			</div>     
		)
	}
}

/*
OBJECTIVE
8.0 - Display details of the business’ finances
8.1 - Display a table of jobs and their cost/revenue.
8.2 - Display graphs detailing profit/loss and revenue month by month
*/


class FinanceTable extends React.Component{
	constructor(props){
		super(props)
		//Initialize component state
		this.state = {
			jobs: new Array(),
			financeJobs: new Array(),
			financeReady: false,
			expenses: new Array(),
			chartWidth: 0
		}
		//Bind methods to component
		this.onCellClick = this.onCellClick.bind(this);
		this.updateChartSize = this.updateChartSize.bind(this);
	}
	componentDidMount(){ 
		//Call updateChartSize       
		this.updateChartSize()
		//Add a resize event to listener to browser window for updateChartSize method
		window.addEventListener('resize', this.updateChartSize)
		//Perform API request to get jobs
		superagent.get('/api/job')
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + err)
			}  
			const jobs = res.body.response;
			//Instantiate FinanceObject object to prepare data
			const financeObj = new FinanceObject(jobs);
			const financeJobs = financeObj.getFinanceJobs();
			//Set component state
			this.setState({jobs: jobs, financeJobs: financeJobs});
		})
	}
	updateChartSize(){
		//Calculate chart width and set state
		const chartWidth = document.getElementsByClassName('container')[0].clientWidth
		this.setState({chartWidth: chartWidth});
	}
	onCellClick(rowNumber, columnId){
		//Take user to job page when cell is clicked
		const job = this.state.jobs[rowNumber]
		window.location = `/jobs/${job.idjob}`
	}
	render(){
		const Rows = this.state.jobs.map((job, i) => {
			//Set color of 'paid' column in table
			const paid = job.paid === 0 ? 'No' : 'Yes'
			const color = job.paid === 0 ? red500 : green500
			const expenses = job.expenses
			return(
				<TableRow key={i}>
					<TableRowColumn>{job.idjob}</TableRowColumn>
					<TableRowColumn>{job.date_added}</TableRowColumn>
					<TableRowColumn>£{expenses.toFixed(2)}</TableRowColumn>
					<TableRowColumn>£{job.quote_price.toFixed(2)}</TableRowColumn>
					<TableRowColumn style={{color: color}}>{paid}</TableRowColumn>
				</TableRow>
			)
		})

		//Create array of keys in financeJobs to get all years in the array.
		const years = Object.keys(this.state.financeJobs)
		return(
			<div id="table">
				<Table
					onCellClick={this.onCellClick}>
					<TableHeader
					displaySelectAll={false}
					adjustForCheckbox={false}>
						<TableRow>
							<TableHeaderColumn>ID</TableHeaderColumn>                            
							<TableHeaderColumn>Date Added</TableHeaderColumn>
							<TableHeaderColumn>Expenses</TableHeaderColumn>
							<TableHeaderColumn>Quote Price</TableHeaderColumn>
							<TableHeaderColumn>Paid</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody
						showRowHover={true}
						displayRowCheckbox={false}>
						{Rows}
					</TableBody>
				</Table>
				<div className="row">
					{//Iterate over years array to create a chart for each year
						years.map((year, i) => {
						return(
							<div className={"col s12 m" + ((years.length) > 1 ? "6" : "12")}  key={i}>
								<Chart financeJobs={this.state.financeJobs[year]} year={year} width={years.length > 1 ? this.state.chartWidth / 2 : this.state.chartWidth}/>                        
							</div>
						)
					})}
				</div>
			</div>
		)	
	}
}

export default FinanceTable