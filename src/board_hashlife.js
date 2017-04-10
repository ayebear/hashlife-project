// Hashlife implementation
class BoardHashlife extends Board {
	constructor() {
		super()
		this.sim = new gol.Simulation(16)
	}

	simulate(generation = 1) {
		this.cells = this.sim.get(generation)

		// TODO: Save next state so that it can step with a fixed size
		// this.set(this.cells)

		this.drawAll()
	}

	drawAll() {
		if (this.cells !== undefined) {
			// Clear canvas
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

			// Draw pixels
			for (let cell of this.cells) {
				this.drawCell(unhash(cell), 0)
			}

			// Update canvas
			// this.ctx.putImageData(this.imageData, 0, 0)
		}
	}
}
