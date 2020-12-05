import React, { ChangeEvent, PureComponent, ReactNode } from 'react'
import {Link} from "react-router-dom";
import ProfilePicture from "../components/ProfilePicture";

import { Button, Container, Grid, TextField, TextareaAutosize, SvgIcon } from "@material-ui/core";

import SettingsIcon from "@material-ui/icons/Settings";
import { DB_Profile, DB_User } from '../App';

interface Props { 
    getProfileFunc: (id: number|null)=>void, 
    putProfileFunc: (profile: DB_Profile)=>void, 
    profileData: DB_Profile | null
    userData: DB_User | null
}
interface State { profile: DB_Profile }

class Bio extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        if(this.props.profileData){
            this.state = {
                profile: this.props.profileData
            }
        }
    }

    componentDidMount = () => {
        this.props.getProfileFunc(null);
    }

    onChangeScreenName = (e: ChangeEvent<any>) => {
        let profile = { ...this.state.profile };
        profile.screenName = e.target.value;
        this.setState({ profile: profile }); 
    }

    onChangeAge = (e: ChangeEvent<any> ) => { 
        let profile = {...this.state.profile};
        profile.age = parseInt(e.target.value, 10);
        this.setState({ profile: profile }); 
    }

    onChangeGender = (e: ChangeEvent<any>) => {
        let profile = {...this.state.profile};
        profile.gender = e.target.value
        this.setState({ profile: profile });
    }

    onChangeBio = (e: ChangeEvent<any>) => {
        let profile = {...this.state.profile};
        profile.bio = e.target.value;
        this.setState({ profile: profile });
    }

    render(): ReactNode {
        let profile: DB_Profile = this.state.profile;
        let user: DB_User | null = this.props.userData;
        return (
            <div>
                <Container component="div">
                    <Grid container direction="row" sm={12}>
                        <Grid container direction="column" item sm={6}>
                            <Grid container item sm={"auto"}>
                                <TextField 
                                    id="screenName" 
                                    label="Screen Name" 
                                    placeholder="Screen Name"
                                    value={ (profile && profile.screenName) ? profile.screenName : ""}
                                    onChange={this.onChangeScreenName}
                                />
                            </Grid>
                            <Grid container item spacing={5} sm={"auto"}>
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
                            </Grid>
                            <Grid container item spacing={5} sm={"auto"}>
                                <Grid item sm={"auto"}>
                                    <TextField 
                                        id="age" 
                                        label="Age" 
                                        placeholder="Age"
                                        value={ (profile && profile.age) ? profile.age : ""}
                                        onChange={this.onChangeAge}
                                    />
                                </Grid>
                                <Grid item sm={"auto"}>
                                    <TextField 
                                        id="gender" 
                                        label="Gender" 
                                        placeholder="Gender"
                                        value={ (profile && profile.gender) ? profile.gender : ""}
                                        onChange={this.onChangeGender}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container direction="row-reverse" item sm={6}>
                            <Grid item sm={"auto"}>
                                <Link to="/account">
                                    <SvgIcon style={{width: "50px", height: "50px" }} component={SettingsIcon} />
                                </Link>
                            </Grid>
                            <Grid item sm={"auto"}>
                                <ProfilePicture />
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
                <Container component="div">
                    <TextareaAutosize
                        rowsMin={10}
                        id="bio"
                        aria-label="Biography Text"
                        placeholder="Type your Bio Here..."
                        style={{width: "100%", borderRadius: "5px" }}
                        value={ (profile && profile.bio) ? profile.bio : ""}
                        onChange={this.onChangeBio}
                        />
                </Container>
                <Container component="div">
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        id="saveButton"
                        aria-label="Save Button"
                        onClick={ () => { this.props.putProfileFunc(this.state.profile); } }
                    >Save</Button>
                </Container>
            </div>
        )
    }
}

export default Bio
