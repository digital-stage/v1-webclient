import TeckosClient from './TeckosClient';

class TeckosClientWithJWT extends TeckosClient {
  constructor(url: string, token: string, initialData?: any) {
    super(url);
    this._ws.onopen = () => {
      this.once('ready', () => {
        this.listeners('connect').forEach((listener) => listener());
      });
      this.emit('token', {
        token,
        ...initialData,
      });
    };
  }
}

export default TeckosClientWithJWT;
