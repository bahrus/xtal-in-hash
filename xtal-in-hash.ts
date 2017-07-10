module xtal.elements{
    function initXtalInHash(){
        interface IXtalInHashProperties{
            UID: string | polymer.PropObjectType,
            
        }
        const tagName = 'xtal-in-hash';
        if(customElements.get(tagName)) return;

        /**
        * `xtal-in-hash`
        * Polymer based component that reads the location.hash for a JSON object:
        *  https://mydomain.com/myPath/?queryString=1#xtal-in:myUID1{"prop1": "hello, world"}:xtal-out
        * 
        *
        * @customElement
        * @polymer
        * @demo demo/index_sync.html
        */
        class XtalFetch  extends Polymer.Element implements IXtalInHashProperties{
        }
    }
}