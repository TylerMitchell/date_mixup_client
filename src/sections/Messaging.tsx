import React, { PureComponent, ReactNode } from 'react'

interface Props {}
interface State {}

class Messaging extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
            <span>Messaging Section</span>
        )
    }
}

export default Messaging
