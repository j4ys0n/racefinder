'use strict';
var LIVERELOAD_PORT = 35733;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

var gateway = require('gateway');

module.exports = function( grunt ){
    // load all grunt tasks
    require( 'load-grunt-tasks' )( grunt );

    grunt.loadNpmTasks( 'grunt-php2html' );
    grunt.loadNpmTasks( 'grunt-sass' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    'public/Includes/css/styles.css' : 'sass/styles.scss'
                }
            }
        },
        watch: {
            sass: {
                files: ['sass/**/*.scss'],
                tasks: ['sass'],
                /*options: {
                    livereload: {
                        port: LIVERELOAD_PORT
                    }
                }*/
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'public/*.html',
                    'public/*.php',
                    'public/Includes/styles/{,*/}*.css'
                ]
            }
        },
        connect: {
            options: {
                port: 8001,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function( connect ){
                        return[
                            lrSnippet,
                            gateway( __dirname + '/public',
                            { '.php': 'php-cgi' } ),
                            mountFolder(connect, '.tmp'),
                            mountFolder( connect, 'public' )
                        ]
                    }
                }
            }
        }
    });

    grunt.registerTask( 'default', ['sass'] );
    grunt.registerTask( 'server', function( target ){
        grunt.task.run([
            'connect:livereload',
            'watch'
            ]);
    });
}
