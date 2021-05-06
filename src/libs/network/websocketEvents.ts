var SocketEvents: { [id:string]: (data: any) => void } = {};

export const setSocketEvent = (evName: string, invokeMethod: (data: any) => void) => {
    SocketEvents[evName] = invokeMethod;
}

export const WebSocketEvents = async (resp: any) => {
    if((typeof resp) === "string") {
        resp = JSON.parse(resp);
    }  
    SocketEvents[resp.message](resp);
};

export default WebSocketEvents;