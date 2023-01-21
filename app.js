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
        const targetEmitter = this;
        const topEmitter = this.getTopEmitter(this);

        this.capture(topEmitter, targetEmitter, eventName);
        this.bubble(topEmitter, targetEmitter, eventName);
    }

    getTopEmitter(currentEmitter) {
        let topEmitter = currentEmitter;
        while (topEmitter.parent) {
            topEmitter = topEmitter.parent;
        }
        return topEmitter;
    }

    bubble(topEmitter, targetEmitter, eventName) {
        let currentEmitter = targetEmitter;
        while (currentEmitter) {
            const handlers = currentEmitter.handlers[eventName]
            if (handlers && handlers.length > 0) {
                handlers.forEach(handler => {
                    if (!handler.capture) handler.handler();
                })
            }
            currentEmitter = currentEmitter.parent;
        }
    }
    
    capture(topEmitter, targetEmitter, eventName) {
        let currentEmitter = topEmitter;
        while (currentEmitter && currentEmitter.parent !== targetEmitter) {
            const handlers = currentEmitter.handlers[eventName]
            if (handlers && handlers.length > 0) {
                handlers.forEach(handler => {
                    if (handler.capture) handler.handler();
                })
            }
            currentEmitter = currentEmitter.child;
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

childEmitter.emit("hoba");