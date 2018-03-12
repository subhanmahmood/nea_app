import React from 'react';
import superagent from 'superagent';

//Material-UI imports
import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {red500, green500, cyan500, brown500, purple500, grey500, deepOrange500} from 'material-ui/styles/colors';

class JobCard extends React.Component {
	constructor(props){
		super(props)
		//Initialize component state
		this.state = {
			job: {
				job_type: '',
				description: '',
				idcustomer: '',
				expenses: 0,
				status: 'Quote',
				paid: false,
				date_added: ''
			}
		}
		//Bind methods to component
		this.markAsCompleted = this.markAsCompleted.bind(this);
	}
	markAsCompleted(){
		//API request to update job and status to completed
		superagent.put(`/api/job/${this.state.job.idjob}`)
		.set('Content-Type', 'application/json')
		.send({status: 'Completed'})
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + error)
			}else{
				if(res.body.status === 200){
					//Update job state on success
					let updatedJob = Object.assign({}, this.state.job)
					updatedJob.status = 'Completed'
					this.setState({job: updatedJob});
				}
			}
		})
	}
	componentDidMount(){
		const job = this.props.job
		this.setState({job: job});
	}
	render(){
		const job = this.state.job;
		const styles = {
			card: {
				marginBottom: 20
			}
		}
		//Set color of job type element
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
		//Set color of job status element
		let color = grey500;
		if(job.status.toLowerCase() === 'ongoing'){
			color = red500;
		} else if (job.status.toLowerCase() === 'completed') {
			color = green500;
		}

		const title = 
			<div>
				<span style={{
					backgroundColor: jobTypeColor,
					color: '#fff',
					paddingLeft: 8,
					paddingRight: 8,
					paddingTop: 2,
					paddingBottom: 2, 
					display: 'inline-block', 
					fontWeight: 700, 
					borderBottomLeftRadius: 5, 
					borderBottomRightRadius: 5, 
					borderTopLeftRadius: 5, 
					borderTopRightRadius: 5}}>{job.job_type}</span> -&nbsp;<span style={{color: color}}>{job.status}</span> -&nbsp; 
				{job.first_name + " " + job.last_name}
				
			</div>;
		return(
			<Card style={styles.card}>
				<CardTitle title={title} style={{paddingBottom: 0}}/>
				<CardText style={{paddingTop: 10, paddingBottom: 0}}>
					
				</CardText>
				<CardActions>
					<FlatButton label="Mark as completed" onClick={this.markAsCompleted}/>
					<FlatButton label="View details" href={`/jobs/${this.props.job.idjob}`} />
				</CardActions>
			</Card>		
		)
	}
}

export default JobCard;