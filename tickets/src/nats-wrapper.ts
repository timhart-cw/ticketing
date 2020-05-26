import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  //? tells typescript that this variable may be undefined for some time.  We can only set it after the
  //connection to the nats server has actually been established (in connect method)
  private _client?: Stan;

  //creating getter this is built in so will be called with natsWrapper.client rather than .client()
  get client() {
    if (!this._client) {
      throw new Error('cannot access NATS client before connecting');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    //as we now have the getting in place we can refer to .client rather than ._client
    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('CONNECTED TO NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
//here we are exporting an instance rather than the class - singleton style model
