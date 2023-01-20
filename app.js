class EventEmitter {
    handlers = {};

    constructor(parent) {
        if (parent) {
            this.parent = parent;
            parent.child = this;
        }
        this.on = (eventName, handler) => {
            return this.addHandler(eventName, handler);
        }
        this.on.capture = (eventName, handler) => {
            this.addHandler(eventName, handler, true);
        }
    }

    addHandler(eventName, handler, capture = false) {
        const handlers = this.handlers
        if (handlers[eventName]) {
            handlers[eventName].push({handler, capture});
            return handler;
        }
        handlers[eventName] = [{handler, capture}];
        return handler;

    }
    off(eventName, handler) {
        if (handler !== undefined) {
            this.handlers[eventName] =  this.handlers[eventName].filter(item => item.handler !== handler);
            return;
        }
        this.handlers[eventName] = [];

    }
    emit(eventName) {
        this.handlers[eventName].forEach(handler => handler.handler());
        if (this.parent) {
            this.parent.emit(eventName);
        }
    }
}


const emitter = new EventEmitter();
const childEmitter = new EventEmitter(emitter);

emitter.on("hoba", () => console.log("bubble hoba1"));
emitter.on("hoba", () => console.log("bubble hoba2"));
emitter.on("heya", () => console.log("bubble heya"));

emitter.on.capture("hoba", () => console.log("capture hoba1"));
emitter.on.capture("hoba", () => console.log("capture hoba2"));
emitter.on.capture("heya", () => console.log("capture heya"));

//emitter.emit("hoba")

childEmitter.emit("hoba")
console.log("end")