class EventEmitter {
    handlers = {};
    handlersCapture = {}

    constructor(parent) {
        this.parent = parent;
        this.on.capture = (eventName, handler) => {
            this.addHandler(eventName, handler, true);
        }
    }

    on(eventName, handler) {
        return this.addHandler(eventName, handler);
    }

    addHandler(eventName, handler, capture = false) {
        const handlers = capture ? this.handlersCapture : this.handlers;
        if (handlers[eventName]) {
            handlers[eventName].push(handler);
            return handler;
        }
        handlers[eventName] = [handler];
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
        this.handlers[eventName].forEach(handler => handler());
        this.handlersCapture[eventName].forEach(handler => handler())
    }
}

const emitter = new EventEmitter();

emitter.on("hoba", () => console.log("bubble hoba1"));
emitter.on("hoba", () => console.log("bubble hoba2"));
emitter.on("heya", () => console.log("bubble heya"));

emitter.on.capture("hoba", () => console.log("capture hoba1"));
emitter.on.capture("hoba", () => console.log("capture hoba2"));
emitter.on.capture("heya", () => console.log("capture heya"));

emitter.emit("hoba")