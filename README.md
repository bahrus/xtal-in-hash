# \<xtal-in-hash\>

Allow location.hash to provide an input channel for web components.

location.hash can serve as a useful way to pass properties to components.  It has these advantages:

*  The properties can persist on refreshing the browser.
*  The properties can be modified without touching the code -- a convenient way to test quickly.
*  Web components can be viewed as a new and greatly improved form of iframes.  However, there are some settings where an iframe is required, or more precisely, a way to expose a web component as a standalone url, that can be integrated into other applications, even non web based application (e.g. an iOS WebView component).

xtal-in-hash needs to wrap a web component as light child.    

[To be implemented]:

If attribute "show-usage" is present, and if no guid is found in the location.hash matching the guid attribute of the xtal-in-hash tag, and if the component it wraps happens to be a Polymer component, then a "Usage" form appears, helping you to build the location.hash.  The usage form is built based on inspecting the constructor for the polymer static get properties.

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
