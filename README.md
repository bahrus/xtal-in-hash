[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-in-hash)

# \<xtal-in-hash\>


Allow location.hash to provide an object-based input channel for web components.  


Client-side routing is great for describing paths to resources, following the REST paradigm.  It provides a nice string that can be shared to others, copy and pasted into an email or text message, or using the [web share](https://developers.google.com/web/updates/2016/09/navigator-share) api.  And did I mention that you  can refresh the browser, and see the state you were last in?  

Most modern client-side routing has [ceased using location.hash](http://krasimirtsonev.com/blog/article/deep-dive-into-client-side-routing-navigo-pushstate-hash), in favor of simply updating the main url, with the help of the powerful [history api](https://developer.mozilla.org/en-US/docs/Web/API/History_API).  The history api allows updates to the url to the left of the hash symbol, without informing or expecting anything from the server.  

But the path-based REST notation isn't great at describing every aspect of the state of the application.  Things that don't seem natural to describe using paths are 1)  a flat, non-hierchical list of parameters, for which [query strings](https://www.songsterr.com/a/wa/api/) have traditionally been utilized, and 2) complex objects, typically sent as a [JSON-like structure in the request body](http://graphql.org/).  

xtal-in-hash supplements client-side routing, catering to the two use cases above.

Because routing has largely abandoned loction.hash, this opens up location.hash as a separate string we can play with, for purposes other than what routing is used for, without breaking the routing that various frameworks utilize.

One goal of xtal-in-hash is to be able to declaratively pass properties to iFrames, similar to how it can be passed to web component tags via binding.  Web components can be viewed as a new and greatly improved form of iframes.  However, there are some settings where an iframe is required, or more precisely, a way to expose a web component as a standalone url, that can be integrated into other applications, even non web based application (e.g. an iOS WebView component).  The container might want to declaratively pass state to such a "remote component" just like we do with local components, without having to all agree to a common api.  Another scenario where iframes may still be needed is for those web components that aren't compatible with being inside shadow DOM, such as JQuery plugins.

Often we want to be able to send a snapshot of a particular application, after the user has performed various customizations, via an email or the [web share](https://developers.google.com/web/updates/2016/09/navigator-share), for example.  We don't care that the receiver can click on the back button and see the exact steps we went through to get there, just where we landed.  Some of the state may naturally be represented by the rest-like routing URL.  But part of state we want to persist may benefit from having the full structure of a JSON object at its disposal, and not be limited to a url path. Examples of things we may want to encode in the url, that a restul path string wouldn't be a natural fit for, would be selected values of various filters, grid column user customizations, different views of the same resource (grid vs. chart), and many more.

It is also useful for development and testing if the properties of custom elements inside a page can be modified without touching the code.

The last point may have inadvertently triggered a major spit-take, for which I apologize. This component, and the developer, need to be cognizant of how this feature could theoretically be abused, but every effort is made not to allow any abuse.

**NB:**  An [effort](https://github.com/slightlyoff/history_api) is afoot to provide a standard for similar ideas.

<details>
    <summary>Tough (unsolvable?) problems</summary>

</details>

*xtal-in-hash* searches for, and listens to, the value of window.location.hash for a string inside these markers:

 *  Left hand side marker: json```
 *  Right hand side marker: ``` 

xtal-in-hash parses the string inside the markers above using JSON.parse (which filters out anything other than strings, numbers, booleans). Henceforth this resulting object will be referred to as the hash-clob. It then merges this hash-clob into the child component(s) that opt-in to this scheme.  The root nodes/properties of the hash-clob are treated as separate properties to be set on the target elements. In order to prevent abuse from this kind of external property configuration:

1)  Only elements containing the attribute  hash-tag are affected by xtal-in-hash.  So the developer needs to "opt-in" fairly explicitly.
2)  It will not set properties with name nodeValue, textContent, innerHTML, or innerText.  
3)  HTML tags are also all stripped from any string properties contained within the hash-clob.

xtal-in-hash searches its children for any DOM elements with the attribute *hash-tag*, and passes in the properties from above.  It will continue to modify these children as the window.location.hash changes.

The syntax for this one way binding is shown below.

```html
<xtal-in-hash set child-props from location-hash>
    <some-component hash-tag></some-component>
    ...
    <some-other-component hash-tag></some-other-component>
<xtal-in-hash>
```

Following the convention of lit-html: if a JSON property key name  ends with a $, and the value of is of type string, then the xtal-in-hash will assume this is a string attribute that needs setting.  If a JSON property key name ends with a ?, then xtal-in-hash assumes this is a boolean attribute.  In both cases, the $ or ? are dropped when setting the attribute name.  In all other cases, xtal-in-hash will merge the object or array into the property with the name of the kay.  

In the case of a component being inside a nested iFrame, one can specify to use window.top for the location hash (assuming no cross domain url's in that hierarchy).  One specifies to use window.top as follows:

```html
<xtal-in-hash set child-props from top-location-hash>
    <some-component hash-tag></some-component>
    ...
    <some-other-component hash-tag></some-other-component>
<xtal-in-hash>
```

Our next level of complexity is if we additionally want the binding to work the other way -- if, in the course of the application life cycle, we want those changes to reflect back to location.hash, then we modify the markup to look like this:

```html
<xtal-in-hash bind child-props to-from location-hash>
    <some-component hash-tag></some-component>
    ...
    <some-other-component hash-tag></some-other-component>
<xtal-in-hash>
```

 Now the *xtal-in-hash* component will, in addition, set up a listener for each of the top level properties, with the [-changed](https://www.polymer-project.org/2.0/docs/devguide/data-system#change-events) postfix that Polymer uses, *if* the property is marked as a Polymer "notify" type property.  In the event that one or more of these properties changes, it will apply them back to the location.href, in a kind of two-way binding mechanism.

 We are using Polymer only as a source of convention here -- nothing is requiring your web component to use the Polymer mixins in order to integrate nicely with xtal-in-hash. All that is needed (for two way binding) is to define a static properties property, and add the notify flag:

 ```JavaScript
 class MyIHatePolymerComponent extends HyperSkatingStencilCanJsVueAngularXtagLitElement {
     static get properties(){
         return {
             harumph:{
                 notify: true
             }
         }
     }
 }
 ```

Not all notify properties will be bound to the location.hash -- only those properties that exist in the original location.hash string.  


Microsoft's browsers (IE and Edge) restrict the total length of the url, including the hash portion, to around 2k characters.  So how can we pass large objects or arrays?

## Implemented but not yet tested

## Refs

If a key in the hash-clob ends with the name ".ref:", including the ending colon, and value, for example: "myLargeRef[5],", then xtal-in-hash assumes there is a a global array with name "myLargeRef" (window.myLargeRef or window.top.myLargeRef) with length 5.  xtal-in-hash will pluck that fifth item of the array and apply that value to the myLargeRef property when merging the properties into all the custom elements with attribute hash-tag. 

If the array is smaller than 5, it will take the last element it finds, and update the hash-clob so they are in sync.

If no such reference is found, it will be ignored.  This can be a problem if we are not guaranteed the order between when the necessary global refs will be available, vs the the time when the xtal-in-hash applies all the properties to its targets.  The most straightforward solution would be to not set one of the key attributes / properties until all the references have been loaded onto the page.  I.e.

```JavaScript
loadGlobalReferences.then(() =>{
    document.querySelectorAll('xtal-in-hash').forEach(el => el.childProps = true);
})
```
xtal-in-hash also has a property:  newRef, only applicable if two way binding is enabled.  When setting this property, it must be an object with two sub-properties:  name and value.

If the name sub-property of newRef is "myLargeRef" in the example above, and it is of type array, then xtal-in-hash will append the value subproperty to the global array, and update the hash string to point to the last element of the array..

xtal-in-has has another property to update a ref without getting added to the history:  replaceRef.  This also takes the name and value pair of subproperties. But it replaces the last element of the array, rather than appending.  xtal-in-hash emits an event with name [myLargeRef]-changed that can allow other parts of the page to respond.

Of course, if you refresh the page, or send the hash link, your local large reference objects will not automatically save.  Other mechanisms, for example Polymer's [app storage](https://www.webcomponents.org/element/PolymerElements/app-storage) need to be used for this purpose.


## Debouncing [TODO]

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
