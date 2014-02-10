module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    kendoVersion: '2013.3.1119',
    pkg: grunt.file.readJSON('package.json'),
    filename: 'kiui',
    
    commons: {
      banner: '/*\n' +
              ' * <%= pkg.name %> v<%= pkg.version %> [https://github.com/redaemn/KiUI]\n' +
              ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
              ' *\n' +
              ' * This software is licensed under The MIT License (MIT)\n' +
              ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> [<%= pkg.author.url %>]\n' +
              ' * [https://github.com/redaemn/KiUI/blob/master/LICENSE]\n' +
              ' */\n\n'
    },
    
    concat: {
      dist: {
        options: {
          banner: '<%= commons.banner %>'
        },
        files: {
          'dist/<%= filename %>-<%= pkg.version %>.js': ['src/core.js', 'src/**/*.js'],
          'dist/<%= filename %>-<%= pkg.version %>.css': ['src/**/*.css']
        }
      },
      demoSite_css: {
        files: {
          'dist/resources/main.css.tmp': ['misc/demoSite/resources/main.css','misc/demoSite/resources/rainbow-github.css']
        }
      },
      demoSite_js: {
        files: {
          'dist/resources/main.min.js': ['dist/resources/main.min.js.tmp', 'misc/demoSite/resources/rainbow-custom.min.js']
        }
      }
    },
    
    uglify: {
      options: {
        report: 'min'
      },
      dist: {
        options: {
          banner: '<%= commons.banner %>'
        },
        files: {
          'dist/<%= filename %>-<%= pkg.version %>.min.js': ['dist/<%= filename %>-<%= pkg.version %>.js']
        }
      },
      demoSite: {
        files: {
          'dist/resources/main.min.js.tmp': ['misc/demoSite/resources/main.js']
        }
      }
    },
    
    cssmin: {
      options: {
        report: 'min'
      },
      dist: {
        options: {
          banner: '<%= commons.banner %>'
        },
        files: {
          'dist/<%= filename %>-<%= pkg.version %>.min.css': ['dist/<%= filename %>-<%= pkg.version %>.css']
        }
      },
      demoSite: {
        files: {
          'dist/resources/main.min.css': ['dist/resources/main.css.tmp']
        }
      }
    },
    
    jshint: {
      chore: ['package.json', 'Gruntfile.js', 'karma.conf.js'],
      dist: ['src/**/*.js', 'test/**/*.js'],
      demoSite: ['demo/**/*.js']
    },
    
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      travis: {
        singleRun: true,
        browsers: ['PhantomJS']
      },
      singleRun: {
        singleRun: true
      },
      coverage: {
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
        autoWatch: true
      }
    },
    
    copy: {
      demoSiteIndex: {
        options: {
          processContent: grunt.template.process
        },
        files: [{
          expand: true,
          cwd: "misc/demoSite",
          src: ["index.html", "sitemap.xml"],
          dest: "dist/"
        }]
      }
      // a configuration for every existing feature will be added here by
      // the "demoSite" task!!
    },
    
    demoSite: {
      // will be filled by the 'demoSite' task
      features: {},
      newFeatures: {
        bindings: ['loader'],
        utilities: ['notifier']
      },
      comingSoonFeatures: {
        
      },
      SEO: {
        bindings: {
          'bool-value': {
            title: "KiUI Bool Value Binding: boolean value binding for radio buttons in Kendo UI Web",
            description: "KiUI Bool Value is a Kendo UI Web custom binding that allows you to bind a radio buttons control with a boolean variable in the view model."
          },
          loader: {
            title: "KiUI Loader Binding: automatically show or hide a loader on a DOM element in Kendo UI Web",
            description: "KiUI Loader is a Kendo UI Web custom binding that allows you to bind a loader overlay on a DOM element with a boolean variable in the view model."
          }
        },
        utilities: {
          notifier: {
            title: "KiUI Notifier Utility: notifications made easy in Kendo UI Web",
            description: "KiUI Notifier is an extension to Kendo UI Web that allows you to easily send notifications to the user. It is also highly customizable."
          }
        },
        validators: {
          date: {
            title: "KiUI Date Validator: validate date input fields in Kendo UI Web",
            description: "KiUI Date is a Kendo UI Web custom validator that allows you to validate any input element that contains a date in any format and culture."
          },
          'radio-required': {
            title: "KiUI Radio Required Validator: enables required validator for radio buttons in Kendo UI Web",
            description: "KiUI Radio Required is an extension to the standard Kendo UI Web required validator that makes it possible to use it on radio buttons too."
          }
        },
        widgets: {
          'popup-menu': {
            title: "KiUI Popup Menu Widget: attach a drop-down menu to any page element in Kendo UI Web",
            description: "KiUI Popup Menu is a Kendo UI Web custom widget that allows you to create popup or drop-down menus. It is also highly customizable."
          },
          rating: {
            title: "KiUI Rating Widget: rate anything with stars in Kendo UI Web",
            description: "KiUI Rating is a Kendo UI Web custom widget that allows you to create a star rating element for any page content. It is also highly customizable."
          }
        }
      }
    },
    
    watch: {
      demoSite: {
        files: ['demo/**/*', 'misc/demoSite/**/*'],
        tasks: ['demoSite'],
        options: {
          interrupt: true
        }
      }
    },
    
    compress: {
      dist: {
        options: {
          archive: 'dist/<%= filename %>-<%= pkg.version %>.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/',
            flatten: true,
            src: ['<%= filename %>-<%= pkg.version %>.*js', '<%= filename %>-<%= pkg.version %>.*css'], 
            dest: '<%= filename %>-<%= pkg.version %>/',
            filter: 'isFile'
          }
        ]
      }
    },
    
    clean: {
      demoSite: ['dist/**/*', '!dist/kiui*'],
      demoSite_tmp: ['dist/resources/*.tmp'],
      dist: ['dist/*.css', 'dist/*.js', 'dist/*.zip']
    }
    
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');

  /****************************************
   * Default task
   ****************************************/

  grunt.registerTask('default',
    'Lint JS files, run tests and then build', [
      'clean:dist',
      'jshint:chore',
      'jshint:dist',
      'karma:singleRun',
      'concat:dist',
      'uglify:dist',
      'cssmin:dist',
      'compress:dist'
    ]);
  
  /****************************************
   * Build Task
   ****************************************/
   
   grunt.registerTask('build',
    'Lint JS files, concatenate and minify JS and CSS files and create a zip package', [
      'clean:dist',
      'jshint:chore',
      'jshint:dist',
      'concat:dist',
      'uglify:dist',
      'cssmin:dist',
      'compress:dist'
    ]);

  /****************************************
   * Demo Site Task
   ****************************************/

  grunt.registerTask('demoSite', 'Build the demo site, based on the current sources', function() {
    var features = {},
      newFeatures = grunt.config('demoSite.newFeatures'),
      comingSoonFeatures = grunt.config('demoSite.comingSoonFeatures'),
      groupsCount = 0,
      featuresCount = 0;

    function camelCaseToSeparator(text, separator) {
      if (separator === undefined) {
        separator = ' ';
      }
      return text.replace(/[A-Z]/g, function(match) {
        return(separator + match.toLowerCase());
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
        groupDisplayName = ucwords(camelCaseToSeparator(group)),
        feature = camelCaseToSeparator(matches[2], '-'),
        featureDisplayName = ucwords(camelCaseToSeparator(matches[2])),
        fileContent = grunt.file.read("demo/" + file),
        groupDescriptor = {
          displayName: groupDisplayName,
          features: {},
          hasNewFeatures: false,
          hasComingSoonFeatures: false
        },
        featureDescriptor = {
          displayName: featureDisplayName,
          html: "",
          js: "",
          readme: "",
          isNew: newFeatures[group] && newFeatures[group].indexOf(feature) > -1,
          isComingSoon: comingSoonFeatures[group] && comingSoonFeatures[group].indexOf(feature) > -1
        };

      if (!features[group]) {
        features[group] = groupDescriptor;
        groupsCount++;
      }
      else {
        groupDescriptor = features[group];
      }

      if (!groupDescriptor.features[feature]) {
        groupDescriptor.features[feature] = featureDescriptor;
        featuresCount++;
      }
      else {
        featureDescriptor = groupDescriptor.features[feature];
      }
      
      if (featureDescriptor.isNew) {
        groupDescriptor.hasNewFeatures = true;
      }
      if (featureDescriptor.isComingSoon) {
        groupDescriptor.hasComingSoonFeatures = true;
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

    grunt.log.writeln(groupsCount + " groups and " + featuresCount + " features correctly processed!");
    
    Object.keys(features).forEach(function(groupId) {
        var groupDescriptor = features[groupId];
        //grunt.config('demoSite.currentGroup', groupDescriptor);
        
        Object.keys(groupDescriptor.features).forEach(function(featureId, idx) {
            var feature = groupDescriptor.features[featureId];
            var featureUniqueId = groupId + "-" + featureId;
            
            grunt.config('copy.' + featureUniqueId, {
              options: {
                processContent: grunt.template.process
              },
              files: [{
                expand: true,
                cwd: "misc/demoSite",
                src: ["feature.html"],
                rename: function () {
                  return 'dist/' + groupId + '/' + featureId + ".html";
                }
              }],
              groupId: groupId,
              featureId: featureId,
              uniqueId: featureUniqueId
            });
        });
    });
    
    grunt.task.run([
      'clean:demoSite',
      'jshint:demoSite',
      'uglify:demoSite',
      'concat:demoSite_js',
      'concat:demoSite_css',
      'cssmin:demoSite',
      'clean:demoSite_tmp',
      'copy'
    ]);
  });
};
