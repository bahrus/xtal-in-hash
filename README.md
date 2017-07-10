# \<xtal-in-hash\>

Allow location.hash to provide an input channel for web components.  The plan is to support any common type of web component (SkateJS, x-tag, etc), but the initial focus is on Polymer components.

location.hash can serve as a useful way to pass properties to components.  It has these advantages:

*  The properties can persist on refreshing the browser.
*  The properties can be modified without touching the code -- a convenient way to test or configure quickly.
*  Web components can be viewed as a new and greatly improved form of iframes.  However, there are some settings where an iframe is required, or more precisely, a way to expose a web component as a standalone url, that can be integrated into other applications, even non web based application (e.g. an iOS WebView component).  Another scenario where iframes may still needed is for those web components that aren't compatible with being inside shadow DOM.

xtal-in-hash assumes it is a container of (Polymer for now) web components sitting inside the container's light children:

```html
<xtal-in-hash bind children to location hash where-uid="myUniqueID">
    <some-component></some-component>
    ...
    <some-other-component></some-other-component>
<xtal-in-hash>
```

*xtal-in-hash* searches the location-hash for a string inside these markers: 
 *  Left hand side marker: myUniqueID>some-component```json{
 *  Right hand side marker: }``` 

This component parses the string inside the markers above (but including the opening and closing brace from the markers) using JSON.parse.  It then applies these properties to the appropriate child component(s). 

Our next level of complexity is if we want the binding to work the other way -- if in the course of the application life cycle, we want those changes to reflect back to location.hash, then we modify the markup to look like this:

```html
<xtal-in-hash bind children to-from location hash where-uid="myUniqueID">
    <some-component></some-component>
    ...
    <some-other-component></some-other-component>
<xtal-in-hash>
```
 Now the *xtal-in-hash* component will set up a listener for each of the top level properties, with the -change postfix that Polymer uses, *if* the property is marked as a Polymer "notify" type property.  In the event that one or more of these properties changes, it will apply them back to the location.href, in a kind of two-way binding mechanism.

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
