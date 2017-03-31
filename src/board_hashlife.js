Math.getRandomInt = function(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min)) + min
}

export default class BoardHashlife {
	constructor() {
		this.sim = new gol.Simulation(16)
		this.canvas = document.getElementById('board')
		this.ctx = this.canvas.getContext('2d')
		this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
		this.cells = undefined
	}

	importPattern(patternFile) {
		// var gen0 = [
		// 	{x: -2, y: -1},
		// 	{x: -1, y: -1},
		// 	{x: -1, y:  1},
		// 	{x:  0, y: -1},
		// 	{x:  0, y:  0}
		// ];

		// // Populate the universe with our glider
		// for (let elem of gen0) {
		// 	this.sim.set(elem.x, elem.y)  // Sets the cell to 'alive'
		// }


		// TODO: Support importing a file format that contains initial board states
		this.sim.set(12, 45)
		this.sim.set(12, 46)
		this.sim.set(12, 47)

		this.sim.set(20, 50)
		this.sim.set(21, 50)
		this.sim.set(22, 50)

		this.sim.set(60, 60)

		for (let y = 20; y < 40; ++y) {
			for (let x = 300; x < 320; ++x) {
				this.sim.set(x, y)
			}
		}

		for (let i = 0; i < 30000; ++i) {
			let x = Math.getRandomInt(200, 400)
			let y = Math.getRandomInt(300, 500)
			this.sim.set(x, y)
		}
	}

	simulate(generation = 1) {
		this.cells = this.sim.get(generation)
	}

	draw(canvas) {
		if (this.cells !== undefined) {
			// Clear canvas
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

			// Draw pixels
			for (let cell of this.cells) {
				this.setPixel(cell, 0)
			}

			// Update canvas
			this.ctx.putImageData(this.imageData, 0, 0)
		}
	}

	// TODO: Put in base class
	setPixel(position, value) {
		let element = (position.y * -4) * this.canvas.width + (position.x * 4)

		// Red, green, blue, alpha
		this.imageData.data[element] = value
		this.imageData.data[element + 1] = value
		this.imageData.data[element + 2] = value
		this.imageData.data[element + 3] = 255
	}
}
