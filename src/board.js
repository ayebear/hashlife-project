export default class Board {
	constructor() {
		// Canvas/drawing
		this.canvas = document.getElementById('board')
		this.ctx = this.canvas.getContext('2d')
		this.ctx.imageSmoothingEnabled = false
		this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)

		// Logic
		this.cells = new Set()
		/*
		{5: {2, 4, 7, 54645}}
		*/
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
		// TODO
		this.cells.add(this.hash(12, 45))
		this.cells.add(this.hash(12, 46))
		this.cells.add(this.hash(12, 47))
		this.cells.add(this.hash(13, 45))
		this.cells.add(this.hash(13, 47))
		for (let i = 400; i < 450; ++i) {
			for (let j = 0; j < 600; ++j) {
				this.cells.add(this.hash(j, i))
			}
		}
	}

	checkCell(position) {
		let alive = 0
		for (let y = 0; y < 3; ++y) {
			for (let x = 0; x < 3; ++x) {
				let key = this.hash(x, y)
				if (this.cells.has(key)) {
					++alive
				}
			}
		}
		return alive
	}

	simulate() {
		for (let cell of this.cells) {
			let position = this.unhash(cell)
			let alive = this.checkCell(position)
			// if ()
		}
	}

	draw() {
		// Copy pixels directly for now
		for (let cell of this.cells) {
			let position = this.unhash(cell)
			let element = (position.y * 4) * this.canvas.width + (position.x * 4)
			this.imageData.data[element] = 0
			this.imageData.data[element + 1] = 0
			this.imageData.data[element + 2] = 0
			this.imageData.data[element + 3] = 255
		}

		this.ctx.putImageData(this.imageData, 0, 0)
	}
}