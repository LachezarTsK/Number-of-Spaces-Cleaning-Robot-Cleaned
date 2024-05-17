
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;

public class Solution {

    private record Point(int row, int column, int direction) {}

    private static final int EMPTY_SPACE = 0;
    private static final int OBSTACLE = 1;
    private static final int[] directions = {0, 1, 2, 3};
    private static final Map<Integer, int[]> currentDirectionToNextCoordinates
            = Map.of(0, new int[]{0, 1}, 1, new int[]{1, 0}, 2, new int[]{0, -1}, 3, new int[]{-1, 0});

    private int rows;
    private int columns;
    private int[][] visited;

    public int numberOfCleanRooms(int[][] room) {
        rows = room.length;
        columns = room[0].length;
        return breadthFirstSearchToFindMaxCleanedPoints(room);
    }

    private int breadthFirstSearchToFindMaxCleanedPoints(int[][] room) {
        Queue<Point> queue = new LinkedList<>();
        queue.add(new Point(0, 0, 0));

        visited = new int[rows][columns];
        markAsVisitedWithGivenDirection(0, 0, 0);

        int maxCleanedPoints = 1;

        while (!queue.isEmpty()) {

            Point current = queue.poll();
            int nextRow = current.row + currentDirectionToNextCoordinates.get(current.direction)[0];
            int nextColumn = current.column + currentDirectionToNextCoordinates.get(current.direction)[1];

            if (!isInRoom(nextRow, nextColumn) || room[nextRow][nextColumn] == OBSTACLE) {
                int newDirection = rotate90DegreesClockwise(current.direction);
                if (isVisitedWithGivenDirection(current.row, current.column, newDirection)) {
                    break;
                }

                markAsVisitedWithGivenDirection(current.row, current.column, newDirection);
                queue.add(new Point(current.row, current.column, newDirection));
                continue;
            }

            if (!isVisitedWithGivenDirection(nextRow, nextColumn, current.direction)) {
                maxCleanedPoints += (visited[nextRow][nextColumn] == 0) ? 1 : 0;
                markAsVisitedWithGivenDirection(nextRow, nextColumn, current.direction);
                queue.add(new Point(nextRow, nextColumn, current.direction));
            }
        }
        return maxCleanedPoints;
    }

    private boolean isVisitedWithGivenDirection(int row, int column, int direction) {
        return (visited[row][column] & (1 << direction)) != 0;
    }

    private void markAsVisitedWithGivenDirection(int row, int column, int direction) {
        visited[row][column] |= (1 << direction);
    }

    private int rotate90DegreesClockwise(int currentDirection) {
        return (currentDirection + 1) % directions.length;
    }

    private boolean isInRoom(int row, int column) {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }
}
