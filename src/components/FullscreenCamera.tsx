import React, { createRef, PureComponent, ReactNode, RefObject } from 'react';
import { Socket, io } from "socket.io-client";

import URLS from "../helpers/environment";

interface Props {}
interface State {
    stream: MediaStream | null,
    otherStream: MediaStream | null,
    localPeerConnection: RTCPeerConnection | null
}

class FullscreenCamera extends PureComponent<Props, State> {
    videoRef: RefObject<HTMLVideoElement>;
    otherVideoRef: RefObject<HTMLVideoElement>;
    socket: Socket | null;
    constructor(props: Props) {
        super(props)

        this.state = {
            stream: null,
            otherStream: null,
            localPeerConnection: null
        }

        this.videoRef = createRef<HTMLVideoElement>();
        this.otherVideoRef = createRef<HTMLVideoElement>();

        this.socket = null;
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

    createPeerConnection = (myStream: MediaStream|void): MediaStream|void => {
        const servers: RTCConfiguration | undefined = undefined;

        let localPeerConnection = new RTCPeerConnection(servers);

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
        //localPeerConnection.addEventListener('negotiationneeded', this.handleIceCandidate);
        // Add local stream to connection and create offer to connect.
        if( this.state.stream ){
            for( const track of this.state.stream.getTracks() ) { (localPeerConnection as any).addTrack(track); }
        }

        this.setState({localPeerConnection: localPeerConnection})
        return myStream;
    }

    setupSockets = ( myStream: MediaStream|void): MediaStream|void => {
        let pc = this.state.localPeerConnection;
        this.socket = io(URLS.WS_APIURL, {
            withCredentials: true,
            auth: {
                token: window.localStorage.getItem("sessionToken")
            }
        });
        this.socket.on('message', ( data: string ) => { console.log("message recieved: ", data); });
        this.socket.emit("Join Event", "General");

        this.socket.on("Initiate Date", () => {
            if( this.state.localPeerConnection ){
                this.state.localPeerConnection.createOffer({offerToReceiveVideo: true, offerToReceiveAudio: true} as RTCOfferOptions)
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
            if(pc){
                pc.setRemoteDescription(new RTCSessionDescription(sessionDescription));
                console.log("Answer recieved and remote description set!");
            } else{ console.log("localPeerConnection state variable is null in onAnswer!"); }
        });

        this.socket.on("Candidate", (data: any) => {
            if(pc){
                pc.addIceCandidate( new RTCIceCandidate({
                    sdpMLineIndex: data.label,
                    candidate: data.candidate
                }) );
                console.log("Ice Candidate recieved and added to Connection!");
            } else{ console.log("localPeerConnection is null in onCandidate!"); }
        });

        return myStream;
    };

    componentDidMount = () => {
        this.initializeStream()
            .then(this.getMediaTracks, (err) => { console.log(err); } )
            .then(this.createPeerConnection)
            .then(this.setupSockets);
    };

    componentWillUnmount = () => {
        let vid = this.videoRef.current;
        if(vid){ 
            vid.srcObject = null;
            vid.autoplay = false;
        }
    }

    render(): ReactNode {
        return (
            <>
                <video ref={this.videoRef}></video>
                <video ref={this.otherVideoRef}></video>
            </>
        )
    }
}

export default FullscreenCamera
