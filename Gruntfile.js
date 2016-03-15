module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        files: {
          'jan/build/mainformsstyles.css': 'jan/styles/mainformsstyles.scss',
          'martin/homepage/build/homepage.css':'martin/homepage/styles/mainhomepagestyles.scss'
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      forms: {
        files:[
          {
            src: ['jan/js/**/*.js', '!jan/js/base/load.js', 'jan/js/base/load.js'],
              dest:'jan/build/forms.js'
           },
          {
            src: ['martin/homepage/js/**/*.js'],
            dest: 'martin/homepage/build/homepage.js'}
        ]
      }
    },
    webfont: {
      icons: {
        src: 'global/content/svg/*.svg',
        dest: 'global/styles/fonts/',
        destCss: 'global/styles/',
        options: {
            font:'font-icon',
             stylesheet: 'scss',
            templateOptions: {
            baseClass: 'icon',
            classPrefix: 'icon-',
            mixinPrefix: 'icon-'
          }
        }

      }
    },
    //mustache: {
    //  files : {
    //    src: 'src/global/templates/',
    //    dest: 'src/global/js/templates.js',
    //    options: {
    //      prefix: 'wm.__.templates = ',
    //      postfix: ";",
    //      verbose:true,
    //      livereload: true
    //
    //    }
    //  }
    //},

    watch: {
      css: {
        files: [
          'jan/styles/**/*.scss',
          'martin/homepage/styles/**/*.scss',
          'global/styles/**/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      //mustache:{
      //  files: ['**/*.mustache'],
      //  tasks: ['mustache'],
      //  options: {
      //
      //    livereload: true
      //  }
      //
      //},
      js: {
        files: ['jan/js/**/*.js','!global/js/templates.js','martin/homepage/js/**/*.js'],
        tasks: ['concat'/*,'uglify'*/],
        options: {
          livereload: true
        }
      }
    }



  });
  grunt.loadNpmTasks('grunt-webfont');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mustache');


  grunt.registerTask('default',['watch']);
  grunt.registerTask('dist', ['uglify', 'cssmin']);
  grunt.registerTask('font-build', ['webfont']);




};