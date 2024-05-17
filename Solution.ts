
function numberOfCleanRooms(room: number[][]): number {
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

function Point(row: number, column: number, direction: number) {
    this.row = row;
    this.column = column;
    this.direction = direction;
}

function breadthFirstSearchToFindMaxCleanedPoints(room: number[][]): number {

    const { Queue } = require('@datastructures-js/queue');
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

function isVisitedWithGivenDirection(row: number, column: number, direction: number): boolean {
    return (this.visited[row][column] & (1 << direction)) !== 0;
}

function markAsVisitedWithGivenDirection(row: number, column: number, direction: number): void {
    this.visited[row][column] |= (1 << direction);
}

function rotate90DegreesClockwise(currentDirection: number): number {
    return (currentDirection + 1) % this.directions.length;
}

function isInRoom(row: number, column: number): boolean {
    return row >= 0 && row < this.rows && column >= 0 && column < this.columns;
}
