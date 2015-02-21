module.exports = function ( grunt ) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	var taskConfig = {
		jshint: {
			src: ['src/**/*.js'],
			gruntfile: ['Gruntfile.js'],
			options: {
				curly:  true,
 				immed:  true,
				newcap: true,
				noarg:  true,
				sub:    true,
				boss:   true,
				eqnull: true,
				node:   true,
				undef:  true,
				globals: {
    					_:       false,
    					jQuery:  false,
    					angular: false,
    					moment:  false,
    					console: false,
    					$:       false,
					io:      false
  				}
 			}
		},

		concat: {
    			dist: {
      				src: ['src/**/*.js'],
      				dest: 'dist/js/built.js'
    			}
  		},

		uglify: {
      			build: {
        			files: {
          				'dist/js/chatter.min.js': ['dist/js/built.js']
        			}
      			}
    		}

	};
	grunt.initConfig(taskConfig);
	grunt.task.registerTask('build', ['jshint', 'concat', 'uglify']);
		

};
