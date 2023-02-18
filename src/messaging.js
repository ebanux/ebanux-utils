import { EventEmitter } from 'fbemitter';

const emitter = new EventEmitter();

/* eslint no-param-reassign: ["off"] */
class Messaging {
  subscriptions = [];

  getEventType(messageId, senderId) {
    return `${senderId || 'Global'}/${messageId}`;
  }

  addListener(messageId, callBack, senderId) {
    const eventType = this.getEventType(messageId, senderId);
    const subscription = emitter.addListener(eventType, callBack);
    this.subscriptions.push(subscription);
    return subscription;
  }

  setListener(messageId, callBack, senderId) {
    const eventType = this.getEventType(messageId, senderId);

    this.subscriptions.forEach((s) => (s.eventType === eventType) && this.delListener(s));

    return emitter.addListener(eventType, callBack);
  }

  emitMessage(messageId, data, senderId, timeout) {
    const eventType = this.getEventType(messageId, senderId);
    data = data instanceof Array ? data : [data];

    if (timeout === false) {
      emitter.emit(eventType, ...data);
    } else {
      setTimeout(() => emitter.emit(eventType, ...data), timeout || 0);
    }
  }

  delListener(subscriptions) {
    subscriptions = Array.isArray(subscriptions) ? subscriptions : [subscriptions];
    subscriptions.forEach((dS) => {
      this.subscriptions = this.subscriptions.filter((cS) => cS !== dS);
      dS.remove();
    });
  }

  // TODO: Deprecated
  addMessagingListener(messageId, callBack, senderId) {
    console.warn('The addMessagingListener property is deprecated, use addListener instead.');
    this.addListener(messageId, callBack, senderId);
  }

  // TODO: Deprecated
  emitMessage(messageId, data, senderId, timeout) {
    console.warn('The emitMessage property is deprecated, use emit instead.');
    this.emit(messageId, data, senderId, timeout);
  }

  // TODO: Deprecated
  delMessagingListener(subscriptions) {
    console.warn('The delMessagingListener property is deprecated, use delListener instead.');
    this.delListener(subscriptions);
  }
}

const messaging = new Messaging();

export default messaging;
