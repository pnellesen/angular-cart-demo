module.exports = function(grunt) {
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    //port: 4242,
                    port: 3232,
                    base: './',
                    keepalive: true
                }
            }
        },
        cssmin: {
            minify: {
                src: 'css/pats-custom.css',
                expand: true,
                ext: '.min.css'
            }
        },
        watch: {
            project: {
                files: ['css/pats-custom.css','js/application.js'],
                tasks: ['build'],
                options: {
                    livereload: {
                        port: 9000
                    }
                }
            }
        },
        concat: {
            options: {
                separator: ";",
            },
            distjs: {
                src: ['js/application.min.js'],
                dest: 'dist/js/application.min.js'
            },
            distcss: {
                src: ['css/pats-custom.min.css'],
                dest: 'dist/css/pats-custom.min.css'
            },
            distHtml: {
                src: ['index.html'],
                dest: 'dist/index.html'
            }            
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            myAttApp: {
                files: {
                    'js/application.annotated.js':['js/application.js']
                }
            }
        },
        uglify: {
            project: {
                files: {
                    'js/application.min.js':'js/application.annotated.js'
                }
            }
        },
        'string-replace': {
            dev: {
                files: {
                    'index.html': 'index.tpl.html'
                },
                options: {
                    replacements: [
                       {
                        pattern: '<script src="APPLICATION">',
                        replacement: '<script src="js/application.js">'
                       },
                       {
                        pattern: '<script src="LIVERELOAD">',
                        replacement: '<script src="//192.168.1.71:9000/livereload.js">'
                       }
                     ]
                }
            },
            prod: {
                files: {
                    'index.html':'index.tpl.html'
                },
                options: {
                    replacements: [
                       {
                        pattern: '<script src="APPLICATION">',
                        replacement: '<script src="js/application.min.js">'
                       },
                       {
                        pattern: '<script src="LIVERELOAD"></script>',
                        replacement: ''
                       }
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-string-replace');

    var target= grunt.option('target') || 'dev';

    grunt.registerTask('build', ['cssmin','ngAnnotate','uglify','string-replace:'+target,'concat']);
    grunt.registerTask('server', ['connect']);
    grunt.registerTask('test', ['build','karma']);
}