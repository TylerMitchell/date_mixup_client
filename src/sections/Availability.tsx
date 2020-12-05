import React, { ChangeEvent, Component, ReactNode, MouseEvent } from 'react'
import { DateTime } from "luxon";

import { DB_Profile } from "../App";
import TimePicker from "../components/TimePicker";

import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import AvailabilityTable from "../components/AvailabilityTable";


import {timeToString} from "../util"

interface Props { profileData: DB_Profile | null }
interface State extends FreeTime{  
    availabilityList: Array<FreeTime>
}

export interface FreeTime { selectedDay: string, timeFrom: string, timeTo: string }

class Availability extends Component<Props, State> {
    availabilityIndexIdTuples: Array<any>
    constructor(props: Props) {
        super(props)

        this.state = {
            availabilityList: [],
            selectedDay: "Sunday",
            timeFrom: "12:00AM", 
            timeTo: "12:30AM"
        }
        this.availabilityIndexIdTuples = [];
    }

    stringToDate = (day: string, time: string): Date => {
        let hours: number = (parseInt(time.substr(0,2), 10) === 12) ? 0 : parseInt(time.substr(0,2), 10) + (time.includes("PM") ? 12 : 0);
        let minutes: number = parseInt(time.substr(3,5), 10);

        let dayToIndex = (d: string) => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(d)+1;

        let date = DateTime.fromObject({weekday: dayToIndex(day), hour: hours, minute: minutes})

        return new Date(date.toHTTP());
    }

    availabilityIdToIndex = (id: number) => this.availabilityIndexIdTuples.filter( (tuple) => tuple[1] === id ).flat(3)[0]
    availabilityIndexToId = (index: number) => this.availabilityIndexIdTuples.filter( (tuple) => tuple[0] === index ).flat(3)[1]

    addAvailability = (e: MouseEvent) => {
        let { selectedDay, timeFrom, timeTo } = this.state;
        this.setState({
            availabilityList: this.state.availabilityList.concat([{ 
                selectedDay: selectedDay,
                timeFrom: timeFrom,
                timeTo: timeTo
            }])
        }, () => { 
            fetch("http://localhost:4000/profile/availability", {
                method: "POST",
                body: JSON.stringify({ 
                    availability: { 
                        day: selectedDay, 
                        timeFrom: this.stringToDate(selectedDay, timeFrom), 
                        timeTo: this.stringToDate(selectedDay, timeTo),
                        profileId: (this.props.profileData) ? this.props.profileData.id : -1
                    }
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Authorization": window.localStorage.getItem("sessionToken") as string
                })
            }).then( (res) => { return res.json(); }, (err) => { console.log( "Error: ", err ); } )
            .then( (json) => {
                let index = this.state.availabilityList.length-1;
                let id = json.availability.id;
                this.availabilityIndexIdTuples.push([index, id]);
            })
            console.log(this.state.availabilityList); 
        });
    };

    deleteAvailability = (i: number) => {
            let list: Array<FreeTime> = this.state.availabilityList.slice(0, this.state.availabilityList.length); 
            delete list[i];
            this.setState({ 
                availabilityList: list 
            }, () => {
                fetch("http://localhost:4000/profile/availability", {
                    method: "DELETE",
                    body: JSON.stringify({ availabilityId: this.availabilityIndexToId(i) }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": window.localStorage.getItem("sessionToken") as string
                    })
                }).then( (res) => { return res.json(); }, (err) => { console.log( "Error: ", err ); } )
                .then( (json) => {
                })
                console.log("item deleted: ", this.state.availabilityList); 
            }); 
    }

    componentDidMount = () => {
        if(this.props.profileData){
            fetch(`http://localhost:4000/profile/availability/${this.props.profileData.id}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Authorization": window.localStorage.getItem("sessionToken") as string
                })
            }).then( (res) => { return res.json(); }, (err) => { console.log( "Error: ", err ); } )
            .then( (json) => {
                console.log(json.availabilities);
                let aList: Array<FreeTime> = [];
                json.availabilities.forEach( (availability: any, index: number) => {
                    let timeFrom: DateTime = DateTime.fromISO(availability.timeFrom);
                    let timeTo: DateTime = DateTime.fromISO(availability.timeTo);
                    aList.push({ 
                        selectedDay: availability.day, 
                        timeFrom: timeToString(timeFrom.hour, timeFrom.minute), 
                        timeTo: timeToString(timeTo.hour, timeTo.minute)
                    });
                    this.availabilityIndexIdTuples.push([index, availability.id]);
                })
                this.setState({ availabilityList: aList });
            })
        } else{ console.log("Tried to use profileData before it had been initialized!"); }
    }

    componentWillUnmount = () => {
        this.availabilityIndexIdTuples = [];
    }

    render(): ReactNode {
        let formStyle = { marginRight: "15px" };
        return (
            <div>
                <span>Weekly Availability Section</span>
                <Grid container xs={12} spacing={8} >
                    <Grid item xs={12}>
                        <FormControl style={formStyle}>
                            <InputLabel id="availableDaySelect">Day</InputLabel>
                            <Select
                                labelId="availableDaySelect"
                                id="availableDaySelect"
                                value={this.state.selectedDay}
                                onChange={(e: ChangeEvent<any>, child: ReactNode): void => {this.setState({ selectedDay: e.target.value }); }}
                            >
                                <MenuItem value={"Sunday"}>Sunday</MenuItem>
                                <MenuItem value={"Monday"}>Monday</MenuItem>
                                <MenuItem value={"Tuesday"}>Tuesday</MenuItem>
                                <MenuItem value={"Wednesday"}>Wednesday</MenuItem>
                                <MenuItem value={"Thursday"}>Thursday</MenuItem>
                                <MenuItem value={"Friday"}>Friday</MenuItem>
                                <MenuItem value={"Saturday"}>Saturday</MenuItem>
                            </Select>
                        </FormControl>
                        <TimePicker 
                            fromChangeFunc={(e: ChangeEvent<any>, child: ReactNode) => { this.setState({ timeFrom: e.target.value as string }); }}
                            toChangeFunc={(e: ChangeEvent<any>, child: ReactNode) => { this.setState({ timeTo: e.target.value as string }); }}
                            defaultFrom={this.state.timeFrom}
                            defaultTo={this.state.timeTo}
                            formStyle={formStyle}
                       />
                       <Button variant="outlined" color="primary" onClick={this.addAvailability}>
                            Add
                        </Button>
                    </Grid>
                </Grid>
                <AvailabilityTable 
                    key={ this.state.availabilityList.length as number }
                    availabilityList={this.state.availabilityList}
                    headerArr={ ["Day", "Time From", "Time To"] }
                    deleteFunc={this.deleteAvailability}
                />
            </div>
        )
    }
}

export default Availability
