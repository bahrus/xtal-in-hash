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
            whereUid: string | polymer.PropObjectType,
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
        * @demo demo/index_sync.html
        */
        class XtalInHash  extends Polymer.Element implements IXtalInHashProperties{
            bind: boolean;
            childProps: boolean;
            from: boolean;
            locationHash: boolean;
            set: boolean;
            showUsage: boolean;
            toFrom: boolean;
            whereUid: string;
            static get is(){return tagName;}
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
                    /**
                     * Should be unique for the entire page
                     */
                    whereUid:{
                        type: String
                    }
                }
            }
             
            onPropsChange(){
                if(this.set && this.childProps && this.from && this.locationHash && this.whereUid){
                    window.addEventListener('hashchange', this.setPropsFromLocationHash);
                }
            }

            disconnectedCallback(){
                window.removeEventListener('hashchange', this.setPropsFromLocationHash);
            }

            setPropsFromLocationHash(){
                const hash = window.location.hash;
                const regExp = new RegExp('(.*)' + this.whereUid + '>(.*)```JSON(.*)```(.*)')
                const splitHash = hash.split(regExp);
                if(!splitHash || splitHash.length !==6) return;
                const selector = splitHash[2];
                const target = this.querySelector(selector);
                if(!target) return;
                const source = JSON.parse(splitHash[3]);
                Object.assign(target, source);
            }
        }
    }
}