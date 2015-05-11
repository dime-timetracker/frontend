module.exports = function (grunt) {
  grunt.initConfig({
    // Watch task config
    watch: {
      sass: {
        files: 'sass/*.scss',
        tasks: ['sass']
      }
    },

    // SASS task config
    sass: {
      dev: {
        files: {
          // destination         // source file
          'public/css/dime.css' : 'sass/dime.scss'
        }
      }
    },

    copy: {
      main: {
        expand: true,
        cwd: 'public/',
        dest: 'dist/',
        src: [
          'css/fonts/**',
          'css/dime.css',
          'img/**',
          'index.html'
        ]
      }
    },

    useminPrepare: {
      html: 'public/index.html',
      options: {
        flow: {
          steps: {
            js: ['concat']
          },
          post: {}
        }
      }
    },

    usemin: {
      html: 'dist/index.html'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-usemin');
  
  grunt.registerTask('default', ['sass']);
  grunt.registerTask('build', [ 'copy', 'useminPrepare', 'concat:generated', 'usemin' ]);

};
