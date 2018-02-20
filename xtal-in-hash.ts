
interface IXtalInHashProperties {
    bind: boolean | polymer.PropObjectType,
    childProps: boolean | polymer.PropObjectType,
    from: boolean | polymer.PropObjectType,
    locationHash: boolean | polymer.PropObjectType,
    topLocationHash: boolean | polymer.PropObjectType,
    set: boolean | polymer.PropObjectType,
    //showUsage: boolean | polymer.PropObjectType,
    toFrom: boolean | polymer.PropObjectType,
    //whereUid: string | polymer.PropObjectType,
}
(function () {
    interface IWindowSubscribers {
        win: Window,
        listeners: XtalInHash[]
    }
    const tagName = 'xtal-in-hash';
    if (customElements.get(tagName)) return;
    const location_hash = 'location-hash';
    const top_location_hash = 'top-location-hash';
    /**
    * `xtal-in-hash`
    *  Dependency free web component that reads the location.hash for a JSON object:
    *  https://mydomain.com/myPath/?queryString=1#myUID1...xtal-in-hash```json{"prop1": "hello, world"}```
    * 
    *
    * @customElement
    * @polymer
    * @demo demo/index.html
    */
    class XtalInHash extends HTMLElement implements IXtalInHashProperties {
        _bind: boolean;
        //#region properties
        get bind() {
            return this._bind;
        }
        set bind(newVal) {
            if (newVal) {
                this.setAttribute('bind', '')
            } else {
                this.removeAttribute('bind');
            }
        }
        _childProps: boolean;
        get childProps() {
            return this._childProps;
        }
        set childProps(newVal) {
            if (newVal) {
                this.setAttribute('child-props', '')
            } else {
                this.removeAttribute('child-props');
            }
        }
        _from: boolean;
        get from() {
            return this._from;
        }
        set from(newVal) {
            if (newVal) {
                this.setAttribute('from', '')
            } else {
                this.removeAttribute('from');
            }
        }
        _locationHash: boolean;
        get locationHash() {
            return this._locationHash;
        }
        set locationHash(newVal) {
            if (newVal) {
                this.setAttribute(location_hash, '')
            } else {
                this.removeAttribute(location_hash);
            }
        }
        _set: boolean;
        get set() {
            return this._set;
        }
        set set(newVal) {
            if (newVal) {
                this.setAttribute('set', '')
            } else {
                this.removeAttribute('set');
            }
        }

        _toFrom: boolean;
        get toFrom() {
            return this._toFrom;
        }
        set toFrom(newVal) {
            if (newVal) {
                this.setAttribute('to-from', '')
            } else {
                this.removeAttribute('to-from');
            }
        }
        _topLocationHash: boolean;
        get topLocationHash() {
            return this._topLocationHash;
        }
        set topLocationHash(newVal) {
            if (newVal) {
                this.setAttribute(top_location_hash, '')
            } else {
                this.removeAttribute(top_location_hash);
            }
        }
        //#endregion
        static get observedAttributes() {
            return ['bind', 'child-props', 'from', location_hash, top_location_hash, 'set', 'show-usage', 'to-from'];
        }
        static get is() { return tagName; }
        _upgradeProperty(prop) {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        }
        snakeToCamel(s) {
            return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
        }
        _win: Window;
        attributeChangedCallback(name, oldValue, newValue) {
            const val = newValue !== null;
            this['_' + this.snakeToCamel(name)] = val;
            switch (name) {
                case location_hash:
                    if (val) this._win = window;
                    break;
                case top_location_hash:
                    if (val) this._win = window.top;
                    break;

            }
            this.onPropsChange();
        }


        previousHash;
        onPropsChange() {
            if (!this._win) return;
            if (!this._targets) return;
            if (this.set && this.childProps && this.from && (this.locationHash || this.topLocationHash)) {
                // if (!this.previousHash) {
                //     this._win.addEventListener('hashchange', e => {
                //         XtalInHash.setPropsFromLocationHash(this);
                //     });

                // }
                XtalInHash.createHashSubscriber(this);
                XtalInHash.setPropsFromLocationHash(this);
            } else if (this.bind && this.childProps && this.toFrom &&
                (this.locationHash || this.topLocationHash)) {

                if (!this.previousHash) {
                    const _this = this;
                    const objToAddListernerTo = this.topLocationHash ? window.top : window;
                    objToAddListernerTo.addEventListener('hashchange', () => {
                        _this.bindPropsToFromLocationHash();
                    });

                }
                this.bindPropsToFromLocationHash();
            }
        }
        _targets: NodeListOf<Element>;
        handleNewDOMNodes(mutations: MutationRecord[]) {
            this._targets = this.querySelectorAll('[hash-tag]');
            mutations.forEach(function (mutation) {
                this.onPropsChange(); //TODO:  just apply object to new elements
            });
        }
        _domObserver: MutationObserver;
        connectedCallback() {
            this._targets = this.querySelectorAll('[hash-tag]');
            XtalInHash.observedAttributes.forEach(attrib => {
                this._upgradeProperty(this.snakeToCamel(attrib));
            });

            this._domObserver = new MutationObserver(this.handleNewDOMNodes)
            // configuration of the observer:
            const mutationConfig = { childList: true, subtree: true } as MutationObserverInit;
            // pass in the target node, as well as the observer options
            this._domObserver.observe(this, mutationConfig);
            this.onPropsChange();
        }
        disconnectedCallback() {
            //this._win.removeEventListener('hashchange', this.setPropsFromLocationHash); //TODO
            this._domObserver.disconnect();
        }
        static regExp = /(.*)xtal-in-hash:json```(.*)```(.*)/;
        static stripRegEx = /<\/?[^>]+>/gi;
        static parseLocationHashIfChanged(win: Window, instance?: XtalInHash) {
            const hash = decodeURI(win.location.hash);
            if (instance && hash === instance.previousHash) return;
            const splitHash = hash.split(XtalInHash.regExp);
            if (!splitHash || splitHash.length !== 5) return;
            const source = JSON.parse(splitHash[2], (key, value) => {
                if (typeof value === 'string') {
                    return value.replace(XtalInHash.stripRegEx, '');
                } else {
                    return value;
                }
            });
            if (instance) instance.previousHash = hash;
            return source;
        }
        static getSubscribers(win: Window){
            return this._subscribers.filter(subscriber => subscriber.win === win);
        }
        static _subscribers: IWindowSubscribers[];
        static createHashSubscriber(instance: XtalInHash) {
            if (!this._subscribers) this._subscribers = [];
            const winSubscribers = this.getSubscribers(instance._win);
            if (winSubscribers.length === 0) {
                this._subscribers.push({
                    win: instance._win,
                    listeners: [instance]
                });
                instance._win.addEventListener('hashchange', e => {
                    //XtalInHash.setPropsFromLocationHash(this);
                    this.getSubscribers(instance._win)[0].listeners.forEach(listener =>{
                        this.setPropsFromLocationHash(listener);
                    });
                });
            } else {
                winSubscribers[0].listeners.push(instance);
            }
        }

        static setPropsFromLocationHash(instance: XtalInHash) {

            const source = XtalInHash.parseLocationHashIfChanged(instance._win, instance.previousHash);
            if (!source) return;

            instance._targets.forEach(target => {
                for (const key in source) {
                    switch (key) {
                        case 'innerHTML':
                        case 'textContent':
                        case 'innerText':
                        case 'nodeValue':
                            console.warn(key + " not allowed");
                            break;
                        default:
                            const val = source[key];
                            if (key.endsWith('$') && typeof val === 'string') {
                                target.setAttribute(key.substr(0, key.length - 1), val);
                            } else if (key.endsWith('?') && typeof val === 'boolean') {
                                const keyStem = key.substr(0, key.length - 1);
                                if (val) {
                                    target.setAttribute(keyStem, '');
                                } else {
                                    target.removeAttribute(keyStem);
                                }

                            } else {
                                if (typeof target[key] === 'object' && typeof val === 'object') {
                                    Object.assign(target[key], val);
                                } else {
                                    target[key] = val;
                                }
                            }
                    }
                }
            });
            return {
                locationHashObj: source,
            };
        }
        propertyEventListeners: { [key: string]: boolean } = {};
        bindPropsToFromLocationHash() {
            const oneWayProcessing = XtalInHash.setPropsFromLocationHash(this);
            if (!oneWayProcessing) return;
            const locationHashObj = oneWayProcessing.locationHashObj;
            for (var key in locationHashObj) {
                if (!this.propertyEventListeners[key]) {
                    this.propertyEventListeners[key] = true;
                    const snakeCase = Polymer.CaseMap.camelToDashCase(key);
                    for (let i = 0, ii = this._targets.length; i < ii; i++) {
                        const target = this._targets[i];
                        target.addEventListener(snakeCase + '-changed', e => {
                            locationHashObj[key] = (<any>e).detail.value;
                            const newJsonString = JSON.stringify(locationHashObj);

                            const hash = decodeURI(this._win.location.hash);
                            const splitHash = hash.split(XtalInHash.regExp);
                            if (!splitHash || splitHash.length !== 5) return;
                            splitHash[2] = 'xtal-in-hash:json```' + newJsonString + '```';

                            const newHash = splitHash.join('');
                            this._win.location.hash = splitHash.join('');
                        });
                    }
                }
            }
        }
    }
    customElements.define(XtalInHash.is, XtalInHash);
})();



