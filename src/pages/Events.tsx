import React, { PureComponent, ReactNode } from 'react'

import DaySwitcher from "../components/DaySwitcher";

interface Props {}
interface State {}

class Events extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
            <div>
                <span>Events Page</span>
                <DaySwitcher />
            </div>
        )
    }
}

export default Events
