import React, { FormEvent, PureComponent, ReactNode } from 'react'

import { User, Basic_Profile } from "../App"

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MUILink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

interface Props { loginFunc: (user: User)=>void, registerFunc: (user: User, profile: Basic_Profile)=>void }
interface State { 
    isRegisterMode: Boolean,
    firstName: string | null,
    lastName: string | null,
    screenName: string | null,
    email: string | null,
    password: string | null
}

class LoginRegister extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            isRegisterMode: true,
            firstName: null,
            lastName: null,
            screenName: null,
            email: null,
            password: null
        }
    }

    toggleForm = () => { this.setState({ isRegisterMode: !this.state.isRegisterMode }); }

    emailValidator = (): Boolean => {
        if( this.state.email && /(.+)@(.+){2,}\.(.+){2,}/.test(this.state.email) ){ return true;
        } else{ alert("Email is not in a valid format!"); return false; }
    }

    passwordValidator = (): Boolean => {
        if( this.state.password && /([A-Z]|[a-z]|[0-9]){8,}/.test(this.state.password) ){ return true;
        } else{ alert("Password must be 8+ characters long using only alphanumeric characters!"); return false; }
    }

    loginHandler = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        if( this.emailValidator() && this.passwordValidator() ){
            this.props.loginFunc({ 
                email: this.state.email as string,
                password: this.state.password as string
            });
        }
    }

    registerHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if( this.emailValidator() && this.passwordValidator() ){
            this.props.registerFunc({ 
                email: this.state.email as string,
                password: this.state.password as string,
                firstName: (this.state.firstName? this.state.firstName : "") as string,
                lastName: (this.state.lastName? this.state.lastName : "") as string
            },{
                screenName: this.state.screenName as string
            });
        }
        
    }

    render(): ReactNode {
        return (
            <div>
            <Container style={{border: "1px solid lightgrey", borderRadius: "5px"}}component="main" maxWidth="xs">
            <div>
                <form onSubmit={ this.state.isRegisterMode ? this.registerHandler : this.loginHandler } noValidate>
                    { this.state.isRegisterMode ? 
                    <><Grid container direction={"row"}>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                onChange={ (e) => { this.setState({ firstName: e.target.value }); } }
                                label="First"
                                name="first"
                                autoComplete="first"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="lastName"
                                onChange={ (e) => { this.setState({ lastName: e.target.value }); } }
                                label="Last"
                                name="last"
                                autoComplete="last"
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="screenName"
                        onChange={ (e) => { this.setState({ screenName: e.target.value }); } }
                        label="screenName"
                        name="screenName"
                        autoComplete="screenName"
                    /></> : <></>}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        onChange={ (e) => { this.setState({ email: e.target.value }); } }
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        onChange={ (e) => { this.setState({ password: e.target.value }); } }
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" size={"small"}/>}
                        label="Remember me"
                    />
                    { this.state.isRegisterMode ? 
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Register
                    </Button> :
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Sign In
                    </Button>}
                    <Grid container direction={"row-reverse"}>
                        <Grid item>
                        { this.state.isRegisterMode ? 
                        <MUILink onClick={this.toggleForm} variant="body2">
                            {"Already have an account? Sign In"}
                        </MUILink> :
                        <MUILink onClick={this.toggleForm} variant="body2">
                            {"Don't have an account? Sign Up"}
                        </MUILink>
                        }
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
        </div>
        )
    }
}

export default LoginRegister
