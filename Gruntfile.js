module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        files: {
          'src/forms/build/mainformsstyles.css': 'src/forms/styles/mainformsstyles.scss',
          'src/homepage/build/homepage.css':'src/homepage/styles/mainhomepagestyles.scss'
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
            src: ['src/forms/js/**/*.js', '!src/forms/js/base/load.js', 'src/forms/js/base/load.js'],
              dest:'src/forms/build/forms.js'
           },
          {
            src: ['src/homepage/js/**/*.js'],
            dest: 'src/homepage/build/homepage.js'}
        ]
      }
    },
    webfont: {
      icons: {
        src: 'src/global/content/svg/*.svg',
        dest: 'src/global/styles/fonts/',
        destCss: 'src/global/styles/',
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
    mustache: {
      files : {
        src: 'src/global/templates/',
        dest: 'src/global/js/templates.js',
        options: {
          prefix: 'wm.__.templates = ',
          postfix: ";",
          verbose:true,
          livereload: true

        }
      }
    },

    watch: {
      css: {
        files: [
          'src/forms/styles/**/*.scss',
          'src/homepage/styles/**/*.scss',
          'src/global/styles/**/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      mustache:{
        files: ['**/*.mustache'],
        tasks: ['mustache'],
        options: {

          livereload: true
        }

      },
      other: {
        files: ['src/forms/js/**/*.js','!src/global/js/templates.js','src/homepage/js/**/*.js'],
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