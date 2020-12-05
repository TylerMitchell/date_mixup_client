import React, { PureComponent, ReactNode } from 'react'
import { Link } from "react-router-dom";

import ProfilePicture from "../components/ProfilePicture";

interface Props {}
interface State {}

class Contacts extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
            <div>
                <span>Contacts Page</span>
                <Link to="/messager">Messager</Link>
                <ProfilePicture />
                <ProfilePicture />
                <ProfilePicture />
                <ProfilePicture />
            </div>
        )
    }
}

export default Contacts
