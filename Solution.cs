
using System;
using System.Collections.Generic;

public class Solution
{
    private record Point(int row, int column, int direction) { }

    private static readonly int EMPTY_SPACE = 0;
    private static readonly int OBSTACLE = 1;
    private static readonly int[] directions = { 0, 1, 2, 3 };
    private static readonly Dictionary<int, int[]> currentDirectionToNextCoordinates
        = new Dictionary<int, int[]>(){
            {0, new int[] { 0, 1 }}, {1,new int[] { 1, 0 }},
            {2, new int[] { 0, -1 }}, {3, new int[] { -1, 0 }}
        };

    private int rows;
    private int columns;
    private int[][]? visited;

    public int NumberOfCleanRooms(int[][] room)
    {
        rows = room.Length;
        columns = room[0].Length;
        return breadthFirstSearchToFindMaxCleanedPoints(room);
    }

    private int breadthFirstSearchToFindMaxCleanedPoints(int[][] room)
    {
        Queue<Point> queue = new Queue<Point>();
        queue.Enqueue(new Point(0, 0, 0));

        visited = new int[rows][];
        for (int r = 0; r < rows; ++r)
        {
            visited[r] = new int[columns];
        }
        MarkAsVisitedWithGivenDirection(0, 0, 0);

        int maxCleanedPoints = 1;

        while (queue.Count > 0)
        {
            Point current = queue.Dequeue();
            int nextRow = current.row + currentDirectionToNextCoordinates[current.direction][0];
            int nextColumn = current.column + currentDirectionToNextCoordinates[current.direction][1];

            if (!IsInRoom(nextRow, nextColumn) || room[nextRow][nextColumn] == OBSTACLE)
            {
                int newDirection = Rotate90DegreesClockwise(current.direction);
                if (IsVisitedWithGivenDirection(current.row, current.column, newDirection))
                {
                    break;
                }

                MarkAsVisitedWithGivenDirection(current.row, current.column, newDirection);
                queue.Enqueue(new Point(current.row, current.column, newDirection));
                continue;
            }

            if (!IsVisitedWithGivenDirection(nextRow, nextColumn, current.direction))
            {
                maxCleanedPoints += (visited[nextRow][nextColumn] == 0) ? 1 : 0;
                MarkAsVisitedWithGivenDirection(nextRow, nextColumn, current.direction);
                queue.Enqueue(new Point(nextRow, nextColumn, current.direction));
            }
        }
        return maxCleanedPoints;
    }

    private bool IsVisitedWithGivenDirection(int row, int column, int direction)
    {
        return (visited[row][column] & (1 << direction)) != 0;
    }

    private void MarkAsVisitedWithGivenDirection(int row, int column, int direction)
    {
        visited[row][column] |= (1 << direction);
    }

    private int Rotate90DegreesClockwise(int currentDirection)
    {
        return (currentDirection + 1) % directions.Length;
    }

    private bool IsInRoom(int row, int column)
    {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }
}
