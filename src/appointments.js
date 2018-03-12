import React from 'react';
import ReactDOM from 'react-dom';

import Appointments from './components/layout/appointments/appointments';
import MuiWrapper from './components/layout/MuiWrapper';

ReactDOM.render(<MuiWrapper content={<Appointments />} />, document.getElementById('root'))