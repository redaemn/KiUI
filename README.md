# KiUI - Widgets, validators, bindings and other useful features for your everyday job with [Kendo UI Web](http://www.kendoui.com/web.aspx)

***

## Project objectives

**KiUI** is a companion framework for Telerik's [Kendo UI Web](http://www.kendoui.com/web.aspx). It adds widgets, validators, bindings and other higher-level features useful for your everyday job with Kendo... so that you don't have to develop them yourself!! :)

**KiUI** comes to you from the experience of a professional that works day after day with Kendo framework to build customized widgets and features for web applications and sites.

**KiUI** is currently tested on the latest version of **Chrome** and **Firefox**.

## Installation

To start working with **KiUI** begin [downloading the latest compressed version](https://github.com/redaemn/KiUI/tree/gh-pages), the `zip` package contains `.css` and .`js` files both in minified and un-minified version.

After you included the Kendo UI Web library and one of its color themes, you must include the **KiUI** library using the following code:

```html
<link href="kiui-0.0.1.min.css" rel="stylesheet">
<script src="kiui-0.0.1.min.js"></script>
```

Now you're good to go!! Explore all the available **KiUI** features described in the [official site](http://redaemn.github.io/KiUI/) and... happy coding!! :)

*Note to self:* I should create a **NuGet** bundle!!

## Contributing

### Prepare the environment

* Install [Node.js](http://nodejs.org/) and NPM (should come with it)
* Install global dependencies: `npm install -g grunt-cli karma`
* Install local dev dependencies: `npm install` while current directory is KiUI repo

### Build

The project uses [Grunt](http://gruntjs.com/) as its build system.

To build the whole project execute `grunt`, this will run `jshint:dist`, `karma:singleRun`, `concat:dist`, `uglify:dist` targets.

### TDD

This project uses [Jasmine](http://pivotal.github.io/jasmine/) as test framework and
[Karma](http://karma-runner.github.io) as test runner.

To run all project's tests execute `grunt karma:singleRun`

## License

This software is licensed under the [GNU General Public License (GPL) version 3](http://www.gnu.org/copyleft/gpl.html)
