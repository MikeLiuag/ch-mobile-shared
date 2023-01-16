import SocketIOClient from "socket.io-client";

let instance = null;
let socketUrl = null;
let invokeListeners = null;

export class SocketClient {
    connectedSocket = null;
    asyncEvents = [];
    disconnectedCallbacks = {};
    reconnectedCallbacks = {};

    constructor() {
        if (instance) {
            return instance;
        }
        if (!socketUrl) {
            throw new Error('Socket Not Initialized');
        }
        instance = this;
    }

    static init(wsUrl, startListeners) {
        socketUrl = wsUrl;
        invokeListeners = startListeners;
    }

    registerConnectivityCallbacks = (name, onDisconnected, onReconnected) => {
        console.log('Registering Callbacks');
        this.disconnectedCallbacks[name] = onDisconnected;
        this.reconnectedCallbacks[name] = onReconnected;
    };

    unregisterConnectivityCallbacks = (name) => {
        delete this.disconnectedCallbacks[name];
        delete this.reconnectedCallbacks[name];
    };

    notifyDisconnected = ()=>{
        Object.keys(this.disconnectedCallbacks).forEach(key=>{
            const cb = this.disconnectedCallbacks[key];
            console.log('Has Callback');
            if(cb) {
                cb();
            }
        });
    };

    notifyReconnected = ()=>{
        Object.keys(this.reconnectedCallbacks).forEach(key=>{
            const cb = this.reconnectedCallbacks[key];
            if(cb) {
                cb();
            }
        });
    };


    connect = (userId, type) => {
        this.connectedSocket = SocketIOClient(socketUrl, {query: {userId, type}});
        this.attachEventListeners();
        invokeListeners(this.connectedSocket);
    };

    attachEventListeners() {
        this.connectedSocket.on("connect_error", (error) => {
            console.warn("Connect Error");
            console.warn(error);
            this.notifyDisconnected();
        });
        this.connectedSocket.on("connect_timeout", () => {
            console.warn("Socket connection timeout");
        });
        this.connectedSocket.on("reconnect_attempt", () => {
            console.log("Socket Reconnect Attempt");

        });
        this.connectedSocket.on("reconnect", () => {
            console.log("Socket Reconnected Successfully");
            this.notifyReconnected();
        });
        this.connectedSocket.on("reconnecting", () => {
            console.log("Socket Reconnecting..");
        });
        this.connectedSocket.on("reconnect_error", (error) => {
            console.warn("Socket Reconnect Attempt failed");
            console.warn(error);
        });
        this.connectedSocket.on("reconnect_failed", () => {
            console.warn("Socket Reconnection failed at all. Not trying to reconnect now.");
        });
        this.connectedSocket.on("connect", () => {
            console.log('Socket connected successfully');
            this.asyncEvents.forEach((event) => {
                this.connectedSocket.emit(event.target, event.payload);
            });
            this.asyncEvents = [];
        });
    }

    emitAsync = (event) => {
        if (!event.target) {
            throw new Error('Target not supplied for Socket event');
        }
        if (this.connectedSocket && this.connectedSocket.connected) {
            this.connectedSocket.emit(event.target, event.payload);
        } else {
            this.asyncEvents.push(event);
        }
    };

    disconnect = () => {
        if (this.connectedSocket) {
            this.connectedSocket.disconnect();
        }
    };

    getConnectedSocket = () => {
        if (!this.connectedSocket) {
            throw new Error('Socket isn\'t connected');
        }
        return this.connectedSocket;
    };

    static getInstance() {
        return new SocketClient();
    }
}
