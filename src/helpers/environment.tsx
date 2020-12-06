let APIURL = "";
let WS_APIURL = "";

switch(window.location.hostname){
    case 'localhost' || '127.0.0.1':
        APIURL = 'http://localhost:4000';
        WS_APIURL = 'ws://localhost:4001';
        break;
    case 'date-mixup.herokuapp.com':
        APIURL = "https://date-mixup-server.herokuapp.com";
        WS_APIURL = "https://date-mixup-server.herokuapp.com"; //I might need to make a separate WS Server!
        break;
    default:
        console.log("The hostname encountered in environment.tsx was not expected!");
        break;
}

export default {
    APIURL: APIURL,
    WS_APIURL: WS_APIURL
};