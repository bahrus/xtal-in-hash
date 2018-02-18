[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-in-hash)

# \<xtal-in-hash\>


Allow location.hash to provide an input channel for web components.  

Because of the nature of this component, the best demo link to use is [this](http://rawgit.com/bahrus/xtal/master/bower_components/xtal-in-hash/demo/index.html).

Most modern client-side routing has ceased using location.hash - [instead utilizing the history api](http://krasimirtsonev.com/blog/article/deep-dive-into-client-side-routing-navigo-pushstate-hash).  This opens up location.hash as a separate string we can play with, for purposes other than what routing is used for -- primarily, loading views.  One such purpose that location.hash can serve as a useful way to pass properties to components.  Why would we want to this? 

* Web components can be viewed as a new and greatly improved form of iframes.  However, there are some settings where an iframe is required, or more precisely, a way to expose a web component as a standalone url, that can be integrated into other applications, even non web based application (e.g. an iOS WebView component).  Another scenario where iframes may still be needed is for those web components that aren't compatible with being inside shadow DOM, such as JQuery plugins.
*  As with routing, the properties can persist on refreshing the browser, and can be shared / sent via an email or the [web share](https://developers.google.com/web/updates/2016/09/navigator-share), for example.  But the state we want to persist can have the full structure of a JSON object, and not be limited to a url path. 
*  The properties can be modified without touching the code -- a convenient way to test or configure quickly.

The last point may fairly raise some alarms. This component, and the developer, need to be cognizant of how this feature could theoretically be abused, but every effort is made not to allow any abuse.

*xtal-in-hash* searches for, and listens to, the value of wondow.location.hash for a string inside these markers:

 *  Left hand side marker: xtal-in-hash:json```
 *  Right hand side marker: ``` 

This component parses the string inside the markers above using JSON.parse.  It then merges this object into the child component(s).  The root nodes/properties of the json object are treated as separate properties to be set on the In order to prevent abuse

1)  First, only elements containing the attribute  hash-tag are affected by xtal-in-hash.  So the developer needs to "opt-in" fairly explicitly.
2)  It will not set properties with name nodeValue, textContent, innerHTML, or innerText.  
3)  HTML tags are also all stripped from any string property contained within the JSON parse.

xtal-in-hash searches its children for any DOM elements with the attribute *hash-tag*, and passes in the properties from above.  It will continue to modify these children as the window.location.hash changes.

The syntax for this one way binding is shown below.

```html
<xtal-in-hash set child-props from location-hash>
    <some-component hash-tag></some-component>
    ...
    <some-other-component hash-tag></some-other-component>
<xtal-in-hash>
```

If a property name ends with a $, then the xtal-in-hash will consider 

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
 Now the *xtal-in-hash* component will, in addition, set up a listener for each of the top level properties, with the -change postfix that Polymer uses, *if* the property is marked as a Polymer "notify" type property.  In the event that one or more of these properties changes, it will apply them back to the location.href, in a kind of two-way binding mechanism.

This could be used as a rudimentary global state management system.  The advantage of this solution is that the global state won't be lost on refreshing, and can be shared to others.  However, the performnace would be quite abysmal if used to manage complex, large objects.

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
