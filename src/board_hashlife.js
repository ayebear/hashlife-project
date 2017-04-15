// Hashlife implementation
class BoardHashlife extends Board {
	constructor() {
		super()
		this.sim = new gol.Simulation(16)
	}

	clear() {
		this.sim = new gol.Simulation(16)
		this.clearCanvas()
	}

	addCell(cell) {
		let pos = unhash(cell)
		this.sim.set(pos.x, pos.y)
	}

	simulate(stepSize = 1) {
		this.generation += stepSize
		this.population = 0

		// Get next generation with step size
		let cells = this.sim.get(stepSize)

		// Draw the cells
		for (let cell of cells) {
			this.drawCell(cell, 0)
		}

		// Save next state so that it can step with a fixed size
		this.sim = new gol.Simulation(16)
		for (let cell of cells) {
			this.population++
			this.sim.set(cell.x, cell.y)
		}
	}

	serialize() {
		let data = []
		let cells = this.sim.get(0)
		for (let cell of cells) {
			data.push(hash(cell))
		}
		return JSON.stringify(data)
	}
}
