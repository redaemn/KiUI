[![Build Status](https://travis-ci.org/redaemn/KiUI.png?branch=master)](https://travis-ci.org/redaemn/KiUI)
[![devDependency Status](https://david-dm.org/redaemn/KiUI/dev-status.png)](https://david-dm.org/redaemn/KiUI#info=devDependencies)

# KiUI
#### Widgets, validators, bindings and other useful features for your everyday job with [Kendo UI Web](http://www.kendoui.com/web.aspx)

***

## What is it

**KiUI** is a companion framework for Telerik's
[Kendo UI Web](http://www.kendoui.com/web.aspx). It adds widgets, validators,
bindings and other higher-level features useful for your everyday job with
Kendo... so that you don't have to develop them yourself!! :)

**KiUI** comes to you from the experience of a professional that works day after
day with Kendo framework to build customized widgets and features for web
applications and sites.

**KiUI** is currently tested on the latest version of **Chrome** and **Firefox**
using **Kendo UI Web** v2013.2.716.

## How to use it

To start working with **KiUI** begin
[downloading the latest compressed version](https://github.com/redaemn/KiUI/tree/gh-pages),
the `zip` package contains `.css` and .`js` files both in minified and
un-minified version.

After you included the Kendo UI Web library and one of its color themes, you
must include the **KiUI** library using the following code:

```html
<link href="kiui-0.0.1.min.css" rel="stylesheet">
<script src="kiui-0.0.1.min.js"></script>
```

Now you're good to go!! Explore all the available **KiUI** features described in
the [official site](http://redaemn.github.io/KiUI/) and... happy coding!! :)

*Note to self:* I should create a **NuGet** bundle!!

## How to help

If you have an idea for a new feature that you think would be a perfect addition
to **KiUI**, it would be *AWESOME* if you could tell me about it! Just open an
[issue](https://github.com/redaemn/KiUI/issues) or, if you're more a code guy,
submit a [pull request](https://github.com/redaemn/KiUI/pulls).

### Prepare the environment

* Install [Node.js](http://nodejs.org/) and NPM (should come with it)
* Install global dependencies: `npm install -g grunt-cli`
* Install local dev dependencies: `npm install` while current directory is KiUI
repo

### Build

The project uses [Grunt](http://gruntjs.com/) as its build system.

To build the whole project execute `grunt`, this will run `jshint` on all
sources, `karma` to check that the tests pass, `concat`, `uglify` and
`cssmin` on all JS and CSS files and then `compress` to create a convenient
package.

### TDD

This project uses [Jasmine](http://pivotal.github.io/jasmine/) as test framework
and [Karma](http://karma-runner.github.io) as test runner.

To run all project's tests execute `grunt karma:singleRun`.

If you wanto to run the tests while developing execute `grunt karma:watch`.

You can also generate code coverage statistics executing `grunt karma:coverage`,
they will be placed inside the `coverage` subdirectory.

## License

GNU General Public License (GPL) version 3

Copyright &copy; 2013  Gabriele Rabbiosi https://plus.google.com/+GabrieleRabbiosi/

<https://github.com/redaemn/KiUI/blob/master/LICENSE>
