type HandlerData = Record<
    keyof WindowEventMap,
    {
        parentListener: (event: WindowEventMap[keyof WindowEventMap]) => void;
        childListeners: { l: (ev: WindowEventMap[keyof WindowEventMap]) => void; opt: boolean | AddEventListenerOptions | undefined }[];
    }
>;

class GlobalEventHandler {
    private globalObject = globalThis as typeof window & { __globalEventHandlers: GlobalEventHandler['eventHandlers'] };

    constructor() {
        if (!this.globalObject.__globalEventHandlers) {
            this.globalObject.__globalEventHandlers = this.eventHandlers;
        }
    }

    eventHandlers: Partial<HandlerData> = {};

    list<K extends keyof WindowEventMap>(type: K) {
        return this.globalObject.__globalEventHandlers[type];
    }

    add<K extends keyof WindowEventMap>(
        handler_P: {
            type: K;
            listener: (ev: WindowEventMap[K]) => void;
            options?: boolean | AddEventListenerOptions;
        },
        replace_P = false,
    ) {
        const { type, listener, options } = handler_P;
        const typeHandlers = this.globalObject.__globalEventHandlers[type];

        if (!typeHandlers) {
            this.globalObject.__globalEventHandlers[type] = {
                childListeners: [{ l: listener, opt: options }],
            };

            this.globalObject.__globalEventHandlers[type]!.parentListener = this.handleListener(this, type);
            this.globalObject.addEventListener(type, this.globalObject.__globalEventHandlers[type]!.parentListener, options);
        } else {
            if (replace_P) {
                typeHandlers.childListeners = [{ l: listener, opt: options }];
            } else {
                typeHandlers.childListeners.push({ l: listener, opt: options });
            }
        }
    }

    remove<K extends keyof WindowEventMap>(handler_P: { type: K; listener: (ev: WindowEventMap[K]) => any; options?: boolean | AddEventListenerOptions }) {
        const { type, listener, options } = handler_P;

        const typeHandlers = this.globalObject.__globalEventHandlers[type];
        if (typeHandlers) {
            const parentTypeListener = typeHandlers.parentListener;
            const specificListenerIndex = typeHandlers.childListeners.findIndex(({ l, opt }) => listener === l && options === opt);
            specificListenerIndex >= 0 && typeHandlers.childListeners.splice(specificListenerIndex, 1);

            if (!typeHandlers.childListeners.length) {
                this.globalObject.removeEventListener(type, parentTypeListener);
                delete this.globalObject.__globalEventHandlers[type];
            }
            // re-add new updated eventListener?
        }
    }

    handleListener<K extends keyof WindowEventMap>(outerThis: this, type: K) {
        return function (event: WindowEventMap[K]) {
            const listeners = outerThis.globalObject.__globalEventHandlers[type]?.childListeners;
            if (!listeners) {
                throw `__globalEventHandlers[ ${type} ] is missing`;
            } else {
                listeners.forEach(({ l: listener }) => {
                    listener(event);
                });
            }
        };
    }
}

export default GlobalEventHandler;
