
import java.util.*

class Solution {

    private data class Point(val row: Int, val column: Int, val direction: Int) {}

    private companion object {
        const val EMPTY_SPACE = 0
        const val OBSTACLE = 1
        val directions = intArrayOf(0, 1, 2, 3)
        val currentDirectionToNextCoordinates =
            mapOf(0 to intArrayOf(0, 1), 1 to intArrayOf(1, 0), 2 to intArrayOf(0, -1), 3 to intArrayOf(-1, 0))
    }

    private var rows = 0
    private var columns = 0
    private lateinit var visited: Array<IntArray>

    fun numberOfCleanRooms(room: Array<IntArray>): Int {
        rows = room.size
        columns = room[0].size
        return breadthFirstSearchToFindMaxCleanedPoints(room)
    }

    private fun breadthFirstSearchToFindMaxCleanedPoints(room: Array<IntArray>): Int {
        val queue: Queue<Point> = LinkedList<Point>()
        queue.add(Point(0, 0, 0))

        visited = Array(rows) { IntArray(columns) }
        markAsVisitedWithGivenDirection(0, 0, 0)

        var maxCleanedPoints = 1

        while (!queue.isEmpty()) {

            val current = queue.poll()
            val nextRow = current.row + currentDirectionToNextCoordinates.get(current.direction)!![0]
            val nextColumn = current.column + currentDirectionToNextCoordinates.get(current.direction)!![1]

            if (!isInRoom(nextRow, nextColumn) || room[nextRow][nextColumn] == OBSTACLE) {
                val newDirection = rotate90DegreesClockwise(current.direction)
                if (isVisitedWithGivenDirection(current.row, current.column, newDirection)) {
                    break
                }

                markAsVisitedWithGivenDirection(current.row, current.column, newDirection)
                queue.add(Point(current.row, current.column, newDirection))
                continue
            }

            if (!isVisitedWithGivenDirection(nextRow, nextColumn, current.direction)) {
                maxCleanedPoints += if (visited[nextRow][nextColumn] == 0) 1 else 0
                markAsVisitedWithGivenDirection(nextRow, nextColumn, current.direction)
                queue.add(Point(nextRow, nextColumn, current.direction))
            }
        }
        return maxCleanedPoints
    }

    private fun isVisitedWithGivenDirection(row: Int, column: Int, direction: Int): Boolean {
        return (visited[row][column] and (1 shl direction)) != 0
    }

    private fun markAsVisitedWithGivenDirection(row: Int, column: Int, direction: Int) {
        visited[row][column] = (visited[row][column] or (1 shl direction))
    }

    private fun rotate90DegreesClockwise(currentDirection: Int): Int {
        return (currentDirection + 1) % directions.size
    }

    private fun isInRoom(row: Int, column: Int): Boolean {
        return row in 0..<rows && column in 0..<columns
    }
}
