# grunt-jade-mod

> jade task for grant wich is modifiable.  

This grunt task uses 'grunt-contrib-jade' from its inside, so the detailed functionalities are depend on 'grunt-contrib-jade'.  

The purpose of this task is to modify or to add some functionality to 'jade' language, by using some 'modifier' libraries.
Currently, the only 'modifier' library usable with this task is 'jade-php'(not original version, sorry but use kurohara/jade-php instead).  

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install kurohara/grunt-jade-mod --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jade-mod');
```

Additionally, you have to install the 'modifiers'.  
The only usable modifier is 'kurohara/jade-php', do the following to install that:

```shell
npm install kurohara/jade-php --save-dev
```

## The "jade" task

### Overview
In your project's Gruntfile, add a section named `jade` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  jade: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options
Because this task calls 'jade' task defined by 'grunt-contrib-jade', all options except some additions are same as 'grunt-contrib-jade', so please refer to ['grunt-contrib-jade'](https://github.com/gruntjs/grunt-contrib-jade) for original options.

Here describes some additional options.
#### modifiers

```js
grunt.initConfig({
  jade: {
    your_target: {
      options: {
        modifiers: [ 'jade-php' ],
      }
      files: {
      }
  },
});
```

The 'modifiers' option is a series of modifier library names.  
They are 'applied' sequentially to 'jade' engine so that they modify or add their own functionalities.  

#### The options consumed by modifiers
Some options are modifier specific, because there are no place to control the modifiers except passing values as 'options', some modifiers may defines its own options as 'jade' options.  

```js
grunt.initConfig({
  jade: {
    your_target: {
      options: {
        modifiers: [ 'jade-php' ],
        usestrip: true,
      }
    }
  }
});
```

The 'usestrip' option is defined by 'jade-php'(not original, my modified version), see [this wiki](https://github.com/kurohara/jade-php/wiki) for more detailed information.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
