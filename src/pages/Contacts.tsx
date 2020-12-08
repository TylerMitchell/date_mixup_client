import React, { PureComponent, ReactNode } from 'react'
import { RouteComponentProps, Link, withRouter } from "react-router-dom";
import { DB_Fields, DB_User, DB_Profile } from '../App';
import { Socket, io } from "socket.io-client";
import ProfilePicture from "../components/ProfilePicture";

import Grid from "@material-ui/core/Grid";
import Badge from "@material-ui/core/Badge";

import URLS from "../helpers/environment";

interface Props extends RouteComponentProps<any>{
    userData: DB_User | null,
    socket: Socket,
    getFriendsFunc: (friendProfilesArr: Array<number>)=>void,
    profilesArr: Array<DB_Profile>,
    onlineProfileIds: Array<number>
}

interface State {
    onlineProfileIds: Array<number>
}

export type ContactRequest = {
    dateSent?: Date,
    status?: string,
    fromProfileId?: number,
    toProfileId?: number
}

export type DB_ContactRequest = ContactRequest & DB_Fields;

class Contacts extends PureComponent<Props, State> {
    socket: Socket;
    constructor(props: Props) {
        super(props)

        this.state = {
            onlineProfileIds: []
        }

        this.socket = this.props.socket;
    }

    componentDidMount = () => {
        this.socket = this.props.socket;
        //fetch contact list
        fetch(URLS.APIURL + "/contacts/", {
            method: "POST",
            headers: new Headers({
                "content-Type": "application/json",
                "Authorization": window.sessionStorage.getItem("sessionToken") as string
            })
        })
        .then( (res) => res.json() )
        .then( (json) => { 
            console.log(json);
            let friendProfileIdArr: Array<number> = [];
            json.contacts.forEach( (contact: DB_ContactRequest) => {
                if(this.props.userData){
                    friendProfileIdArr.push( contact.fromProfileId === this.props.userData.id ? 
                        contact.toProfileId as number : contact.fromProfileId as number );
                }
            });
            this.props.getFriendsFunc( friendProfileIdArr );
        })
        .catch( (err) => { console.log( "Error: ", err ); } );
    }

    componentWillUnmount = () => {

    }

    render(): ReactNode {
        return (
            <div>
                <Grid container xs={12} >
                    { this.props.profilesArr.map( (profile) => {
                        return (
                        <Grid item xs={6} alignItems="flex-start">
                            <Link to={`/messager/${profile.id}`}>
                                <Badge 
                                color={ this.props.onlineProfileIds.includes(profile.id) ? "primary" : "secondary"} 
                                max={99}
                                showZero={true}
                                badgeContent={0}>
                                    <ProfilePicture 
                                        screenName={profile.screenName}
                                    />
                                </Badge>
                            </Link>
                        </Grid>)
                    }) }
                </Grid>
            </div>
        )
    }
}

export default withRouter( Contacts );
