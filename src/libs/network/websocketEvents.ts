var SocketEvents: { [id:string]: (data: any) => void } = {};

export const setSocketEvent = (evName: string, invokeMethod: (data: any) => void) => {
    SocketEvents[evName] = invokeMethod;
}

export const WebSocketEvents = async (resp: any) => {
    resp = JSON.parse(resp);    
    try{
        SocketEvents[resp.message](resp);
    } catch(e) {
        await new Promise(resolve => setTimeout(resolve, 200));
        WebSocketEvents(resp);
    }
};

export default WebSocketEvents;