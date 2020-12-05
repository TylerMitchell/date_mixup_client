import React, { PureComponent, ReactNode } from 'react'

import {FreeTime} from "../sections/Availability";

import Paper from '@material-ui/core/Paper';
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";

interface Props {
    availabilityList: Array<FreeTime>,
    headerArr: Array<string>,
    deleteFunc: (i: number)=>void
}

interface State { availabilityList: Array<FreeTime> }

class AvailabilityTable extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            availabilityList: this.props.availabilityList
        }
    }

    render(): ReactNode {
        return (
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {
                                    this.props.headerArr.map( ( headStr ) => {
                                        return <TableCell align="center">{headStr}</TableCell>
                                    })
                                }
                                <TableCell align="center">Delete Item</TableCell>
                            </TableRow> 
                        </TableHead>
                        <TableBody>
                            {
                                this.props.availabilityList.map( (freeTime: FreeTime, i) => {
                                    return (
                                        <TableRow>
                                            {
                                                Object.keys(freeTime).map((key: string) => {
                                                    // @ts-ignore
                                                    return <TableCell align="center">{freeTime[key]}</TableCell>
                                                })
                                            }
                                            <TableCell align="center">
                                                <Button variant="contained" color="secondary" onClick={() => { this.props.deleteFunc(i) }} >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        )
    }
}

export default AvailabilityTable
