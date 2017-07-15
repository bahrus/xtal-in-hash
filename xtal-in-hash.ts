module xtal.elements{
    function initXtalInHash(){
        interface IXtalInHashProperties{
            bind: boolean | polymer.PropObjectType,
            childProps: boolean | polymer.PropObjectType,
            from: boolean | polymer.PropObjectType,
            locationHash: boolean | polymer.PropObjectType,
            set: boolean | polymer.PropObjectType,
            showUsage: boolean | polymer.PropObjectType,
            toFrom: boolean | polymer.PropObjectType,
            //whereUid: string | polymer.PropObjectType,
        }
        const tagName = 'xtal-in-hash';
        if(customElements.get(tagName)) return;

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
        class XtalInHash  extends Polymer.Element implements IXtalInHashProperties{
            bind: boolean;
            childProps: boolean;
            from: boolean;
            locationHash: boolean;
            set: boolean;
            showUsage: boolean;
            toFrom: boolean;
            // whereUid: string;
            static get is(){return 'xtal-in-hash';}
            static get properties() : IXtalInHashProperties{
                return {
                    bind: {
                        type:  Boolean,
                        observer: 'onPropsChange'
                    },
                    childProps:{
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    from:{
                        type:  Boolean,
                        observer: 'onPropsChange'
                    },
                    locationHash:{
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    set:{
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    showUsage:{
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    toFrom:{
                        type: Boolean,
                        observer: 'onPropsChange'
                    },
                    
                }
            }
            previousHash; 
            onPropsChange(){
                if(!this.previousHash) {
                    this.setPropsFromLocationHash();
                }
                if(this.set && this.childProps && this.from && this.locationHash){
                    const _this = this;
                    window.addEventListener('hashchange', () =>{
                        _this.setPropsFromLocationHash();
                    });
                }
            }

            disconnectedCallback(){
                const _this = this;
                window.removeEventListener('hashchange',() =>{
                    _this.setPropsFromLocationHash();
                });
            }
            regExp = /(.*)xtal-in-hash:json```(.*)```(.*)/;
            setPropsFromLocationHash(){
                const hash = window.location.hash;
                if(hash === this.previousHash) return;
                this.previousHash = hash;
                const splitHash = hash.split(this.regExp);
                if(!splitHash || splitHash.length !==5) return;
                const source = JSON.parse(splitHash[2]);
                const targets = this.querySelectorAll('[hash-tag]');
                if(!targets || targets.length === 0) return;
                targets.forEach(target => Object.assign(target, source));
            }
        }
        customElements.define(XtalInHash.is, XtalInHash);
    }

    initXtalInHash();
}