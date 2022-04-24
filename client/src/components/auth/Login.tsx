
import React, { LegacyRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { ClientService } from '../../utils/ClientService';
import { Button } from 'primereact/button';
import { APIService } from '../../utils/ApiService';
import { EnumAPIEndpoint } from '../../models/enums/EnumAPIEndpoint';
import { Toast } from 'primereact/toast';
import { User } from '../../models/interfaces/User';

interface ComponentState {
    name: string,
    password: string,
    email: string,
    registering: boolean,
    loading: boolean
}
interface ComponentProps {
    onDone: ()=>void;
}
export default class Login extends React.PureComponent<ComponentProps, ComponentState> {
    private toast: Toast;
    constructor(props: any) {
        super(props);
        this.state = {
            name: '',
            password: '',
            email: '',
            registering: false,
            loading: false
        }
    }

    login() {
        this.setState({loading: true});
        APIService.APICall(EnumAPIEndpoint.LOGIN, {
            name: this.state.name,
            password: this.state.password
        }).then(response=>{
            if(!response.ok){
                this.toast.show({severity: 'error', summary: 'Login failed', detail: 'Check that user and password are correct', life: 3000});
            }else{
                response.json().then((user: User)=>{
                    this.toast.show({severity: 'success', summary: 'Login successful', life: 3000});
                    ClientService.setUser(user);           
                    this.props.onDone();         
                })
            }
            this.setState({loading: false})
        })
    }

    register() {
        this.setState({loading: true});
        APIService.APICall(EnumAPIEndpoint.REGISTER, {
            name: this.state.name,
            password: this.state.password,
            email: this.state.email
        }).then(response=>{
            if(!response.ok){
                this.toast.show({severity: 'error', summary: 'Register failed', detail: '', life: 3000});
                this.setState({loading: false})
            }else{                
                this.toast.show({severity: 'success', summary: 'Register successful', detail: 'Login in with your new user! :)', life: 3000});                                                        
                this.setState({loading: false, registering: false})

            }
            
        })
    }

    isLoginEnabled(): boolean {
        return this.state.name !== '' && this.state.password !== '' && !this.state.loading;
    }

    isEmailValid(): boolean {
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return this.state.email && emailRegex.test(this.state.email);
    }

    isRegisterEnabled(): boolean {
        return this.state.name !== '' && this.state.password !== '' && this.isEmailValid() && !this.state.loading;
    }



    render() {
        if (ClientService.isLogged()) return <div>Already logged in!</div>
        let registering = this.state.registering;
        return (
            <div>
                <Toast ref={(el)=>this.toast=el} />
                <p>
                    <b>Username </b><br />
                    <InputText value={this.state.name} onChange={(e) => this.setState({ name: e.target.value.substring(0, 25) })} />
                </p>
                <p>
                    <b>Password </b><br />
                    <InputText value={this.state.password} type="password" onChange={(e) => this.setState({ password: e.target.value.substring(0, 50) })} />
                </p>
                {registering &&
                    <p>
                        <b>Email </b><br/>
                        <InputText value={this.state.email} type="email" onChange={(e) => this.setState({ email: e.target.value.substring(0, 100) })} />
                    </p>

                }

                {registering ?
                    <Button  className="p-button-success"  disabled={!this.isRegisterEnabled()} onClick={() => this.register()}>Register</Button>
                    :
                    <Button  className="p-button-success" disabled={!this.isLoginEnabled()} onClick={() => this.login()}>Login</Button>
                }
                <br/>
                <a style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => this.setState({ registering: !registering })}>{registering ? `Already have an account? Click here to login!` : `Don't have an account? Click here to register!`}</a>
            </div>
        );
    }
}
