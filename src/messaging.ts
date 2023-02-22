// @ts-ignore
import { EventEmitter } from 'fbemitter';

const emitter = new EventEmitter();

declare type CallBack = (...args: any[]) => void;

/* eslint no-param-reassign: ["off"] */
class Messaging {
  subscriptions: any[] = [];

  getEventType(messageId: string, senderId?: string): string {
    return `${senderId || 'Global'}/${messageId}`;
  }

  addListener(messageId: string, callBack: CallBack, senderId?: string): any {
    const eventType = this.getEventType(messageId, senderId);
    const subscription: any = emitter.addListener(eventType, callBack);
    this.subscriptions.push(subscription);
    return subscription;
  }

  setListener(messageId: string, callBack: CallBack, senderId?: string): any {
    const eventType = this.getEventType(messageId, senderId);

    this.subscriptions.forEach((s: any) => (s.eventType === eventType) && this.delListener(s));

    return emitter.addListener(eventType, callBack);
  }

  emit(messageId: string, data?: any, senderId?: string, timeout?: number) {
    const eventType = this.getEventType(messageId, senderId);
    data = data instanceof Array ? data : [data];

    if (timeout === undefined) {
      emitter.emit(eventType, ...data);
    } else {
      setTimeout(() => emitter.emit(eventType, ...data), timeout || 0);
    }
  }

  get(messageId: string, senderId?: string) {
    const eventType = this.getEventType(messageId, senderId);

    return this.subscriptions.filter((s: any) => (s.eventType === eventType));
  }

  exists(messageId: string, senderId?: string) {
    return this.get(messageId, senderId).length !== 0;
  }

  delListener(subscriptions: any) {
    subscriptions = Array.isArray(subscriptions) ? subscriptions : [subscriptions];
    subscriptions.forEach((dS: any) => {
      this.subscriptions = this.subscriptions.filter((cS: any) => cS !== dS);
      dS.remove();
    });
  }

  // TODO: Deprecated
  addMessagingListener(messageId: string, callBack: CallBack, senderId?: string) {
    console.warn('The addMessagingListener property is deprecated, use addListener instead.');
    this.addListener(messageId, callBack, senderId);
  }

  // TODO: Deprecated
  emitMessage(messageId: string, data?: any, senderId?: string, timeout?: number) {
    console.warn('The emitMessage property is deprecated, use emit instead.');
    this.emit(messageId, data, senderId, timeout);
  }

  // TODO: Deprecated
  delMessagingListener(subscriptions: any) {
    console.warn('The delMessagingListener property is deprecated, use delListener instead.');
    this.delListener(subscriptions);
  }
}

const messaging = new Messaging();

export default messaging;
