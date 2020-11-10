import SocketEventEmitter from './SocketEventEmitter';
import SocketEvent from './SocketEvent';
import { decodePacket, encodePacket } from './Converter';
import { Packet, PacketType } from './Packet';

export interface WebSocketConnectionOptions {
  reconnection: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  reconnectionDelayMax?: number;
  timeout?: number;
}

class TeckosClient extends SocketEventEmitter<SocketEvent> {
  private readonly _url: string;

  private _reconnectTimeout: number = 250;

  private _acks: Map<number, (...args: any[]) => void> = new Map();

  private _fnId: number = 0;

  protected readonly _options: WebSocketConnectionOptions | undefined;

  protected _ws: WebSocket;

  constructor(url: string, options?: WebSocketConnectionOptions) {
    super();
    this._options = options;
    this._url = url;
    this._connect();
  }

  private _connect = () => {
    this._ws = new WebSocket(this._url);
    this._ws.onopen = this._handleOpen;
    this._ws.onerror = this._handleError;
    this._ws.onclose = this._handleClose;
    this._ws.onmessage = this._handleMessage;
  };

  public get connected(): boolean {
    return this._ws.readyState === 1;
  }

  public get disconnected() {
    return !this.connected;
  }

  public emit = (event: SocketEvent, ...args: any[]): boolean => {
    args.unshift(event);

    const packet: Packet = {
      type: PacketType.EVENT,
      data: args,
    };

    if (typeof args[args.length - 1] === 'function') {
      this._acks.set(this._fnId, args.pop());
      packet.id = this._fnId;
      this._fnId += 1;
    }

    return this._send(packet);
  };

  public send = (...args: any[]): boolean => {
    args.unshift('message');
    return this._send({
      type: PacketType.EVENT,
      data: args,
    });
  };

  private _send = (packet: Packet): boolean => {
    if (this.connected) {
      console.debug('SEND PACKAGE');
      console.debug(packet);
      const buffer = encodePacket(packet);
      this._ws.send(buffer);
      return true;
    }
    return false;
  };

  protected _handleMessage = (msg: MessageEvent) => {
    const packet = typeof msg.data === 'string' ? JSON.parse(msg.data) : decodePacket(msg.data);

    console.debug('RECEIVED PACKAGE');
    console.debug(packet);

    if (packet.type === PacketType.EVENT) {
      const event = packet.data[0];
      const args = packet.data.slice(1);
      if (event) {
        this.listeners(event).forEach((listener) => listener(...args));
      } else {
        console.error(msg.data);
      }
    } else if (packet.type === PacketType.ACK && packet.id !== undefined) {
      // Call assigned function
      const ack = this._acks.get(packet.id);
      if (typeof ack === 'function') {
        ack.apply(this, packet.data);
        this._acks.delete(packet.id);
      }
    } else {
      console.error(`Invalid type: ${packet.type}`);
    }
  };

  protected _handleOpen = () => {
    this.listeners('connect').forEach((listener) => listener());
  };

  protected _handleError = (error: Event) => {
    if (this._handlers && this._handlers.error) {
      this._handlers.error.forEach((listener) => listener(error));
    }
  };

  protected _handleClose = () => {
    this.listeners('disconnect').forEach((listener) => listener());

    // Try reconnect
    this._reconnectTimeout = 250;
    setTimeout(() => {
      this._connect();
    }, Math.min(4000, this._reconnectTimeout + this._reconnectTimeout));
  };

  public close = () => {
    this._ws.close();
  };
}

export default TeckosClient;
