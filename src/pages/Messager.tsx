import React, { PureComponent, ReactNode } from 'react'

import SharedBio from "../sections/SharedBio";
import Messaging from "../sections/Messaging";

interface Props {}
interface State {}

class Messager extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
            <div>
                <span>Messager Page</span>
                <SharedBio />
                <Messaging />
            </div>
        )
    }
}

export default Messager
