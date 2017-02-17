import Board from 'board.js'

function test() {
	let board = new Board()
	board.importPattern('somepatternfile')
	board.draw()
	for (let i = 0; i < 10; ++i) {
		console.log('Iteration: ' + i)
		board.simulate()
		board.draw()
	}
}

window.onload = test
