
#include <span>
#include <array>
#include <queue>
#include <vector>
using namespace std;

class Solution {

    struct Point {
        size_t row;
        size_t column;
        int direction;

        Point(size_t row, size_t column, int direction) :
            row{ row }, column{ column }, direction{ direction } {}
    };

    static const int EMPTY_SPACE = 0;
    static const int OBSTACLE = 1;
    static constexpr array<int, 4> directions = { 0, 1, 2, 3 };
    inline static const unordered_map<int, array<int, 2>> currentDirectionToNextCoordinates
    { {0, {0, 1}}, {1,{1, 0}}, {2,{0, -1}}, {3, {-1, 0}} };

    size_t rows{};
    size_t columns{};
    vector<vector<int>> visited;

public:
    int numberOfCleanRooms(const vector<vector<int>>& room) {
        rows = room.size();
        columns = room[0].size();
        return breadthFirstSearchToFindMaxCleanedPoints(room);
    }

private:
    int breadthFirstSearchToFindMaxCleanedPoints(span<const vector<int>> room) {
        queue<Point> queue;
        queue.emplace(0, 0, 0);

        visited.resize(rows, vector<int>(columns));
        markAsVisitedWithGivenDirection(0, 0, 0);

        int maxCleanedPoints = 1;

        while (!queue.empty()) {

            Point current = queue.front();
            queue.pop();

            size_t nextRow = current.row + currentDirectionToNextCoordinates.at(current.direction)[0];
            size_t nextColumn = current.column + currentDirectionToNextCoordinates.at(current.direction)[1];

            if (!isInRoom(nextRow, nextColumn) || room[nextRow][nextColumn] == OBSTACLE) {
                int newDirection = rotate90DegreesClockwise(current.direction);
                if (isVisitedWithGivenDirection(current.row, current.column, newDirection)) {
                    break;
                }

                markAsVisitedWithGivenDirection(current.row, current.column, newDirection);
                queue.emplace(current.row, current.column, newDirection);
                continue;
            }

            if (!isVisitedWithGivenDirection(nextRow, nextColumn, current.direction)) {
                maxCleanedPoints += (visited[nextRow][nextColumn] == 0) ? 1 : 0;
                markAsVisitedWithGivenDirection(nextRow, nextColumn, current.direction);
                queue.emplace(nextRow, nextColumn, current.direction);
            }
        }
        return maxCleanedPoints;
    }

    bool isVisitedWithGivenDirection(size_t row, size_t column, int direction) const {
        return (visited[row][column] & (1 << direction)) != 0;
    }

    void markAsVisitedWithGivenDirection(size_t row, size_t column, int direction) {
        visited[row][column] |= (1 << direction);
    }

    int rotate90DegreesClockwise(int currentDirection) const {
        return (currentDirection + 1) % directions.size();
    }

    bool isInRoom(size_t row, size_t column) const {
        return  row < rows && column < columns;
    }
};
