import React, { ChangeEvent, Component, ReactNode } from 'react'
import {RouteComponentProps, withRouter} from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AccountCircle from "@material-ui/icons/AccountCircle"
import EventNote from "@material-ui/icons/EventNote"
import Contacts from "@material-ui/icons/Contacts"

interface Props extends RouteComponentProps<any> {} 
interface State { value: string }

class IconBar extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            value: this.props.history.location.pathname
        }
    }

    navigateAway = (path: string) => { this.props.history.push(path) }
    
    handleChange = (event: ChangeEvent<any>, newValue: string) => {
        this.setState({ value: newValue });
        this.navigateAway(newValue);
    };

    render(): ReactNode {
        return (
            <div>
                <Paper square>
                <Tabs
                    value={this.props.history.location.pathname}
                    onChange={ this.handleChange }
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="icon tabs example"
                >
                    <Tab icon={<AccountCircle />} label="Profile" value="/profile" aria-label="accountCircle" />
                    <Tab icon={<EventNote />} label="Events" value="/events" aria-label="eventNote" />
                    <Tab icon={<Contacts />} label="Contacts" value="/contacts" aria-label="contacts" />
                </Tabs>
                </Paper>
            </div>
        )
    }
}

export default withRouter(IconBar)
