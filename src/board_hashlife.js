// Source: https://github.com/sbarski/jolly
// We used this implementation to aid us in writing ours

// The quad tree uses arrays, so these are for readability to determine the element quadrants
const nw = 0
const ne = 1
const sw = 2
const se = 3

// A node of a quad tree, meant to be used by the hashlife implementation
class QuadTree {
	constructor(board, id = 0, children = undefined) {
		// Back reference to board state
		this.board = board

		// Unique identifier for this node
		this.id = id

		// These are more QuadTree instances, ordered as such: [nw, ne, sw, se]
		// If this is undefined, we are in a leaf node
		this.children = children

		// Depth in tree (0 means leaf node)
		this.level = 0

		// Number of live cells in this node
		this.count = id

		// For memoizing results
		this.cache = []

		// Not just an initial cell
		if (id > 1 && children) {
			// 1 more than any of its children
			this.level = nw.level + 1

			// Add up children counts
			this.count = nw.count + ne.count + sw.count + se.count
		}
	}

	// Getters for specific children
	get nw() {
		return this.children[0]
	}

	get ne() {
		return this.children[1]
	}

	get sw() {
		return this.children[2]
	}

	get se() {
		return this.children[3]
	}

	// Returns the power of 2 of the current depth of the tree
	get width() {
		return Math.pow(2, this.level)
	}

	// Calculates the next state of a particular cell, based on number of live neighbors
	score(state, neighbors) {
		if ((state === 1 && neighbors === 2) || neighbors === 3) {
			return 1
		}
		return 0
	}

	// Get child index closest to position
	getChildIndex(x, y) {
		let halfSize = Math.floor(this.width / 2)
		return Math.floor(x / halfSize) + (Math.floor(y / halfSize) * 2)
	}

	// Get child closest to position
	getChild(x, y) {
		return this.children[this.getChildIndex(x, y)]
	}

	// Returns the state of the cell at this position
	get(x, y) {
		// Found the child containing the cell, so return its state
		if (this.level === 0) {
			return this.count
		}

		// Recurse down one level
		return this.getChild(x, y).get(x % halfSize, y % halfSize)
	}

	// Sets the state of the cell at this position (may require some quadtree modifications)
	set(x, y, state) {
		// Reached the cell that needs to be set
		// Return an already allocated cell, either alive or dead based on state
		if (this.level === 0) {
			return this.board.baseCells[state]
		}

		let halfSize = Math.floor(this.width / 2)
		let index = this.getChildIndex(x, y)

		// Allocate more children to store new cell state
		let newChildren = extend(this.children)

		// Recurse down
		newChildren[index] = newChildren[index].set(x % halfSize, y % halfSize, state)

		// Use memoization if possible
		return this.board.getNode(...newChildren)
	}

	// Returns an array of IDs of current children
	// Contains: [nw.id, ne.id, sw.id, se.id]
	getIds() {
		if (this.children) {
			return this.children.map(child => child.id)
		}
	}

	// Note: Method should only be ran at level 2
	simulate() {
		// Get an array of arrays of child IDs
		let ids = this.children.map(child => child.getIds())

		// Alias IDs for readability
		let aa = ids[nw][nw], ab = ids[nw][ne], ba = ids[nw][sw], bb = ids[nw][se]
		let ac = ids[ne][nw], ad = ids[ne][ne], bc = ids[ne][sw], bd = ids[ne][se]
		let ca = ids[sw][nw], cb = ids[sw][ne], da = ids[sw][sw], db = ids[sw][se]
		let cc = ids[se][nw], cd = ids[se][ne], dc = ids[se][sw], dd = ids[se][se]

		// Score the cells in the center, with their surrounding neighbors
		let scores = [
			this.score(bb, aa + ab + ac + ba + bc + ca + cb + cc),
			this.score(bc, ab + ac + ad + bb + bd + cb + cc + cd),
			this.score(cb, ba + bb + bc + ca + cc + da + db + dc),
			this.score(cc, bb + bc + bd + cb + cd + db + dc + dd)
		]

		// Return the data in the hash table with the ID built from the scores array
		return this.board.memo[scores]
	}

	subdivide(stepSize) {
		let halfSteps = Math.floor(Math.pow(2, this._level - 2) / 2)

		let step1 = (stepSize <= halfSteps ? 0 : halfSteps)
		let step2 = stepSize - step1
		console.log(`Step 1: ${step1}, Step 2: ${step2}`)

		let sub = this.getSavedCenter(step1)
		let n00 = sub[0], n01 = sub[1], n02 = sub[2]
		let n10 = sub[3], n11 = sub[4], n12 = sub[5]
		let n20 = sub[6], n21 = sub[7], n22 = sub[8]

		return this.board.getNode(
			this.board.getNode(n00, n01, n10, n11).nextCenter(step2),
			this.board.getNode(n01, n02, n11, n12).nextCenter(step2),
			this.board.getNode(n10, n11, n20, n21).nextCenter(step2),
			this.board.getNode(n11, n12, n21, n22).nextCenter(step2)
		)
	}

	nextCenter(stepSize = 1) {
		if (stepSize === 0) {
			return this.center()
		}

		if (this.cache[stepSize]) {
			return this.cache[stepSize]
		}

		let result = undefined

		// Do some magic at level 2, other magic at other levels
		if (this.level === 2) {
			result = this.simulate()
		} else {
			result = this.subdivide(stepSize)
		}

		this.cache[stepSize] = result

		return result
	}

	getSavedCenter(stepSize) {
		let result = []
		for (let i = 0; i < 9; ++i) {
			result[i] = this.subquad(i).nextCenter(stepSize)
		}
		return result
	}

	center() {
		if (this.cache && this.cache.length > 0) {
			return this.cache[0]
		}

		// Get center 2x2 area of nodes, within the 4x4 area
		let result = this.board.getNode(this.nw.se, this.ne.sw, this.sw.ne, this.se.nw)
		this.cache[0] = result
		return result
	}

	subquad(i) {
		if (i == 0) return this.nw
		if (i == 1) return this.board.getNode(this.nw.ne, this.ne.nw, this.nw.se, this.ne.sw)
		if (i == 2) return this.ne
		if (i == 3) return this.board.getNode(this.nw.sw, this.nw.se, this.sw.nw, this.sw.ne)
		if (i == 4) return this.center()
		if (i == 5) return this.board.getNode(this.ne.sw, this.ne.se, this.se.nw, this.se.ne)
		if (i == 6) return this.sw
		if (i == 7) return this.board.getNode(this.sw.ne, this.se.nw, this.sw.se, this.se.sw)
		if (i == 8) return this.se
	}
}

// Similar to LifeBoard
// Hashlife implementation
class BoardHashlife extends Board {
	constructor() {
		super()

		// Setup base cells
		this.baseCells = [new QuadTree(this, 0), new QuadTree(this, 1)]

		this.init()
	}

	init() {
		this.root = this.baseCells[0]
		this.memo = []

		// All possible states of a 2x2 cell
		for (let i = 0; i < 16; ++i) {
			// Example: [1, 0, 1, 0]
			let index = [i & 1, (i & 2) / 2, (i & 4) / 4, (i & 8) / 8]

			// Example: [Alive, Dead, Alive, Dead]
			let nodes = index.map(state => this.baseCells[state])

			// Store in hash table, generate new IDs
			this.memo[index] = new QuadTree(this, i + 2, nodes)
		}

		// Stores empty nodes
		this.empty = [this.baseCells[0], this.memo[[0, 0, 0, 0]]]
	}

	clear() {
		this.init()
		this.clearCanvas()
	}

	draw() {
		// Iterate through quadtree and draw data in leaf nodes
		// An easier solution would be to get the area as a list, then just go through that and draw those as pixels

		// Draw canvas data, and update population display
		super.draw()
	}

	addCell(cell) {
		let pos = unhash(cell)

		// Set bit in quadtree, will need to recurse down to the correct location
		this.root.set(pos.x, pos.y, 1)
	}

	simulate(stepSize = 1) {
		this.generation += stepSize
		this.population = 0

		// Step forward using hashlife algorithm
		this.current = this.root.nextCenter(stepSize)
	}

	serialize() {
		// Serialize quadtree data back into an array of live cell positions
		return '[]'
	}
}
