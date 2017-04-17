// Hashlife implementation
class BoardHashlife extends Board {
	constructor() {
		super()
		this.life = new LifeUniverse()
		this.drawer = new LifeCanvasDrawer()
		this.drawer.init(this.canvas, this.ctx)
		this.drawer.set_size(this.canvas.width, this.canvas.height)
	}

	clear() {
		// this.life.clear_pattern()
		// this.clearCanvas()
	}

	addCell(cell) {
		let pos = unhash(cell)
		this.life.set_bit(pos.x, pos.y, true)
	}

	simulate(stepSize = 1) {
		this.generation += stepSize
		this.population = 0

		this.life.next_generation()
	}

	serialize() {
		return '[]'
	}
}
