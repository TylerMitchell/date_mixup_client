import React, { PureComponent, ReactNode } from 'react'

interface Props {}
interface State {}

class OrganizerLoginDrawer extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
            <span>Organizer Login Drawer Component</span>
        )
    }
}

export default OrganizerLoginDrawer
