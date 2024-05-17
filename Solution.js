
/**
 * @param {number[][]} room
 * @return {number}
 */
var numberOfCleanRooms = function (room) {
    this.EMPTY_SPACE = 0;
    this.OBSTACLE = 1;
    this.directions = [0, 1, 2, 3];
    this.currentDirectionToNextCoordinates = new Map
            ([
                [0, [0, 1]], [1, [1, 0]], [2, [0, -1]], [3, [-1, 0]]
            ]);

    this.rows = room.length;
    this.columns = room[0].length;
    this.visited = Array.from(new Array(this.rows), () => new Array(this.columns).fill(0));
    return breadthFirstSearchToFindMaxCleanedPoints(room);
};

/**
 * @param {number} row
 * @param {number} column
 * @param {number} direction
 */
function Point(row, column, direction) {
    this.row = row;
    this.column = column;
    this.direction = direction;
}

/**
 * @param {number[][]} room
 * @return {number}
 */
function breadthFirstSearchToFindMaxCleanedPoints(room) {
    //  Queue<Point>
    // const {Queue} = require('@datastructures-js/queue');
    const queue = new Queue();
    queue.enqueue(new Point(0, 0, 0));

    markAsVisitedWithGivenDirection(0, 0, 0);

    let maxCleanedPoints = 1;

    while (!queue.isEmpty()) {

        const current = queue.dequeue();
        const nextRow = current.row + this.currentDirectionToNextCoordinates.get(current.direction)[0];
        const nextColumn = current.column + this.currentDirectionToNextCoordinates.get(current.direction)[1];

        if (!isInRoom(nextRow, nextColumn) || room[nextRow][nextColumn] === this.OBSTACLE) {
            const newDirection = rotate90DegreesClockwise(current.direction);
            if (isVisitedWithGivenDirection(current.row, current.column, newDirection)) {
                break;
            }

            markAsVisitedWithGivenDirection(current.row, current.column, newDirection);
            queue.enqueue(new Point(current.row, current.column, newDirection));
            continue;
        }

        if (!isVisitedWithGivenDirection(nextRow, nextColumn, current.direction)) {
            maxCleanedPoints += (this.visited[nextRow][nextColumn] === 0) ? 1 : 0;
            markAsVisitedWithGivenDirection(nextRow, nextColumn, current.direction);
            queue.enqueue(new Point(nextRow, nextColumn, current.direction));
        }
    }
    return maxCleanedPoints;
}

/**
 * @param {number} row
 * @param {number} column
 * @param {number} direction
 * @return {boolean}
 */
function isVisitedWithGivenDirection(row, column, direction) {
    return (this.visited[row][column] & (1 << direction)) !== 0;
}

/**
 * @param {number} row
 * @param {number} column
 * @param {number} direction
 * @return {void}
 */
function markAsVisitedWithGivenDirection(row, column, direction) {
    this.visited[row][column] |= (1 << direction);
}

/**
 * @param {number} currentDirection
 * @return {number}
 */
function rotate90DegreesClockwise(currentDirection) {
    return (currentDirection + 1) % this.directions.length;
}

/**
 * @param {number} row
 * @param {number} column
 * @return {boolean}
 */
function isInRoom(row, column) {
    return row >= 0 && row < this.rows && column >= 0 && column < this.columns;
}
