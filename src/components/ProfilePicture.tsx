import React, { PureComponent, ReactNode } from 'react'
import {Avatar} from "@material-ui/core";

interface Props {
    screenName?: string,
    onClickFunc?: ()=>void
}
interface State {}

class ProfilePicture extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
            <div style={{ display: "inline-block" }} onClick={this.props.onClickFunc}>
                <Avatar alt="Remy Sharp" src="https://ih1.redbubble.net/image.1096215820.0456/ur,shower_curtain_closed,square,600x600.1.jpg" style={{width: "300px", height: "300px" }} />
                { this.props.screenName ? <span>{this.props.screenName}</span> : <></> }
            </div>
        )
    }
}

export default ProfilePicture
