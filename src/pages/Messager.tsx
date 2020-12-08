import React, { PureComponent, ReactNode } from 'react'
import { RouteComponentProps, withRouter } from "react-router";

import Grid from "@material-ui/core/Grid";

import { Socket } from "socket.io-client";

import SharedBio from "../sections/SharedBio";
import Messaging from "../sections/Messaging";
import { DB_Profile } from '../App';

interface Props extends RouteComponentProps<any>{
    socket: Socket,
    profilesArr: Array<DB_Profile>
}
interface State {
    otherProfile: DB_Profile|null
}

class Messager extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            otherProfile: null
        }
    }

    componentDidMount = () => {
        //get the specific profile for this user
        let id: number = parseInt(this.props.match.params.id, 10);
        this.props.profilesArr.forEach( (profile) => {
            if( profile.id == id ){ 
                this.setState({ otherProfile: profile }, () => { 
                    console.log("OtherProfile value: " + this.state.otherProfile); 
                }); 
            }
        });
    }

    componentWillUnmount = () => {

    }

    render(): ReactNode {
        return (
            <div>
                <Grid container xs={12}>
                    <Grid item xs={9}>
                        <Messaging socket={this.props.socket} otherProfile={this.state.otherProfile}/>
                    </Grid>
                    <Grid item xs={3}>
                        <SharedBio profile={this.state.otherProfile}/>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withRouter(Messager);