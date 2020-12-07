import React, { createRef, PureComponent, ReactNode, RefObject } from 'react';
import { Socket, io } from "socket.io-client";

import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"

import URLS from "../helpers/environment";
import { DB_Profile } from '../App';

interface Props {
    leaveEventFunc: ()=>void
}
interface State {
    stream: MediaStream | null,
    otherStream: MediaStream | null,
    localPeerConnection: RTCPeerConnection | null,
    otherProfile: DB_Profile | null,
    contactRequestRecieved: boolean,
    contactRequestSent: boolean,
    contactRequestAccepted: boolean
}

class FullscreenCamera extends PureComponent<Props, State> {
    videoRef: RefObject<HTMLVideoElement>;
    otherVideoRef: RefObject<HTMLVideoElement>;
    socket: Socket | null;
    requestId: number | null;
    constructor(props: Props) {
        super(props)

        this.state = {
            stream: null,
            otherStream: null,
            localPeerConnection: null,
            otherProfile: null,
            contactRequestRecieved: false,
            contactRequestSent: false,
            contactRequestAccepted: false
        }

        this.videoRef = createRef<HTMLVideoElement>();
        this.otherVideoRef = createRef<HTMLVideoElement>();

        this.socket = null;
        this.requestId = null;
    }

    initializeStream = (): Promise<MediaStream> => {
        return new Promise( (resolve, reject) => {
            if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then( (stream) => {
                    this.setState({stream: stream});
                    //console.log(stream);
                    if(this.videoRef.current){
                        let vid = this.videoRef.current;
                        vid.srcObject = stream;
                        vid.autoplay = true;
                        vid.muted = true;
                        // let parent = vid.parentElement;
                        // if(parent){
                        //     vid.width = parent.offsetWidth;
                        //     vid.height = parent.offsetHeight;
                        // }
                    }
                    resolve(stream);
                })
                .catch( (err) => { reject("Something went wrong!"); });
            }
        });
    };

    getMediaTracks = (myStream: MediaStream): MediaStream => {
        // Get local media stream tracks.
        const videoTracks = myStream.getVideoTracks();
        const audioTracks = myStream.getAudioTracks();
        if (videoTracks.length > 0) { console.log(`Using video device: ${videoTracks[0].label}.`); }
        if (audioTracks.length > 0) { console.log(`Using audio device: ${audioTracks[0].label}.`); }
        return myStream;
    };

    gotRemoteMediaStream = (event: any) => {
        let vid = this.otherVideoRef.current;
        console.log("Hit gotRemoteMediaStream!: ", event);
        if(vid){
            if (event.streams && event.streams[0]) {
                vid.srcObject = event.streams[0];
            } else {
                let s = (!vid.srcObject) ? new MediaStream() : vid.srcObject as MediaStream;
                vid.srcObject = s;
                vid.autoplay = true;
                this.setState({otherStream: s});
                s.addTrack(event.track);
            }
        }
        console.log("remote media stream should be added and visible!")
    };

    handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
        console.log('icecandidate event: ', event);
        if (event.candidate) {
            if(!this.socket){ console.log("Socket is null in handleIceCandidate!"); return;}
            this.socket.emit("Candidate", {
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        } else { console.log('No more candidates.'); }
    };

    createPeerConnection = (servers: any): void => {
        console.log("creating peer connection: ", servers);
        let localPeerConnection = new RTCPeerConnection(servers);
        console.log("peerconnection: ", localPeerConnection);
        localPeerConnection.addEventListener('icecandidate', this.handleIceCandidate);
        localPeerConnection.addEventListener('iceconnectionstatechange', (event) => {
            if (localPeerConnection.iceConnectionState === "failed" ||
                localPeerConnection.iceConnectionState === "disconnected" ||
                localPeerConnection.iceConnectionState === "closed") {
                // Handle the failure
                console.log("Something triggered iceConnectionStateChange in createPeerConnection!");
            }
        });
        localPeerConnection.addEventListener('track', this.gotRemoteMediaStream);
        localPeerConnection.addEventListener('negotiationneeded', () => {
            // localPeerConnection.createOffer().then( (offer) => {
            //     localPeerConnection.setLocalDescription(offer);
            //     if(this.socket) { this.socket.emit("Offer", offer); }
            //     else { console.log("Socket was null in negotiationneeded event!"); }
            // }).catch( (err) => { console.log("Failed to create offer! ", err); } );
        });
        // Add local stream to connection and create offer to connect.
        if( this.state.stream ){
            for( const track of this.state.stream.getTracks() ) { (localPeerConnection as any).addTrack(track); }
        }

        this.setState({localPeerConnection: localPeerConnection})
    }

    setupSockets = ( myStream: MediaStream|void): MediaStream|void => {
        this.socket = io(URLS.WS_APIURL, {
            auth: {
                token: window.sessionStorage.getItem("sessionToken")
            }
        });
        this.socket.on('message', ( data: string ) => { console.log("message recieved: ", data); });
        this.socket.emit("Join Event", "General");

        this.socket.on("Initiate Date", () => {
            let pc = this.state.localPeerConnection;
            if( pc ){
                pc.createOffer({offerToReceiveVideo: true, offerToReceiveAudio: true} as RTCOfferOptions)
                    .then( (sessionDescription: RTCSessionDescriptionInit) => {
                        if( pc && this.socket ){
                            pc.setLocalDescription(sessionDescription);
                            console.log("Offer successfully created!");
                            this.socket.emit("Offer", sessionDescription)
                        }
                    })
                    .catch( (err) => { console.log("Failed to create offer!: ", err); } );
            } else { console.log("localPeerConnection state variable is null when trying to create offer!"); }
        });

        this.socket.on("Offer", (sessionDescription: RTCSessionDescriptionInit) => {
            let pc = this.state.localPeerConnection;
            if(pc){
                pc.setRemoteDescription(new RTCSessionDescription(sessionDescription));
                pc.createAnswer()
                    .then( (mySessionDescription) => {
                        if(pc && this.socket){
                            pc.setLocalDescription(mySessionDescription);
                            console.log("Answer created successfully", mySessionDescription);
                            this.socket.emit("Answer", mySessionDescription)
                        } else{ console.log("localPeerConnection state variable is null when trying to create answer!"); }
                    })
                    .catch( (err) => { console.log("Failed to create answer!: ", err); } );
            } else{ console.log("localPeerConnection state variable is null in onOffer!"); }
        });

        this.socket.on("Answer", (sessionDescription: RTCSessionDescriptionInit) => {
            let pc = this.state.localPeerConnection;
            if(pc){
                pc.setRemoteDescription(new RTCSessionDescription(sessionDescription));
                console.log("Answer recieved and remote description set!");
            } else{ console.log("localPeerConnection state variable is null in onAnswer!"); }
        });

        this.socket.on("Candidate", (data: any) => {
            let pc = this.state.localPeerConnection;
            if(pc){
                pc.addIceCandidate( new RTCIceCandidate({
                    sdpMLineIndex: data.label,
                    candidate: data.candidate
                }) );
                console.log("Ice Candidate recieved and added to Connection!");
            } else{ console.log("localPeerConnection is null in onCandidate!"); }
        });

        this.socket.on("End Date Client", (closeData: any) => {
            this.closeCall();
            console.log( "Date ended because : " + closeData.reason );
        })

        this.socket.on("Other Profile", (profile: DB_Profile) => {
            this.setState({ otherProfile: profile });
        });

        this.socket.on("Contact Exchange Requested", (requestId: number) => {
            //Button Changes on partner client asking them to accept request
            this.setState({ contactRequestRecieved: true });
            this.requestId = requestId;
        });

        this.socket.on("TURN Servers", (servers: any) => {
            console.log("Recieved TURN Servers");
            this.createPeerConnection(servers);
        });

        return myStream;
    };

    componentDidMount = () => {
        this.setState({ contactRequestSent: false, contactRequestRecieved: false, contactRequestAccepted: false });
        this.initializeStream()
            .then(this.getMediaTracks, (err) => { console.log(err); } )
            .then(this.setupSockets);
    };

    componentWillUnmount = () => {
        let vid = this.videoRef.current;
        if(vid){ 
            vid.srcObject = null;
            vid.autoplay = false;
        }
        vid = this.otherVideoRef.current;
        if(vid){ 
            vid.srcObject = null;
            vid.autoplay = false;
        }
        this.closeCall();
        if(this.socket){ this.socket.close(); }
    }

    closeCall = () => {
        if(this.socket && this.state.localPeerConnection){
            this.socket.emit("End Date Client", { reason: "One of the Clients Hit End Date Button" } );
            this.state.localPeerConnection.close();
            this.setState({ localPeerConnection: null, otherStream: null });

            let vid = this.otherVideoRef.current;
            if(vid){ vid.srcObject = null; }

            console.log("remote media stream should be removed")
        }
    }

    initiateContactExchange = () => {
        //send REST request to /request
        //Then when it returns, emit socket message to partner containing request id
        if(this.state.otherProfile){
            fetch(URLS.APIURL + "/contacts/request", {
                method: "POST",
                body: JSON.stringify({ contactRequest: { dateSent: new Date(), toProfileId: this.state.otherProfile.id} }),
                headers: new Headers({
                    "content-Type": "application/json",
                    "Authorization": window.sessionStorage.getItem("sessionToken") as string
                })
            })
            .then( (res) => res.json() )
            .then( (json) => { 
                if( this.socket ){
                    this.socket.emit("Contact Exchange Requested", json.request.id);
                    this.setState({ contactRequestSent: true });
                } else{ console.log("Socket was null in initiateContactExchange()!"); }
                console.log(json); 
            })
            .catch( (err) => { console.log( "Error: ", err ); } );
        } else{ console.log("Other profile was null in initiateContactExchange()!"); }
    }

    acceptContactExchange = () => {
        //if they accept the request, send REST request to /accept
        if( this.requestId ){
            fetch(URLS.APIURL + "/contacts/accept", {
                method: "PUT",
                body: JSON.stringify({ requestId: this.requestId }),
                headers: new Headers({
                    "content-Type": "application/json",
                    "Authorization": window.sessionStorage.getItem("sessionToken") as string
                })
            })
            .then( (res) => res.json() )
            .then( (json) => { 
                if( this.socket ){
                    this.socket.emit("Contact Exchange Accepted", json.request.id);
                    this.setState({ contactRequestAccepted: true })
                } else{ console.log("Socket was null in acceptContactExchange()!"); }
            })
            .catch( (err) => { console.log( "Error: ", err ); } );
        } else{ console.log("RequestId was null in acceptContactExchange"); }
    }

    render(): ReactNode {
        return (
            <>
                <video ref={this.videoRef}></video>
                <video ref={this.otherVideoRef}></video>
                <Grid container xs={12} justify={"center"} >
                    <Grid item xs={4} >
                        { this.state.contactRequestRecieved ? 
                            this.state.contactRequestAccepted ? 
                                <Button color="secondary" variant="outlined" disabled >Accepted</Button> :
                                <Button color="secondary" variant="outlined" onClick={this.acceptContactExchange} >Accept Request!</Button>
                            :
                            this.state.contactRequestSent ? 
                                <Button color="secondary" variant="outlined" disabled >Request Sent</Button> :
                                <Button color="primary" variant="outlined" onClick={this.initiateContactExchange} >Exchange Contacts</Button>
                        }
                        <Button color="primary" variant="outlined" onClick={this.closeCall} >End Date</Button>
                        <Button color="secondary" variant="outlined" onClick={this.props.leaveEventFunc}>Leave event</Button>
                    </Grid>
                </Grid>
            </>
        )
    }
}

export default FullscreenCamera
