import React, { PureComponent, ReactNode } from 'react'

interface Props {}
interface State {}

class PrivacyPolicy extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
            <span>Privacy Policy Page</span>
        )
    }
}

export default PrivacyPolicy
