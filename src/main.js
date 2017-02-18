import Board from 'board.js'

let simulate = false
let board = undefined

function test() {
	let listener = new window.keypress.Listener()

	// Setup initial board
	board = new Board()
	board.importPattern('somepatternfile')
	board.draw()

	// Handle holding enter to simulate
	listener.register_combo({
		'keys': 'enter',
		'on_keydown': () => {
			simulate = true
		},
		'on_keyup': () => {
			simulate = false
		}
	})

	listener.simple_combo('r', () => {
		board.importPattern()
		board.draw()
	})

	// Start loop
	requestAnimationFrame(loop)
}

function loop() {
	if (simulate) {
		board.simulate()
		board.draw()
	}
	requestAnimationFrame(loop)
}

window.onload = test
