module xtal.elements {
    function initXtalInHash() {
        interface IXtalInHashProperties {
            bind: boolean | polymer.PropObjectType,
            childProps: boolean | polymer.PropObjectType,
            from: boolean | polymer.PropObjectType,
            locationHash: boolean | polymer.PropObjectType,
            topLocationHash: boolean | polymer.PropObjectType,
            set: boolean | polymer.PropObjectType,
            showUsage: boolean | polymer.PropObjectType,
            toFrom: boolean | polymer.PropObjectType,
            //whereUid: string | polymer.PropObjectType,
        }
        const tagName = 'xtal-in-hash';
        if (customElements.get(tagName)) return;

        /**
        * `xtal-in-hash`
        * Polymer based component that reads the location.hash for a JSON object:
        *  https://mydomain.com/myPath/?queryString=1#myUID1>some-component```json{"prop1": "hello, world"}```
        * 
        *
        * @customElement
        * @polymer
        * @demo demo/index.html
        */
        class XtalInHash extends Polymer.Element implements IXtalInHashProperties {
            bind: boolean;
            childProps: boolean;
            from: boolean;
            locationHash: boolean;
            set: boolean;
            showUsage: boolean;
            toFrom: boolean;
            topLocationHash: boolean;
            // whereUid: string;
            static get is() { return tagName; }
            static get properties(): IXtalInHashProperties {
                return {
                    bind: {
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    childProps: {
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    from: {
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    locationHash: {
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    topLocationHash: {
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    set: {
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    showUsage: {
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    toFrom: {
                        type: Boolean,
                        observer: 'onPropsChange'
                    },

                }
            }
            previousHash;
            onPropsChange() {

                if (this.set && this.childProps && this.from && (this.locationHash || this.topLocationHash)) {
                    const _this = this;
                    const objToAddListernerTo = this.topLocationHash ? window.top : window;
                    objToAddListernerTo.addEventListener('hashchange', () => {
                        _this.setPropsFromLocationHash();
                    });
                    if (!this.previousHash) {
                        this.setPropsFromLocationHash();
                    }
                } else if (this.bind && this.childProps && this.toFrom &&
                    (this.locationHash || this.topLocationHash)) {
                                        const _this = this;
                    const objToAddListernerTo = this.topLocationHash ? window.top : window;
                    objToAddListernerTo.addEventListener('hashchange', () => {
                        _this.bindPropsToFromLocationHash();
                    });
                    if (!this.previousHash) {
                        this.bindPropsToFromLocationHash();
                    }
                }
            }

            disconnectedCallback() {
                const _this = this;
                const objToAddListernerTo = this.topLocationHash ? window.top : window;
                objToAddListernerTo.removeEventListener('hashchange', () => {
                    _this.setPropsFromLocationHash();
                });
            }
            regExp = /(.*)xtal-in-hash:json```(.*)```(.*)/;
            setPropsFromLocationHash() {
                const objToAddListernerTo = this.topLocationHash ? window.top : window;
                const hash = objToAddListernerTo.location.hash;
                if (hash === this.previousHash) return;
                this.previousHash = hash;
                const splitHash = hash.split(this.regExp);
                if (!splitHash || splitHash.length !== 5) return;
                const source = JSON.parse(splitHash[2]);
                const targets = this.querySelectorAll('[hash-tag]');
                if (!targets || targets.length === 0) return;
                targets.forEach(target => Object.assign(target, source));
                return {
                    locationHashObj: source,
                    targets: targets,
                };
            }
            propertyEventListeners: {[key: string]: boolean} = {};
            bindPropsToFromLocationHash() {
                const oneWayProcessing = this.setPropsFromLocationHash();
                if(!oneWayProcessing) return;
                const locationHashObj = oneWayProcessing.locationHashObj;
                const targets = oneWayProcessing.targets;
                for(var key in locationHashObj){
                    if(!this.propertyEventListeners[key]){
                        this.propertyEventListeners[key] = true;
                        const snakeCase = Polymer.CaseMap.camelToDashCase(key);
                        for(let i = 0, ii = targets.length; i < ii; i++){
                            const target = targets[i];
                            target.addEventListener(snakeCase + '-changed', e =>{
                                locationHashObj[key] = (<any>e).detail.value;
                                const newJsonString = JSON.stringify(locationHashObj);
                                const objToAddListernerTo = this.topLocationHash ? window.top : window;
                                const hash = objToAddListernerTo.location.hash;
                                const splitHash = hash.split(this.regExp);
                                if (!splitHash || splitHash.length !== 5) return;
                                splitHash[2] = newJsonString;
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
    }

    const syncFlag = 'xtal_elements_in_hash_sync'
    if (window[syncFlag]) {
        customElements.whenDefined('poly-prep-sync').then(() => initXtalInHash());
        delete window[syncFlag];
    } else {
        if (customElements.get('poly-prep') || customElements.get('full-poly-prep')) {
            initXtalInHash();
        } else {
            customElements.whenDefined('poly-prep').then(() => initXtalInHash());
            customElements.whenDefined('full-poly-prep').then(() => initXtalInHash());
        }

    }
}