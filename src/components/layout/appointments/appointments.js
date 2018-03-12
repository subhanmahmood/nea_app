import React from 'react';

import AppointmentList from '../../container/appointments/AppointmentList'

//Render AppointmentList
class Appointments extends React.Component {
    render(){          
        return(
            <div>
                <AppointmentList/>
            </div>
        )   
    }
}

export default Appointments;