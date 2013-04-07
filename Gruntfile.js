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
      files: ['Gruntfile.js','src/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};
