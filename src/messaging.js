import { EventEmitter } from 'fbemitter';

const emitter = new EventEmitter();

/* eslint no-param-reassign: ["off"] */
class Messaging {
  getEventType(messageId, senderId) {
    return `${senderId || 'Global'}/${messageId}`;
  }

  addMessagingListener(messageId, callBack, senderId) {
    const eventType = this.getEventType(messageId, senderId);
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

  delMessagingListener(subscription) {
    subscription.remove();
  }
}

const messaging = new Messaging();

export default messaging;
