import React, { PureComponent, ReactNode } from 'react'
import {Typography} from "@material-ui/core";

import LoginRegister from "../components/LoginRegister"
import OrganizerLoginDrawer from "../components/OrganizerLoginDrawer";

import { User, Basic_Profile } from "../App"

interface Props { loginFunc: (user: User)=>void, registerFunc: (user: User, profile: Basic_Profile)=>void }
interface State {}

class Splash extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }

    }

    render(): ReactNode {
        return (
            <div>
                <h1>Date MixUp</h1>
                <Typography variant="h3" color="primary" align="left">People should meet in a fun way face-toface. 
                <br />*More dumb Blurb goes here*
                </Typography>
                <LoginRegister loginFunc={this.props.loginFunc} registerFunc={this.props.registerFunc} />
            </div>
        )
    }
}

export default Splash
