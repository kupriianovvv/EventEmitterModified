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


const parent = new EventEmitter();
const ev = new EventEmitter(parent);
const grandSon = new EventEmitter(ev);

parent.on.capture('foo', (e) => {
  console.log('parent foo capture');
});

ev.on.capture('foo', (e) => {
  console.log('son foo capture');
});

ev.on('foo', (e) => {
  console.log('son foo bubbling');
});

parent.on('foo', (e) => {
  console.log('parent foo bubbling');
});

grandSon.on.capture('foo', (e) => {
    console.log('grandson foo capture')
})

grandSon.on('foo', (e) => {
    console.log('grandson foo bubbling')
})

grandSon.emit('foo');