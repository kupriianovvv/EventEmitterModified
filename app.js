class EventEmitter {
    handlers = {};

    on(eventName, handler) {
        if (this.handlers[eventName]) {
            this.handlers[eventName].push(handler);
            return handler;
        }
        this.handlers[eventName] = [handler];
        return handler;
    }
    off(eventName, handler) {
        if (handler !== undefined) {
            this.handlers[eventName] =  this.handlers[eventName].filter(item => item !== handler);
            return;
        }
        this.handlers[eventName] = [];

    }
    emit(eventName) {
        this.handlers[eventName].forEach(handler => handler())
    }
}
