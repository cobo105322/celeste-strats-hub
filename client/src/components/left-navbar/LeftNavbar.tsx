import './LeftNavbar.css';

import React from 'react';
import { Panel } from 'primereact/panel';

export default class LeftNavbar extends React.PureComponent<any, any> {
    constructor(props: any) {
      super(props);     
    }
  
    render() {      
      return (
        <Panel header="Navbar here" className="navbar-panel">
            TODO
        </Panel>
      );
    }
  }
  