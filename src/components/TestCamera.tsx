import React, { createRef, PureComponent, ReactNode, RefObject } from 'react'

interface Props {}
interface State {}

class TestCamera extends PureComponent<Props, State> {
    videoRef: RefObject<HTMLVideoElement>;

    constructor(props: Props) {
        super(props)

        this.state = {
            
        }

        this.videoRef = createRef<HTMLVideoElement>();
    }

    componentDidMount = () => {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then( (stream) => {
                if(this.videoRef.current){
                    let vid = this.videoRef.current;
                    vid.srcObject = stream;
                    vid.autoplay = true;
                    let parent = vid.parentElement;
                    if(parent){
                        vid.width = parent.offsetWidth;
                        vid.height = parent.offsetHeight;
                    }
                }
            })
            .catch( (err) => {
                console.log("Something went wrong!");
            });
        }
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
            <span>Video Preview</span>
            <br />
            <video ref={this.videoRef} id="testVideo" width="500px" height="500px"></video>
            </>
        )
    }
}

export default TestCamera
