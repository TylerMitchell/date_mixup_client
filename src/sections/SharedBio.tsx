import React, { PureComponent, ReactNode } from 'react'
import { DB_Profile } from '../App';

import Grid from "@material-ui/core/Grid";
import FilledInput  from "@material-ui/core/FilledInput";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

import ProfilePicture from "../components/ProfilePicture";

interface Props {
    profile: DB_Profile|null
}
interface State {}

class SharedBio extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        let profile = this.props.profile;
        return (
            <div style={{borderLeft: "1px dashed lightgrey", padding: "5px"}}>
                <Grid container xs={12} justify="center" direction="column">
                    <Grid item xs={12}>
                        <ProfilePicture />
                    </Grid>
                        { profile ? 
                            <>
                                <Grid item xs={12}><p>ScreenName: {profile.screenName}</p></Grid>
                                <Grid item xs={12}><p>Age: {profile.age}</p></Grid>
                                <Grid item xs={12}><p>Gender: {profile.gender}</p></Grid>
                                <Grid item xs={12}><TextareaAutosize
                                    rowsMin={10}
                                    id="sharedBio"
                                    aria-label="Biography Text"
                                    style={{width: "100%", borderRadius: "5px" }}
                                    value={profile.bio}
                                    disabled
                                /></Grid>
                            </> : <></>
                        }
                </Grid>
            </div>
        )
    }
}

export default SharedBio
