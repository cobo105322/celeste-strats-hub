import './TopNavbar.css';
import { Menubar } from 'primereact/menubar';

import React from 'react';
import { Panel } from 'primereact/panel';
import { MenuItem } from 'primereact/menuitem';
import { ClientService } from '../../utils/ClientService';
import { Button } from 'primereact/button';
import { APIService } from '../../utils/ApiService';
import { EnumAPIEndpoint } from '../../models/enums/EnumAPIEndpoint';

interface ComponentProps{
    renderLogin: ()=>void;
}

export default class TopNavbar extends React.PureComponent<any, any> {
    constructor(props: any) {
        super(props);
    }
    
    logout(){
        APIService.APICall(EnumAPIEndpoint.LOGOUT, {}).then(r=>{
            ClientService.logoutUser();
            window.location.reload();
        });
    }

    render() {
        return (
            <Menubar id="menubar" 
            end={!ClientService.isLogged() ?
                <div><Button onClick={()=>this.props.renderLogin()} className="p-button-sm p-button-secondary"   icon="pi pi-user" label='Login'/></div>
                :
                <div>
                    <i  className="pi pi-user"></i><label>{ClientService.getUser().name}</label>
                    <Button id="logout-btn" onClick={()=>this.logout()} className="p-button-sm p-button-secondary" icon="pi pi-power-off" label='Logout'/>
                    </div>

            }
            model={[
                {
                    label: 'Home',
                    icon: 'pi pi-fw pi-home',
                    url: '/'
                }
            ]} />
        );
    }
}
