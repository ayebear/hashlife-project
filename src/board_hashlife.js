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
			return this.board.baseCell(state)
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
		let aa = ids[nw][nw]; let ab = ids[nw][ne]; let ba = ids[nw][sw]; let bb = ids[nw][se]
		let ac = ids[ne][nw]; let ad = ids[ne][ne]; let bc = ids[ne][sw]; let bd = ids[ne][se]
		let ca = ids[sw][nw]; let cb = ids[sw][ne]; let da = ids[sw][sw]; let db = ids[sw][se]
		let cc = ids[se][nw]; let cd = ids[se][ne]; let dc = ids[se][sw]; let dd = ids[se][se]

		// Score the cells around the 2x2 area children of children
		let scores = [
			this.score(bb, aa + ab + ac + ba + bc + ca + cb + cc),
			this.score(bc, ab + ac + ad + bb + bd + cb + cc + cd),
			this.score(cb, ba + bb + bc + ca + cc + da + db + dc),
			this.score(cc, bb + bc + bd + cb + cd + db + dc + dd)
		]

		// Return the data in the hash table with the ID built from the scores array
		return this.board.memo[scores]
	}

	subdivide() {

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
		this.root = new QuadTree(this)
	}

	clear() {
		this.init()
		this.clearCanvas()
	}

	draw() {
		// Iterate through quadtree and draw data in leaf nodes

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

	baseCell(state) {
		return this.baseCells[state]
	}
}
