import React, { PureComponent, ReactNode } from 'react'

import EventModal from "../components/Event";

interface Props {}
interface State {}

class TimeLine extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
            <div>
                <span>Time Line Component</span>
                <EventModal />
            </div>
        )
    }
}

export default TimeLine
