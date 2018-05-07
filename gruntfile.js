module.exports = function(grunt) {
	grunt.initConfig({
		connect: {
			server: {
				options: {
					port: 4242,
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
			dist: {
				src: ['js/application.js'],
				dest: 'dist/application.js'
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
					   }
					 ]
				}
			},
			prod: {
				files: {
					'index.html': 'index.tpl.html'
				},
				options: {
					replacements: [
					   {
						pattern: '<script src="APPLICATION">',
						replacement: '<script src="js/application.min.js">'
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
	
	grunt.registerTask('build', ['cssmin','concat','ngAnnotate','uglify','string-replace:'+target]);
	grunt.registerTask('server', ['connect']);
	grunt.registerTask('test', ['build','karma']);
}