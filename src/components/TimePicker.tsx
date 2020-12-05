import React, { ChangeEvent, PureComponent, ReactNode } from 'react'

import { Select, FormControl, InputLabel, MenuItem } from "@material-ui/core";

interface Props { 
    fromChangeFunc: (e: ChangeEvent<any>, child: ReactNode)=>void, 
    toChangeFunc: (e: ChangeEvent<any>, child: ReactNode)=>void,
    defaultFrom: string,
    defaultTo: string,
    formStyle: {}
};
interface State { }

export type timeRepresentation = {
    hours: number,
    minutes: number
}

class TimePicker extends PureComponent<Props, State> {
    timeMap: Record<string, timeRepresentation>
    constructor(props: Props) {
        super(props)

        this.state = {
        }

        this.timeMap = {}
        let timeToString = (hour: number, minute: number) => { 
            return ( ((hour%12 == 0) ? 12 : (hour%12) ).toString().padStart(2, "0") + ":" 
                + minute.toString().padStart(2, "0") 
                + (hour < 12 ? "AM" : "PM") );
        };

        for(let hour = 0; hour < 25; hour++){
            this.timeMap[ timeToString(hour, 0) ] = { hours: hour, minutes: 0 };
            this.timeMap[ timeToString(hour, 30) ] = { hours: hour, minutes: 30 };
        }
    }

    render(): ReactNode {
        return (
            <>
                <FormControl style={this.props.formStyle}>
                    <InputLabel id="timeFrom">Time From</InputLabel>
                    <Select
                        labelId="timeFrom"
                        id="timeFrom"
                        value={this.props.defaultFrom}
                        onChange={this.props.fromChangeFunc}
                    >
                        { Object.keys(this.timeMap).map( (key) => { 
                            return <MenuItem value={key}>{key}</MenuItem>;
                        } ) }
                    </Select>
                </FormControl>
                <FormControl style={this.props.formStyle}>
                    <InputLabel id="timeTo">Time To</InputLabel>
                    <Select
                        labelId="timeTo"
                        id="timeTo"
                        value={this.props.defaultTo}
                        onChange={this.props.toChangeFunc}
                    >
                        { Object.keys(this.timeMap).map( (key) => { 
                            return <MenuItem value={key}>{key}</MenuItem>;
                        } ) }
                    </Select>
                </FormControl>
            </>
        )
    }
}

export default TimePicker
