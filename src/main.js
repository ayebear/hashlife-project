let main = undefined

class Main {
	constructor() {
		this.simulate = false
		this.stepSize = 1

		this.boardSwitcher = new BoardSwitcher('algorithm')

		// Setup file drag and drop handler for the canvas
		this.fileDrop = new FileDrop('board', data => {
			// Clear the board, import the pattern, and draw it
			this.boardSwitcher.board.clear()
			this.boardSwitcher.board.importPattern(data)
			this.boardSwitcher.board.draw()
		})

		this.setupKeyboardInput()
		this.setupStats()

		// Start loop
		requestAnimationFrame(() => {this.loop()})
	}

	setupKeyboardInput() {
		this.listener = new window.keypress.Listener()

		// Press enter to go forward once by the step size
		this.listener.simple_combo('enter', () => {
			this.boardSwitcher.board.simulate(this.stepSize)
			this.boardSwitcher.board.draw()
		})

		// Press space to toggle simulation
		this.listener.simple_combo('space', () => {
			this.toggleSimulate()
		})

		// Press r to clear the board
		this.listener.simple_combo('r', () => {
			this.boardSwitcher.board.clear()
		})
	}

	setupStats() {
		this.stats = new MemoryStats()

		this.stats.domElement.style.position = 'fixed'
		this.stats.domElement.style.right = '0px'
		this.stats.domElement.style.bottom = '0px'

		document.body.appendChild(this.stats.domElement)
	}

	loop() {
		// Check if user changed algorithm
		this.boardSwitcher.update()

		// Continue simulation if currently running
		if (this.simulate) {
			this.boardSwitcher.board.simulate(this.stepSize)
			this.boardSwitcher.board.draw()
		}

		// Update graphs
		this.stats.update();

		requestAnimationFrame(() => {this.loop()})
	}

	// Handles changing the step size input by only a power of 2
	handleLog2Input() {
		let num = parseInt(document.getElementById("step-size").value)
		let result = 0
		if (num < this.stepSize) {
			result = Math.pow(2, Math.floor(Math.log2(num)))
		} else {
			result = Math.pow(2, Math.ceil(Math.log2(num)))
		}
		if (isNaN(result)) {
			result = 1
		}
		this.stepSize = result
		document.getElementById("step-size").value = result
	}

	toggleSimulate() {
		this.simulate = !this.simulate
		let text = this.simulate ? 'Stop' : 'Run'
		document.getElementById('run').value = text
	}

	clear() {
		this.boardSwitcher.board.clear()
	}
}

window.onload = () => {
	main = new Main()
}
