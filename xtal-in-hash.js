(function () {
    const tagName = 'xtal-in-hash';
    if (customElements.get(tagName))
        return;
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
    class XtalInHash extends HTMLElement {
        constructor() {
            super(...arguments);
            this.regExp = /(.*)xtal-in-hash:json```(.*)```(.*)/;
            this.propertyEventListeners = {};
        }
        get bind() {
            return this._bind;
        }
        set bind(newVal) {
            if (newVal) {
                this.setAttribute('bind', '');
            }
            else {
                this.removeAttribute('bind');
            }
        }
        get childProps() {
            return this._childProps;
        }
        set childProps(newVal) {
            if (newVal) {
                this.setAttribute('child-props', '');
            }
            else {
                this.removeAttribute('child-props');
            }
        }
        get from() {
            return this._from;
        }
        set from(newVal) {
            if (newVal) {
                this.setAttribute('from', '');
            }
            else {
                this.removeAttribute('from');
            }
        }
        get locationHash() {
            return this._locationHash;
        }
        set locationHash(newVal) {
            if (newVal) {
                this.setAttribute('location-hash', '');
            }
            else {
                this.removeAttribute('location-hash');
            }
        }
        get set() {
            return this._set;
        }
        set set(newVal) {
            if (newVal) {
                this.setAttribute('set', '');
            }
            else {
                this.removeAttribute('set');
            }
        }
        get showUsage() {
            return this._showUsage;
        }
        set showUsage(newVal) {
            if (newVal) {
                this.setAttribute('show-usage', '');
            }
            else {
                this.removeAttribute('show-usage');
            }
        }
        get toFrom() {
            return this._toFrom;
        }
        set toFrom(newVal) {
            if (newVal) {
                this.setAttribute('to-from', '');
            }
            else {
                this.removeAttribute('to-from');
            }
        }
        get topLocationHash() {
            return this._topLocationHash;
        }
        set topLocationHash(newVal) {
            if (newVal) {
                this.setAttribute('top-location-hash', '');
            }
            else {
                this.removeAttribute('top-location-hash');
            }
        }
        static get observedAttributes() {
            return ['bind', 'child-props', 'from', 'location-hash', 'top-location-hash', 'set', 'show-usage', 'to-from'];
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
        attributeChangedCallback(name, oldValue, newValue) {
            this['_' + this.snakeToCamel(name)] = newValue !== null;
            this.onPropsChange();
        }
        //_listenerConfigured;
        onPropsChange() {
            if (this.set && this.childProps && this.from && (this.locationHash || this.topLocationHash)) {
                if (!this.previousHash) {
                    const _this = this;
                    const objToAddListernerTo = this.topLocationHash ? window.top : window;
                    objToAddListernerTo.addEventListener('hashchange', () => {
                        _this.setPropsFromLocationHash();
                    });
                }
                this.setPropsFromLocationHash();
            }
            else if (this.bind && this.childProps && this.toFrom &&
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
        connectedCallback() {
            const _this = this;
            XtalInHash.observedAttributes.forEach(attrib => {
                this._upgradeProperty(this.snakeToCamel(attrib));
            });
            this._domObserver = new MutationObserver(mutations => {
                mutations.forEach(function (mutation) {
                    _this.onPropsChange();
                });
            });
            // configuration of the observer:
            const mutationConfig = { childList: true, subtree: true };
            // pass in the target node, as well as the observer options
            this._domObserver.observe(this, mutationConfig);
        }
        disconnectedCallback() {
            const _this = this;
            const objToAddListernerTo = this.topLocationHash ? window.top : window;
            objToAddListernerTo.removeEventListener('hashchange', () => {
                _this.setPropsFromLocationHash();
            });
            this._domObserver.disconnect();
        }
        setPropsFromLocationHash() {
            console.log('in setPropsfromLocation');
            const objToAddListernerTo = this.topLocationHash ? window.top : window;
            const hash = decodeURI(objToAddListernerTo.location.hash);
            console.log({
                hash: hash,
                previousHash: this.previousHash
            });
            if (hash === this.previousHash)
                return;
            const splitHash = hash.split(this.regExp);
            console.log(splitHash);
            if (!splitHash || splitHash.length !== 5)
                return;
            const stripRegEx = /<\/?[^>]+>/gi;
            const source = JSON.parse(splitHash[2], (key, value) => {
                if (typeof value === 'string') {
                    return value.replace(stripRegEx, '');
                }
                else {
                    return value;
                }
            });
            console.log(source);
            const targets = this.querySelectorAll('[hash-tag]');
            if (!targets || targets.length === 0)
                return;
            console.log({
                targets: targets,
                source: source
            });
            //targets.forEach(target => Object.assign(target, source));
            targets.forEach(target => {
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
                            }
                            else if (key.endsWith('?') && typeof val === 'boolean') {
                                const keyStem = key.substr(0, key.length - 1);
                                if (val) {
                                    target.setAttribute(keyStem, '');
                                }
                                else {
                                    target.removeAttribute(keyStem);
                                }
                            }
                            else {
                                if (typeof target[key] === 'object' && typeof val === 'object') {
                                    Object.assign(target[key], val);
                                }
                                else {
                                    target[key] = val;
                                }
                            }
                    }
                }
            });
            this.previousHash = hash;
            return {
                locationHashObj: source,
                targets: targets,
            };
        }
        bindPropsToFromLocationHash() {
            const oneWayProcessing = this.setPropsFromLocationHash();
            if (!oneWayProcessing)
                return;
            const locationHashObj = oneWayProcessing.locationHashObj;
            const targets = oneWayProcessing.targets;
            for (var key in locationHashObj) {
                if (!this.propertyEventListeners[key]) {
                    this.propertyEventListeners[key] = true;
                    const snakeCase = Polymer.CaseMap.camelToDashCase(key);
                    for (let i = 0, ii = targets.length; i < ii; i++) {
                        const target = targets[i];
                        target.addEventListener(snakeCase + '-changed', e => {
                            //debugger;
                            locationHashObj[key] = e.detail.value;
                            const newJsonString = JSON.stringify(locationHashObj);
                            const objToAddListernerTo = this.topLocationHash ? window.top : window;
                            const hash = decodeURI(objToAddListernerTo.location.hash);
                            const splitHash = hash.split(this.regExp);
                            if (!splitHash || splitHash.length !== 5)
                                return;
                            splitHash[2] = 'xtal-in-hash:json```' + newJsonString + '```';
                            const newHash = splitHash.join('');
                            objToAddListernerTo.location.hash = splitHash.join('');
                        });
                    }
                    // this.addEventListener(snakeCase + '-changed', e =>{
                    //     debugger;
                    // })
                }
            }
        }
    }
    customElements.define(XtalInHash.is, XtalInHash);
})();
//# sourceMappingURL=xtal-in-hash.js.map