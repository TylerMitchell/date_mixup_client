import React, { PureComponent, ReactNode } from 'react'

import TimeLine from "../components/TimeLine";

interface Props {}
interface State {}

class DaySwitcher extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
            <div>
                <span>Day Switcher Component</span>
                <TimeLine />
            </div>
        )
    }
}

export default DaySwitcher
