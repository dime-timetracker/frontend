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
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass']);
};
