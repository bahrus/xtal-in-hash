[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-in-hash)

# \<xtal-in-hash\>


Allow location.hash to provide an input channel for web components.  

Because of the nature of this component, the best demo link to use is [this](http://rawgit.com/bahrus/xtal/master/bower_components/xtal-in-hash/demo/index.html).

location.hash can serve as a useful way to pass properties to components.  It has these advantages:

*  The properties can persist on refreshing the browser.
*  The properties can be modified without touching the code -- a convenient way to test or configure quickly.
*  Web components can be viewed as a new and greatly improved form of iframes.  However, there are some settings where an iframe is required, or more precisely, a way to expose a web component as a standalone url, that can be integrated into other applications, even non web based application (e.g. an iOS WebView component).  Another scenario where iframes may still be needed is for those web components that aren't compatible with being inside shadow DOM, such as JQuery plugins.

xtal-in-hash searches it's children for any dom elements with the attribute *hash-tag*, and passes in the properties from above.  It will continue to modify these children as the window.location.hash changes.

```html
<xtal-in-hash set child-props from location-hash>
    <some-component hash-tag></some-component>
    ...
    <some-other-component hash-tag></some-other-component>
<xtal-in-hash>
```

In the case of a component being inside a nested iFrame, one can specify to use window.top for the location hash (assuming no cross domain url's in that hierarchy).  One specifies to use window.top as follows:

```html
<xtal-in-hash set child-props from top-location-hash>
    <some-component hash-tag></some-component>
    ...
    <some-other-component hash-tag></some-other-component>
<xtal-in-hash>
```

*xtal-in-hash* searches for, and listens to, the value of wondow.location.hash for a string inside these markers:

 *  Left hand side marker: xtal-in-hash:json```
 *  Right hand side marker: ``` 

This component parses the string inside the markers above using JSON.parse.  It then applies these properties to the child component(s) with attribute hash-tag. 

Our next level of complexity is if we additionally want the binding to work the other way -- if, in the course of the application life cycle, we want those changes to reflect back to location.hash, then we modify the markup to look like this:

```html
<xtal-in-hash bind child-props to-from location-hash>
    <some-component hash-tag></some-component>
    ...
    <some-other-component hash-tag></some-other-component>
<xtal-in-hash>
```
 Now the *xtal-in-hash* component will, in addition, set up a listener for each of the top level properties, with the -change postfix that Polymer uses, *if* the property is marked as a Polymer "notify" type property.  In the event that one or more of these properties changes, it will apply them back to the location.href, in a kind of two-way binding mechanism.



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
