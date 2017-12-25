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
        *  Dependency free web component that reads the location.hash for a JSON object:
        *  https://mydomain.com/myPath/?queryString=1#myUID1>some-component```json{"prop1": "hello, world"}```
        * 
        *
        * @customElement
        * @polymer
        * @demo demo/index.html
        */
        class XtalInHash extends HTMLElement implements IXtalInHashProperties {
            _bind: boolean;
            get bind(){
                return this._bind;
            }
            set bind(newVal){
                this._bind = newVal;
                if(newVal){
                    this.setAttribute('bind', '')
                }else{
                    this.removeAttribute('bind');
                } 
            }
            _childProps: boolean;
            get childProps(){
                return this._childProps;
            }
            set childProps(newVal){
                this._childProps = newVal;
                if(newVal){
                    this.setAttribute('child-props', '')
                }else{
                    this.removeAttribute('child-props');
                } 
            }
            _from: boolean;
            get from(){
                return this._from;
            }
            set from(newVal){
                this._from = newVal;
                if(newVal){
                    this.setAttribute('from', '')
                }else{
                    this.removeAttribute('from');
                } 
            }
            _locationHash: boolean;
            get locationHash(){
                return this._locationHash;
            }
            set locationHash(newVal){
                this._locationHash = newVal;
                if(newVal){
                    this.setAttribute('location-hash', '')
                }else{
                    this.removeAttribute('location-hash');
                } 
            }
            _set: boolean;
            get set(){
                return this._set;
            }
            set set(newVal){
                this._set = newVal;
                if(newVal){
                    this.setAttribute('set', '')
                }else{
                    this.removeAttribute('set');
                } 
            }
            _showUsage: boolean;
            get showUsage(){
                return this._showUsage;
            }
            set showUsage(newVal){
                this._showUsage = newVal;
                if(newVal){
                    this.setAttribute('show-usage', '')
                }else{
                    this.removeAttribute('show-usage');
                } 
            }
            _toFrom: boolean;
            get toFrom(){
                return this._toFrom;
            }
            set toFrom(newVal){
                this._toFrom = newVal;
                if(newVal){
                    this.setAttribute('to-from', '')
                }else{
                    this.removeAttribute('to-from');
                } 
            }
            _topLocationHash: boolean;
            get topLocationHash(){
                return this._topLocationHash;
            }
            set topLocationHash(newVal){
                this._topLocationHash = newVal;
                if(newVal){
                    this.setAttribute('top-location-hash', '')
                }else{
                    this.removeAttribute('top-location-hash');
                } 
            }
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
                                splitHash[2] = 'xtal-in-hash:json```' +  newJsonString + '```';
                                
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