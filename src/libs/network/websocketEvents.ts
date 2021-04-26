import Container, { container } from '../common/container';

var SocketEvents: { [id:string]: (data: any) => void };

export const setSocketEvent = (evName: string, invokeMethod: (data: any) => void) => {
    SocketEvents[evName] = invokeMethod;
}

export const WebSocketEvents = (resp: any) => {
    resp = JSON.parse(resp);
    SocketEvents[resp.message](resp.data);
        
};

export default WebSocketEvents;