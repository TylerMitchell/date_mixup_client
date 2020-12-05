import React, { PureComponent, ReactNode } from 'react'

interface Props {}
interface State {}

class ContactUs extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
            <span>Contact Us Page</span>
        )
    }
}

export default ContactUs
