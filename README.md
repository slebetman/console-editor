# console-editor

Edit functions in a real editor

![demo](./demo.gif)

### Usage:

This is meant to be used from withing the node repl or from an interactive program.
Currently all functions are synchronous so this is not really suitable to be used
in servers or long-running services.

The module exposes one function which can be used to edit functions in a terminal
editor such as `vim` or `slap`. It will launch the editor you configured in the
`$EDITOR` environment variable.

    > edit = require('console-editor')
	> edit(some_function)

Since this is a module you may also use this in your own terminal app. The spawned
editor will take over your **stdin**, **stdout** and **stderr** until you quit the
editor.

### Installation

Just install it via npm:

    npm install console-editor

	# or globally:
	npm install -g console-editor

