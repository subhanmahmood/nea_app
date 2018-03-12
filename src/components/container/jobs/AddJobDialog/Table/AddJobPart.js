import React from 'react';
import superagent from 'superagent';

//Material-UI imports
import PartSelect from '../Select/PartSelect';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

//User defined imports 
import helpers from '../../../../../helpers/helpers';

class AddJobPart extends React.Component {
    constructor(props){
        super(props);
        //Initialize component state
        this.state = {
            value: 1,
            parts: new Array({}),
            jobPart: {
                idpart: 0,
                idjob: 0,
                quantity: 0
            }
        }
        //Bind methods to component
        this.handlePartSelectChange = this.handlePartSelectChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.addJobPart = this.addJobPart.bind(this);
    }
    componentDidMount(){
        //API request to get all parts from server
        superagent.get('/api/part')
        .end((err, res) => {
            if(err){
                alert('ERROR: ' + err);
            }
            const parts = res.body.response;
            this.setState({parts: parts});
            //Get id of first part in array or default to 0 if value is undefined
            const idpart = parts[0].idpart || 0;
            let updatedJobPart = Object.assign({}, this.state.jobPart);
            updatedJobPart.idpart = idpart;
            //Set state
            this.setState({jobPart: updatedJobPart});
        });
    }
    handlePartSelectChange(event, index, value){
        //Get idpart when select is changed and update state
        const idpart = this.state.parts[index].idpart;
        let updatedJobPart = Object.assign({}, this.state.jobPart);
        updatedJobPart.idpart = idpart;
        this.setState({value: value, jobPart: updatedJobPart});
    }
    handleQuantityChange(event){
        //Update value of quantity when quantity TextField is changed
        const value = event.target.value;
        let updatedJobPart = Object.assign({}, this.state.jobPart);
        updatedJobPart.quantity = value;
        this.setState({jobPart: updatedJobPart});
    }
    addJobPart(){
        const idpart = this.state.parts[0].idpart;
        //Reset component state
        this.setState({
            value: 1,
            jobPart: {
                idpart: idpart,
                idjob: 0,
                quantity: 0
            }
        });
        //Add jobPart to parent component's state
        this.props.add(this.state.jobPart);
    }
    render(){
        return(
            <div className="col s12">
                <div className="col s12 m6">
                    <PartSelect handleChange={this.handlePartSelectChange} value={this.state.value} parts={this.state.parts}/>
                </div>
                <div className="col s12 m3">
                    <TextField 
                        hintText="Quantity" 
                        name="quantity" 
                        style={{paddingTop: 25, width: '100%'}} 
                        type="number" 
                        onChange={this.handleQuantityChange}
                        value={this.state.jobPart.quantity}/>
                </div>
                <div className="col s12 m3">
                    <RaisedButton 
                        primary={true} 
                        style={{marginTop: 30, width: '100%'}} 
                        label="Add Part" 
                        onClick={this.addJobPart}/>
                </div>
            </div>
        )
    }
}

export default AddJobPart;