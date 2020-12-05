import React, { PureComponent, ReactNode } from 'react'

import ProfilePicture from "../components/ProfilePicture";

interface Props {}
interface State {}

class SharedBio extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
            <div>
                <span>Shared Bio Section</span>
                <ProfilePicture />
            </div>
        )
    }
}

export default SharedBio
