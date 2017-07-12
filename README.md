# \<xtal-in-hash\>

There used to be only one viable way of mashing web content together from different content providers, even providers who adhere to different technology stacks -- the iFrame.  [iGoogle](https://en.wikipedia.org/wiki/IGoogle) famously popularized this technique.  Although iGoogle is no longer, and the use of the iframe has [waned some in recent years](https://trends.builtwith.com/docinfo/IFrame), it is still used extensively in large enterprises, where adopting a single technology stack for everything is not practical.

The advent of web components holds the promise (and indeed a growing track record) to solve many of the problems iFrames were meant to solve, but much more effectively.  Many, but not all.

Consider AMP, the tightly controlled HTML specification that relies heavily on web components, that allows various third parties to share content / reusable functionality.   Even in this modern setting, iFrames still plays a vital role, enabling content providers a great deal more freedom when it comes to advertising and other specialized content not supported by the tight AMP restrictions.


Allow location.hash to provide an input channel for web components.  The plan is to support any common type of web component (SkateJS, x-tag, etc), but the initial focus is on Polymer components.

location.hash can serve as a useful way to pass properties to components.  It has these advantages:

*  The properties can persist on refreshing the browser.
*  The properties can be modified without touching the code -- a convenient way to test or configure quickly.
*  Web components can be viewed as a new and greatly improved form of iframes.  However, there are some settings where an iframe is required, or more precisely, a way to expose a web component as a standalone url, that can be integrated into other applications, even non web based application (e.g. an iOS WebView component).  Another scenario where iframes may still needed is for those web components that aren't compatible with being inside shadow DOM.

xtal-in-hash assumes it is a container of (Polymer for now) web components sitting inside the container's light children.  The following markup will allow the container, *xtal-in-hash*, to set the properties of the children,such as *some-component* based on values found in the window.location.hash string.  It will continue to modify these child properties if the window.location.hash changes in a way recognized by the container.

```html
<xtal-in-hash set child-props from location-hash where-uid="myUniqueID">
    <some-component></some-component>
    ...
    <some-other-component></some-other-component>
<xtal-in-hash>
```

Note that the boolean attributes in the markup are not required to be in this exact order.  The order was chosen in this way only to make it more readable.

*xtal-in-hash* searches for, and listens to, the value of wondow.location.hash for a string inside these markers (where "myUniqueID" and "some-component" are used based on the example markup above):

 *  Left hand side marker: myUniqueID>some-component```json
 *  Right hand side marker: ``` 

This component parses the string inside the markers above using JSON.parse.  It then applies these properties to the appropriate child component(s). 

[To be implemented]:

Our next level of complexity is if we additionally want the binding to work the other way -- if, in the course of the application life cycle, we want those changes to reflect back to location.hash, then we modify the markup to look like this:

```html
<xtal-in-hash bind child-props to-from location-hash where-uid="myUniqueID">
    <some-component></some-component>
    ...
    <some-other-component></some-other-component>
<xtal-in-hash>
```
 Now the *xtal-in-hash* component will, in addition, set up a listener for each of the top level properties, with the -change postfix that Polymer uses, *if* the property is marked as a Polymer "notify" type property.  In the event that one or more of these properties changes, it will apply them back to the location.href, in a kind of two-way binding mechanism.

[To be implemented]:

If attribute "show-usage" is present, and if no uid is found in the location.hash matching the uid attribute of the xtal-in-hash tag, and if the component it wraps happens to be a Polymer component (for now, maybe SkateJS too), then a "Usage" form appears, helping you to build the location.hash.  The usage form is built based on inspecting the constructor for the polymer static get properties.

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
