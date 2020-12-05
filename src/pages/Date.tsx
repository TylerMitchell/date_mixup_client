import React, { MouseEvent, ChangeEvent, PureComponent, ReactNode } from 'react'

import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";

import TestCamera from "../components/TestCamera";
import FullscreenCamera from "../components/FullscreenCamera";

interface Props {}
interface State { 
    selectedEvent: string,
    isEventMode: boolean
}

class Date extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            selectedEvent: "General",
            isEventMode: false
        }
    }

    eventDropSelect = (e: ChangeEvent<any>, child: ReactNode): void => {
        this.setState({ selectedEvent: e.target.value }, ()=>{ console.log(this.state); } );
    }

    handleJoinEvent = (e: MouseEvent) => { this.setState({isEventMode: true}); }

    render(): ReactNode {
        return (
            <div>
                <span>Date Page</span>
                <br />
                <Container id="eventDropContainer" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <FormControl>
                        <InputLabel id="event-select-label">Event</InputLabel>
                        <Select
                            labelId="event-select-label"
                            id="event-select-label"
                            value={this.state.selectedEvent}
                            onChange={this.eventDropSelect}
                        >
                            <MenuItem value={"General"}>General Event</MenuItem>
                            <MenuItem value={"None"}>None</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl style={{marginLeft: "10px" }}>
                        <Button variant="outlined" color="primary" onClick={this.handleJoinEvent}>Join Event!</Button>
                    </FormControl>
                </Container>
                { this.state.isEventMode ? <FullscreenCamera /> : <TestCamera /> }
            </div>
        )
    }
}

export default Date
