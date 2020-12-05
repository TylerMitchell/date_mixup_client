import React, { createRef, PureComponent, ReactNode, RefObject } from 'react';



interface Props {}
interface State {
    stream: MediaStream | null,
    otherStream: MediaStream | null,
    localPeerConnection: RTCPeerConnection | null,
    remotePeerConnection: RTCPeerConnection | null
}

class FullscreenCamera extends PureComponent<Props, State> {
    videoRef: RefObject<HTMLVideoElement>;
    otherVideoRef: RefObject<HTMLVideoElement>;
    constructor(props: Props) {
        super(props)

        this.state = {
            stream: null,
            otherStream: null,
            localPeerConnection: null,
            remotePeerConnection: null
        }

        this.videoRef = createRef<HTMLVideoElement>();
        this.otherVideoRef = createRef<HTMLVideoElement>();
    }

    initializeStream = (): Promise<MediaStream> => {
        return new Promise( (resolve, reject) => {
            if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                .then( (stream) => {
                    this.setState({stream: stream});
                    //console.log(stream);
                    if(this.videoRef.current){
                        let vid = this.videoRef.current;
                        vid.srcObject = stream;
                        vid.autoplay = true;
                        // let parent = vid.parentElement;
                        // if(parent){
                        //     vid.width = parent.offsetWidth;
                        //     vid.height = parent.offsetHeight;
                        // }
                    }
                    resolve(stream);
                })
                .catch( (err) => {
                    reject("Something went wrong!");
                });
            }
        });
    };

    getMediaTracks = (myStream: MediaStream) => {
        // Get local media stream tracks.
        const videoTracks = myStream.getVideoTracks();
        const audioTracks = myStream.getAudioTracks();
        if (videoTracks.length > 0) { console.log(`Using video device: ${videoTracks[0].label}.`); }
        if (audioTracks.length > 0) { console.log(`Using audio device: ${audioTracks[0].label}.`); }
        return myStream;
    };

    getOtherPeer = (peerConnection: RTCPeerConnection) => {
        return (peerConnection === this.state.localPeerConnection) ?
            this.state.remotePeerConnection : this.state.localPeerConnection;
    };
      
    getPeerName(peerConnection: RTCPeerConnection) {
        return (peerConnection === this.state.localPeerConnection) ?
            'localPeerConnection' : 'remotePeerConnection';
    };

    gotRemoteMediaStream = (event: any) => {
        const mediaStream = event.stream;
        let vid = this.otherVideoRef.current;
        if(vid){
            vid.srcObject = mediaStream;
            vid.autoplay = true;
            this.setState({otherStream: mediaStream});
        }
        console.log('Remote peer connection received remote stream.');
    };

    handleConnectionChange = (event: any) => {
        const peerConnection = event.target;
        console.log('ICE state change event: ', event);
        console.log(`${this.getPeerName(peerConnection)} ICE state: ` + `${peerConnection.iceConnectionState}.`);
    };

    handleConnection = (event: any) => {
        const peerConnection = event.target;
        const iceCandidate = event.candidate;

        if (iceCandidate) {
            const newIceCandidate = new RTCIceCandidate(iceCandidate);
            const otherPeer = this.getOtherPeer(peerConnection);
            
            if(otherPeer){
                otherPeer.addIceCandidate(newIceCandidate)
                    .then(() => {
                        console.log(`${this.getPeerName(peerConnection)} addIceCandidate success.`);
                    }).catch((err: any ) => {
                        console.log(`${this.getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
                        `${err.toString()}.`);
                    });
            } else{ console.log("Peer shouldn't be null here!"); }
        
            console.log(`${this.getPeerName(peerConnection)} ICE candidate:\n` +
                  `${event.candidate.candidate}.`);
        }
    };

    createdOffer = (description: RTCSessionDescriptionInit) => {
        console.log(`Offer from localPeerConnection:\n${description.sdp}`);
      
        console.log('localPeerConnection setLocalDescription start.');
        let localPeerConnection = this.state.localPeerConnection as RTCPeerConnection;
        let remotePeerConnection = this.state.remotePeerConnection as RTCPeerConnection;

        localPeerConnection.setLocalDescription(description)
          .then(() => {
            this.setLocalDescriptionSuccess(localPeerConnection);
          }).catch(this.setSessionDescriptionError);
      
        console.log('remotePeerConnection setRemoteDescription start.');
        remotePeerConnection.setRemoteDescription(description)
          .then(() => {
            this.setRemoteDescriptionSuccess(remotePeerConnection);
          }).catch(this.setSessionDescriptionError);
      
        console.log('remotePeerConnection createAnswer start.');
        remotePeerConnection.createAnswer()
          .then(this.createdAnswer)
          .catch(this.setSessionDescriptionError);
    }

    createdAnswer = (description: RTCSessionDescriptionInit) => {
        console.log(`Answer from remotePeerConnection:\n${description.sdp}.`);
      
        console.log('remotePeerConnection setLocalDescription start.');
        let localPeerConnection = this.state.localPeerConnection as RTCPeerConnection;
        let remotePeerConnection = this.state.remotePeerConnection as RTCPeerConnection;

        remotePeerConnection.setLocalDescription(description)
          .then(() => {
            this.setLocalDescriptionSuccess(remotePeerConnection);
          }).catch(this.setSessionDescriptionError);
      
        console.log('localPeerConnection setRemoteDescription start.');
        localPeerConnection.setRemoteDescription(description)
          .then(() => {
            this.setRemoteDescriptionSuccess(localPeerConnection);
          }).catch(this.setSessionDescriptionError);
    };

    setSessionDescriptionError = (err: RTCError) => { console.log(`Failed to create session description: ${err.toString()}.`); }
    setDescriptionSuccess = (peerConnection: RTCPeerConnection, functionName: string) =>{
        const peerName = this.getPeerName(peerConnection);
        console.log(`${peerName} ${functionName} complete.`);
    };
    setLocalDescriptionSuccess = (peerConnection: RTCPeerConnection) => { 
        this.setDescriptionSuccess(peerConnection, 'setLocalDescription'); 
    };
    setRemoteDescriptionSuccess = (peerConnection: RTCPeerConnection) => { 
        this.setDescriptionSuccess(peerConnection, 'setRemoteDescription'); 
    };

    createPeerConnections = () => {
        const servers: RTCConfiguration | undefined = undefined;

        let localPeerConnection = new RTCPeerConnection(servers);
        console.log('Created local peer connection object localPeerConnection.');

        localPeerConnection.addEventListener('icecandidate', this.handleConnection);
        localPeerConnection.addEventListener(
            'iceconnectionstatechange', this.handleConnectionChange);

        let remotePeerConnection = new RTCPeerConnection(servers);
        console.log('Created remote peer connection object remotePeerConnection.');

        remotePeerConnection.addEventListener('icecandidate', this.handleConnection);
        remotePeerConnection.addEventListener('iceconnectionstatechange', this.handleConnectionChange);

        //add other stream to page
        remotePeerConnection.addEventListener('addstream', this.gotRemoteMediaStream);

        // Add local stream to connection and create offer to connect.
        (localPeerConnection as any).addStream(this.state.stream);
        console.log('Added local stream to localPeerConnection.');

        console.log('localPeerConnection createOffer start.');

        localPeerConnection.createOffer({offerToReceiveVideo: true} as RTCOfferOptions)
            .then(this.createdOffer).catch(this.setSessionDescriptionError);
        this.setState({localPeerConnection: localPeerConnection, remotePeerConnection: remotePeerConnection})
    }

    componentDidMount = () => {
        this.initializeStream()
            .then(this.getMediaTracks, (err) => { console.log(err); } )
            .then(this.createPeerConnections);
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
