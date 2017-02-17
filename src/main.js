import Board from 'board.js'

function test() {
	let board = new Board()
	board.importPattern('somepatternfile')
	// board.simulate()
	board.draw()
}

window.onload = test
