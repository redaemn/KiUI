
// base path, that will be used to resolve files and exclude
basePath = '.';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'lib/jquery.min.js',
  'lib/kendo.web.min.js',
  'lib/kendo.culture.it-IT.min.js',
  'src/core.js',
  'src/**/*.js',
  'test/**/*.js'
];

// list of files to exclude
exclude = [

];

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari
// - PhantomJS
browsers = process.env.IP ? [] : [
  'Chrome'
];

// test results reporter to use
// possible values: dots || progress
reporters = ['progress'];

hostname = process.env.IP ? process.env.IP : 'localhost';

// web server port
port = process.env.IP ? process.env.PORT : 9018;

// cli runner port
runnerPort = process.env.IP ? 0 : 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;

