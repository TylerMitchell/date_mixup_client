import React, { PureComponent, ReactNode } from 'react'
import { Link } from "react-router-dom";

import MUILink from '@material-ui/core/Link';

interface Props {}
interface State {}

class Footer extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        let linkStyle = { marginLeft: "10px" };
        return (
            <div>
                <hr style={{height: "1px", backgroundColor: "#000000", opacity: "0.2"}} />
                <span>Copyright&copy; Tyler Mitchell 2021</span>
                <MUILink style={linkStyle} component={Link} to="/about">About</MUILink>
                <MUILink style={linkStyle} component={Link} to="/contactus">Contact Us</MUILink>
                <MUILink style={linkStyle} component={Link} to="/privacypolicy">Privacy Policy</MUILink>
            </div>
        )
    }
}

export default Footer
