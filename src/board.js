Math.getRandomInt = function(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min)) + min
}

export default class Board {
	constructor() {
		// Canvas/drawing
		this.canvas = document.getElementById('board')
		this.ctx = this.canvas.getContext('2d')
		this.ctx.imageSmoothingEnabled = false
		this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)

		// Logic data
		this.cells = new Set()
	}

	setPixel(cell, on) {
		let position = this.unhash(cell)
		let element = (position.y * 4) * this.canvas.width + (position.x * 4)
		let value = (on ? 0 : 255)

		// Red, green, blue, alpha
		this.imageData.data[element] = value
		this.imageData.data[element + 1] = value
		this.imageData.data[element + 2] = value
		this.imageData.data[element + 3] = 255
	}

	addCell(cell) {
		this.cells.add(cell)
		this.setPixel(cell, true)
	}

	removeCell(cell) {
		this.cells.delete(cell)
		this.setPixel(cell, false)
	}

	hash(x, y) {
		return x + ',' + y
	}

	unhash(key) {
		let pos = key.split(',')
		return {
			x: JSON.parse(pos[0]),
			y: JSON.parse(pos[1])
		}
	}

	importPattern() {
		// TODO: Support importing a file format that contains initial board states
		this.addCell(this.hash(12, 45))
		this.addCell(this.hash(12, 46))
		this.addCell(this.hash(12, 47))

		this.addCell(this.hash(20, 50))
		this.addCell(this.hash(21, 50))
		this.addCell(this.hash(22, 50))

		this.addCell(this.hash(60, 60))

		for (let y = 20; y < 40; ++y) {
			for (let x = 300; x < 320; ++x) {
				this.addCell(this.hash(x, y))
			}
		}

		for (let i = 0; i < 30000; ++i) {
			let x = Math.getRandomInt(200, 400)
			let y = Math.getRandomInt(300, 500)
			this.addCell(this.hash(x, y))
		}
	}

	// Returns count of neighboring live cells
	// Also optionally keeps track of surrounding dead cells
	checkCell(cell, deadCells) {
		let position = this.unhash(cell)
		let alive = 0
		for (let y = -1; y <= 1; ++y) {
			for (let x = -1; x <= 1; ++x) {
				// Skip current cell, only count neighbors
				if (x === 0 && y === 0) {
					continue
				}
				let key = this.hash(position.x + x, position.y + y)
				if (this.cells.has(key)) {
					++alive
				} else if (deadCells) {
					deadCells.add(key)
				}
			}
		}
		return alive
	}

	// Runs life simulation 1 iteration
	simulate() {
		let deadCells = new Set()
		let toAdd = []
		let toRemove = []

		// Simulate survival logic
		for (let cell of this.cells) {
			let count = this.checkCell(cell, deadCells)
			if (count === 2 || count === 3) {
				toAdd.push(cell)
			} else {
				toRemove.push(cell)
			}
		}

		// Simulate birth logic
		for (let cell of deadCells) {
			let count = this.checkCell(cell)
			if (count === 3) {
				toAdd.push(cell)
			} else {
				toRemove.push(cell)
			}
		}

		// Apply state changes
		for (let cell of toAdd) {
			this.addCell(cell)
		}
		for (let cell of toRemove) {
			this.removeCell(cell)
		}
	}

	// Renders data to canvas
	draw() {
		this.ctx.putImageData(this.imageData, 0, 0)
		this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
	}
}
