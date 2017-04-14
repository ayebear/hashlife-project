// Used to change instance of simulation algorithm used
// Preserves state when switching
class BoardSwitcher {
	constructor(element) {
		this.element = element
		this.board = new BoardNaive()
		this.current = 'step-by-step'
	}

	update() {
		// If user input changed, then change the algorithm
		let newInput = document.getElementById(this.element).selected

		// There needs to be serialize/deserialize methods in Board base class to preserve state
	}
}
