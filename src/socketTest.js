import io from "socket.io-client"
export default () =>{
    const socket = io("ws://localhost:4001", {
        withCredentials: true,
        extraHeaders: {
          "Authorization": window.localStorage.getItem("sessionToken")
        },
        auth: {
            token: window.localStorage.getItem("sessionToken")
        }
    });

      // handle the event sent with socket.send()
    socket.on('message', data => { console.log("message recieved: ", data); });

    socket.emit("Join Event", "General");
};