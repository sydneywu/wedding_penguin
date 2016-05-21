module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // configuration goes here

        watch: {
            scripts: {
                files: ['sass/*.scss', 'js/*.js'],
                tasks: ['compass'],
                options: {
                    spawn: false
                },
            }
        }

    });

    // some task setup will go here
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['compass']);


};