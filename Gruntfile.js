module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'scripts/*.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        browserify: {
            init: {
                src: 'scripts/*.js',
                dest: 'dist/script.js'
            },
            options: {
                transform: [
                    ['babelify', {
                        "global": true,
                        presets: [
                            ["@babel/preset-es2015"]
                        ]
                    }]
            ],
            browserifyOptions: {
                debug: true,
                    sourceType: 'unambiguous'
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-browserify');

    // Default task(s).
    grunt.registerTask('default', ['concat','browserify']);

};