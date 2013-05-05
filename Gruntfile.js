module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    kendoVersion: '2013.1.319',
    pkg: grunt.file.readJSON('package.json'),
    filename: 'kiui',
    commons: {
      banner: '/*\n' +
              ' * <%= pkg.name %> v<%= pkg.version %> (https://github.com/redaemn/KiUI)\n' +
              ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
              ' * Author: <%= pkg.author %>\n' +
              ' */\n'
    },
    concat: {
      dist: {
        options: {
          banner: '<%= commons.banner %>'
        },
        src: ['src/**/*.js'],
        dest: 'dist/<%= filename %>-<%= pkg.version %>.js'
      }
    },
    uglify: {
      dist:{
        options: {
          banner: '<%= commons.banner %>'
        },
        src:['dist/<%= filename %>-<%= pkg.version %>.js'],
        dest:'dist/<%= filename %>-<%= pkg.version %>.min.js'
      }
    },
    jshint: {
      dist: ['Gruntfile.js','src/**/*.js', 'test/**/*.js'],
      demoSite: ['demo/**/*.js']
    },
    karma: {
      singleRun: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      coverage: {
        configFile: 'karma.conf.js',
        singleRun: true,
        preprocessors: {
          'src/**/*.js': 'coverage'
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
          type : 'html',
          dir : 'coverage/'
        }
      },
      watch: {
        configFile: 'karma.conf.js',
        autoWatch: true
      }
    },
    copy: {
      demoSite: {
        options: {
          processContent: grunt.template.process
        },
        files: [{
          expand: true,
          cwd: "misc/demoSite",
          src: ["*"],
          dest: "dist/"
        }]
      }
    },
    demoSite: {
      // will be filled by the 'demoSite' task
      features: {}
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-copy');

  /****************************************
   * Default task
   ****************************************/

  grunt.registerTask('default', ['jshint:dist', 'karma:singleRun', 'concat:dist', 'uglify:dist']);

  /****************************************
   * Demo Site Task
   ****************************************/

  grunt.registerTask('demoSite', 'Build the demo site, based on the current sources', function() {
    var features = {};

    function camelCaseToSpace(text) {
      return text.replace(/[A-Z]/g, function(match) {
        return(' ' + match);
      });
    }

    function ucwords(text) {
      return text.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
      });
    }

    function updateFeatures(file) {
                    // group/feature/fileName
      var matches = /^([^\/]+)\/([^\/]+)\//g.exec(file),
        group = matches[1],
        groupDisplayName = ucwords(camelCaseToSpace(group)),
        feature = matches[2],
        featureDisplayName = ucwords(camelCaseToSpace(feature)),
        fileContent = grunt.file.read("demo/" + file),
        groupDescriptor = {
          displayName: groupDisplayName,
          features: {}
        },
        featureDescriptor = {
          displayName: featureDisplayName,
          html: "",
          js: "",
          readme: ""
        };

      if (!features[group]) {
        features[group] = groupDescriptor;
      }
      else {
        groupDescriptor = features[group];
      }

      if (!groupDescriptor.features[feature]) {
        groupDescriptor.features[feature] = featureDescriptor;
      }
      else {
        featureDescriptor = groupDescriptor.features[feature];
      }

      if (/demo\.js$/.test(file)) {
        featureDescriptor.js = fileContent;
      }
      else if (/demo\.html$/.test(file)) {
        featureDescriptor.html = fileContent;
      }
      else if (/readme\.html$/.test(file)) {
        featureDescriptor.readme = fileContent;
      }
    }

    grunt.file.expand({
      filter: 'isFile',
      cwd: "demo/"
    }, '**/*').forEach(updateFeatures);

    grunt.config('demoSite.features', features);

    grunt.task.run(['jshint:demoSite', 'copy:demoSite']);

    grunt.log.writeln("Demo Site correctly created!");
  });
};
