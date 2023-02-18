import { EventEmitter } from 'fbemitter';

const emitter = new EventEmitter();

/* eslint no-param-reassign: ["off"] */
class Messaging {
  subscriptions = [];

  getEventType(messageId, senderId) {
    return `${senderId || 'Global'}/${messageId}`;
  }

  addMessagingListener(messageId, callBack, senderId) {
    const eventType = this.getEventType(messageId, senderId);
    const subscription = emitter.addListener(eventType, callBack);
    this.subscriptions.push(subscription);
    return subscription;
  }

  setMessagingListener(messageId, callBack, senderId) {
    const eventType = this.getEventType(messageId, senderId);

    this.subscriptions.forEach((s) => (s.eventType === eventType) && this.delMessagingListener(s));

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

  delMessagingListener(subscriptions) {
    subscriptions = Array.isArray(subscriptions) ? subscriptions : [subscriptions];
    subscriptions.forEach((dS) => {
      this.subscriptions = this.subscriptions.filter((cS) => cS !== dS);
      dS.remove();
    });
  }
}

const messaging = new Messaging();

export default messaging;
