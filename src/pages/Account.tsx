import React, { PureComponent, ReactNode } from 'react'
import {RouteComponentProps, withRouter} from "react-router-dom";

import {DB_User} from "../App"
import ProfilePicture from "../components/ProfilePicture";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import URLS from "../helpers/environment";

interface Props extends RouteComponentProps<any>{ 
    userData: DB_User | null,
    logoutFunc: ()=>void
}
interface State { 
    changePasswordOpen: boolean,
    oldPassword: string,
    newPassword: string,
    newPasswordConfirm: string,
    deleteAccountOpen: boolean,
    email: string,
    password: string,
    becomeOrganizerOpen: boolean
}

class Account extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            changePasswordOpen: false, 
            oldPassword: "",
            newPassword: "",
            newPasswordConfirm: "",
            deleteAccountOpen: false,
            email: "",
            password: "",
            becomeOrganizerOpen: false,
        }
    }
    passwordValidator = (): Boolean => {
        if( this.state.newPassword && /([A-Z]|[a-z]|[0-9]){8,}/.test(this.state.newPassword) ){ return true;
        } else{ alert("Password must be 8+ characters long using only alphanumeric characters!"); return false; }
    }
    closePasswordDialog = (mode: string) => {
        if( mode === "Cancel" ) { this.setState({changePasswordOpen: false}); return; }
        else if( mode === "Change" && this.passwordValidator() && this.state.newPassword === this.state.newPasswordConfirm ){
            fetch(URLS.APIURL + "/user/changepassword", {
                method: "PUT",
                body: JSON.stringify({ user: { oldPassword: this.state.oldPassword, newPassword: this.state.newPassword } }),
                headers: new Headers({
                    "content-Type": "application/json",
                    "Authorization": window.localStorage.getItem("sessionToken") as string
                })
            })
            .then( (res) => res.json() )
            .then( (json) => { alert(json.message); })
            .catch( (err) => { console.log( "Error: ", err ); } );
        }
    };
    openPasswordDialog = () => { this.setState({changePasswordOpen: true}); };

    closeAccountDialog = (mode: string) => {
        if( mode === "Cancel" ) { this.setState({deleteAccountOpen: false}); return; }
        else if( this.props.userData && (this.state.email === this.props.userData.email) ){
            fetch(URLS.APIURL + "/user/deleteaccount", {
                method: "DELETE",
                body: JSON.stringify({ user: { password: this.state.password, email: this.state.email } }),
                headers: new Headers({
                    "content-Type": "application/json",
                    "Authorization": window.localStorage.getItem("sessionToken") as string
                })
            })
            .then( (res) => res.json() )
            .then( (json) => { alert(json.message); this.props.logoutFunc(); this.props.history.push("/"); })
            .catch( (err) => { console.log( "Error: ", err ); } );
        } else{ alert("New and old emails need to match!"); }
    };
    openAccountDialog = () => { this.setState({deleteAccountOpen: true}); };

    closeOrganizerDialog = (mode: string) => {
        if( mode === "Cancel" ) { this.setState({becomeOrganizerOpen: false}); return; }
        else{
            //TODO implement upgrade!
            alert("Account Upgraded!");
        }
    };
    openOrganizerDialog = () => { this.setState({becomeOrganizerOpen: true}); };

    render(): ReactNode {
        let user: DB_User | null = this.props.userData;
        return (
            <div>
                <h4>Account Page</h4>
                <Grid container direction="row" xs={12} >
                    <Grid container direction="column" xs={6} >
                        <Grid item sm={"auto"}>
                            <TextField 
                                id="firstName" 
                                label="First Name" 
                                placeholder="First Name" 
                                value={ (user && user.firstName) ? user.firstName : ""}
                                disabled
                            />
                        </Grid>
                        <Grid item sm={"auto"}>
                            <TextField 
                                id="lastName" 
                                label="Last Name" 
                                placeholder="Last Name" 
                                value={ (user && user.lastName) ? user.lastName : ""}
                                disabled
                            />
                        </Grid>
                        <Grid item sm={"auto"}>
                            <TextField 
                                id="email" 
                                label="email" 
                                placeholder="email" 
                                value={ (user && user.email) ? user.email : ""}
                                disabled
                            />
                        </Grid>
                        <Grid item sm={4}></Grid>
                        <Grid item sm={"auto"}>
                            <Button color="primary" variant="outlined" onClick={this.openPasswordDialog} >Change Password</Button>
                        </Grid>
                    </Grid>
                    <Grid container justify="center" xs={6}>
                        <Grid item xs={"auto"}>
                            <ProfilePicture />
                        </Grid>
                    </Grid>
                    <Grid container justify="flex-end" spacing={2}>
                        <Grid item xs={1} alignContent="center">
                            <Button color="primary" variant="outlined" style={{marginTop: "10%"}} >Become Organizer</Button>
                        </Grid>
                        <Grid item xs={1} alignContent="center">
                            <Button 
                                color="secondary" 
                                variant="outlined" 
                                style={{marginTop: "10%"}}
                                onClick={this.openAccountDialog}
                            >
                                Delete Account
                            </Button>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Grid>
                <Dialog open={this.state.changePasswordOpen} onClose={(e) => { this.closePasswordDialog("Cancel"); }} aria-labelledby="form-dialog-title">
                    <DialogTitle id="changePasswordTitle">Change Password</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            autoComplete="off"
                            margin="dense"
                            id="oldPassword"
                            label="Old Password"
                            type="password"
                            onChange={ (e) => { this.setState({oldPassword: e.target.value}); } }
                            fullWidth
                        />
                        <TextField
                            autoComplete="off"
                            margin="dense"
                            id="newPassword"
                            label="New Password"
                            type="password"
                            onChange={ (e) => { this.setState({newPassword: e.target.value}); } }
                            fullWidth
                        />
                        <TextField
                            autoComplete="off"
                            margin="dense"
                            id="newPasswordConfirm"
                            label="newPasswordConfirm"
                            type="password"
                            onChange={ (e) => { this.setState({newPasswordConfirm: e.target.value}); } }
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e) => { this.closePasswordDialog("Cancel"); }} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={(e) => { this.closePasswordDialog("Change"); }} color="primary">
                            Change
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.deleteAccountOpen} onClose={(e) => { this.closePasswordDialog("Cancel"); }} aria-labelledby="form-dialog-title">
                    <DialogTitle id="deleteAccountTitle">Delete Account!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <span style={{color: "red"}}>Deleting your account is permanent!</span><br />
                            If you are sure you would like to delete enter your email and password below.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            autoComplete="off"
                            margin="dense"
                            id="email"
                            label="email"
                            type="email"
                            onChange={ (e) => { this.setState({email: e.target.value}); } }
                            fullWidth
                        />
                        <TextField
                            autoComplete="off"
                            margin="dense"
                            id="password"
                            label="password"
                            type="password"
                            onChange={ (e) => { this.setState({password: e.target.value}); } }
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e) => { this.closeAccountDialog("Cancel"); }} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={(e) => { this.closeAccountDialog("Delete"); }} color="secondary">
                            Delete!
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withRouter(Account);
