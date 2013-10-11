module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    kendoVersion: '2013.2.716',
    pkg: grunt.file.readJSON('package.json'),
    filename: 'kiui',
    
    commons: {
      banner: '/*\n' +
              ' * <%= pkg.name %> v<%= pkg.version %> (https://github.com/redaemn/KiUI)\n' +
              ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
              ' * Author: <%= pkg.author %>\n' +
              ' *\n' +
              ' * This software is licensed under the GNU General Public License (GPL) version 3\n' +
              ' * http://www.gnu.org/copyleft/gpl.html\n' +
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
        src: ['dist/<%= filename %>-<%= pkg.version %>.js'],
        dest:'dist/<%= filename %>-<%= pkg.version %>.min.js'
      },
      demoSite: {
        src: ['misc/demoSite/resources/main.js'],
        dest:'dist/resources/main.min.js'
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
          'dist/resources/main.min.css': ['misc/demoSite/resources/main.css']
        }
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
      demoSiteIndex: {
        options: {
          processContent: grunt.template.process
        },
        files: [{
          expand: true,
          cwd: "misc/demoSite",
          src: ["resources/**", "!resources/main.*", "index.html"],
          dest: "dist/"
        }]
      }
      //
    },
    
    demoSite: {
      // will be filled by the 'demoSite' task
      features: {},
      newFeatures: {
        widgets: ['popupMenu']
      },
      comingSoonFeatures: {
        
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

  /****************************************
   * Default task
   ****************************************/

  grunt.registerTask('default',
    'Lint JS files, run tests and then build',
    ['jshint:dist', 'karma:singleRun', 'concat:dist', 'uglify:dist', 'cssmin:dist', 'compress:dist']
  );
  
  /****************************************
   * Build Task
   ****************************************/
   
   grunt.registerTask('build',
    'Lint JS files, concatenate and then minify JS and CSS files',
    ['jshint:dist', 'concat:dist', 'uglify:dist', 'cssmin:dist', 'compress:dist']
   );

  /****************************************
   * Demo Site Task
   ****************************************/

  grunt.registerTask('demoSite', 'Build the demo site, based on the current sources', function() {
    var features = {},
      newFeatures = grunt.config('demoSite.newFeatures'),
      comingSoonFeatures = grunt.config('demoSite.comingSoonFeatures'),
      groupsCount = 0,
      featuresCount = 0;

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
            var featureUniqueId = groupId + "_" + featureId;
            
            grunt.config('copy.' + featureUniqueId, {
              options: {
                processContent: grunt.template.process
              },
              files: [{
                expand: true,
                cwd: "misc/demoSite",
                src: ["feature.html"],
                rename: function () {
                  return 'dist/pages/' + featureUniqueId + ".html";
                }
              }],
              groupId: groupId,
              featureId: featureId,
              uniqueId: featureUniqueId
            });
        });
    });
    
    grunt.task.run(['jshint:demoSite', 'uglify:demoSite', 'cssmin:demoSite', 'copy']);
  });
};
