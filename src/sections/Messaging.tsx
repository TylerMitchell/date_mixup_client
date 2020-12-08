import React, { createRef, PureComponent, ReactNode, RefObject, ChangeEvent, MouseEvent} from 'react'
import { DB_Profile } from '../App'

import {Socket } from "socket.io-client";

import Grid from "@material-ui/core/Grid";
import Container from '@material-ui/core/Container';
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Button from "@material-ui/core/Button";

interface Props {
    otherProfile: DB_Profile|null,
    socket: Socket
}
interface State {
    messagesArr: Array<string>
}

class Messaging extends PureComponent<Props, State> {
    chatBoxRef: RefObject<HTMLTextAreaElement>;
    constructor(props: Props) {
        super(props)

        this.state = {
            messagesArr: []
        }

        this.chatBoxRef = createRef<HTMLTextAreaElement>();
    }

    handleSendClicked = (e: MouseEvent) => { 
        let chatbox = this.chatBoxRef.current;
        if(chatbox){
            console.log( "chat value: ", chatbox);
            this.props.socket.emit("Send Message", chatbox.value);
            let msgArr = [...this.state.messagesArr];
            msgArr.push("Me: " + chatbox.value);
            this.setState({ messagesArr: msgArr });
            chatbox.value = "";
        }
    }

    componentDidMount = () => {
        this.props.socket.on("Got Message", (message: string) => {
            let msgArr = [...this.state.messagesArr];
            if(this.props.otherProfile){ msgArr.push(`${this.props.otherProfile.screenName}: ` + message); }
            this.setState({ messagesArr: msgArr });
        })
    }

    componentWillUnmount = () => {

    }

    render(): ReactNode {
        return (
            <div>
                <Grid container direction="column">
                    <Grid item xs={12}>
                        <h4>Messaging with [{ this.props.otherProfile ? this.props.otherProfile.screenName : "Error!"}]</h4>
                    </Grid>
                    <Grid item xs={12}>
                        <Container>Messages will populate here: <br />
                            { this.state.messagesArr.map( (message: string) => { return <><span>{message}</span><br /></> })}
                        </Container>
                    </Grid>
                    <Grid item xs={12}>
                        <TextareaAutosize
                            ref={this.chatBoxRef}
                            rowsMin={4}
                            id="enterMessage"
                            aria-label="Message Text"
                            style={{width: "100%", borderRadius: "5px" }}
                            placeholder="Enter message here..."
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button 
                            style={{ width: "99%" }} 
                            color="primary" 
                            variant="outlined"
                            onClick={ this.handleSendClicked }
                        >
                            Send Message
                        </Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Messaging
