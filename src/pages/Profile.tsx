import React, { PureComponent, ReactNode } from 'react'
import { Link } from "react-router-dom";

import {DB_Fields, Basic_Profile, DB_Profile, User, DB_User} from "../App"
import Bio from "../sections/Bio";
import Availability from "../sections/Availability";

interface Props { 
    getProfileFunc: (id: number|null)=>void, 
    putProfileFunc: (profile: DB_Profile)=>void,
    profileData: DB_Profile | null,
    userData: DB_User | null
}
interface State {}

class Profile extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {

        }
    }

    render(): ReactNode {
        return (
            <div>
                <h2>Profile Page</h2>
                <Bio 
                    profileData={this.props.profileData}
                    userData={this.props.userData}
                    getProfileFunc={this.props.getProfileFunc} 
                    putProfileFunc={this.props.putProfileFunc} 
                />
                <hr />
                <Availability profileData={this.props.profileData} />
            </div>
        )
    }
}

export default Profile
