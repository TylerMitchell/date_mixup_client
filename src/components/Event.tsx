import React, { PureComponent, ReactNode } from 'react'

interface Props {}
interface State {}

class Event extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
            <span>Event Component</span>
        )
    }
}

export default Event
