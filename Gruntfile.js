module.exports = function(grunt) {
  var globalConfig = {
    jan:{
      src:'jan/src',
      build:'jan/build'
    },
    global:{
      src:'global'
    }
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    globalConfig: globalConfig,

    sass: {
      dist: {
        files: {
          '<%= globalConfig.jan.build  %>/mainformsstyles.css': '<%= globalConfig.jan.src  %>/styles/mainformsstyles.scss',
          '<%= globalConfig.global.src  %>/styles/global.css' : '<%= globalConfig.global.src  %>/styles/global.scss',
          '<%= globalConfig.jan.build  %>/font-icon.css' : '<%= globalConfig.jan.src  %>/styles/_font-icon.scss'

        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      forms: {
        files:[
          {
            src: ['<%= globalConfig.jan.src  %>/js/**/*.js', '!<%= globalConfig.jan.src  %>/js/base/load.js', '<%= globalConfig.jan.src  %>/js/base/load.js'],
              dest:'<%= globalConfig.jan.build  %>/forms.js'
           }
        ]
      }
    },
    webfont: {
      icons: {
        src: '<%= globalConfig.jan.src  %>/content/svg/*.svg',
        dest: '<%= globalConfig.jan.src  %>/content/fonts/',
        destCss: '<%= globalConfig.jan.src  %>/styles/',
        options: {
            font:'font-icon',
             stylesheet: 'scss',
             relativeFontPath: '/jan/build/content/fonts',
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
        src: '<%= globalConfig.jan.src  %>/templates/',
        dest: '<%= globalConfig.jan.build %>/templates.js',
        options: {
          prefix: '_WMGlobal.templates = ',
          postfix: ";",
          verbose:true,
          livereload: true
    
        }
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: '<%= globalConfig.jan.src %>/',
        src: ['vendor/**/*','content/**/*'],
        dest: '<%= globalConfig.jan.build %>/',
      },
    },
    clean: ["<%= globalConfig.jan.build  %>"],


    watch: {
      css: {
        files: [
          '<%= globalConfig.jan.src  %>/styles/**/*.scss',
          '<%= globalConfig.global.src  %>/styles/**/*.scss'],
        tasks: ['build'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['<%= globalConfig.jan.src  %>/js/**/*.js'],
        tasks: ['build'],
        options: {
          livereload: true
        }
      },
      mustache:{
        files: ['<%= globalConfig.jan.src  %>/templates/**/*.mustache'],
        tasks: ['build'],
        options: {
          livereload: true
        }
      },
      other:{
        files: ['<%= globalConfig.jan.src  %>/content/*','<%= globalConfig.jan.src  %>/vendor/*'],
        tasks: ['build'],
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  

  grunt.registerTask('font-build', ['webfont']);
  grunt.registerTask('build', ['clean','sass','concat','mustache','copy']);
  grunt.registerTask('default',['build','watch']);





};