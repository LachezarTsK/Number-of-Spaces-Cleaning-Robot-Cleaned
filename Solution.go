
package main

import (
	"container/list"
	"fmt"
)

type Point struct {
	Row       int
	Column    int
	Direction int
}

func NewPoint(row, column, direction int) *Point {
	point := Point{}
	point.Row = row
	point.Column = column
	point.Direction = direction
	return &point
}

const EMPTY_SPACE = 0
const OBSTACLE = 1

var directions = [4]int{0, 1, 2, 3}
var currentDirectionToNextCoordinates = map[int][2]int{0: {0, 1}, 1: {1, 0}, 2: {0, -1}, 3: {-1, 0}}
var visited [][]int

var rows = 0
var columns = 0

func numberOfCleanRooms(room [][]int) int {
	rows = len(room)
	columns = len(room[0])
	return breadthFirstSearchToFindMaxCleanedPoints(&room)
}

func breadthFirstSearchToFindMaxCleanedPoints(room *[][]int) int {
	queue := list.New()
	queue.PushBack(NewPoint(0, 0, 0))

	visited = make([][]int, rows)
	for i := range visited {
		visited[i] = make([]int, columns)
	}

	markAsVisitedWithGivenDirection(0, 0, 0)

	var maxCleanedPoints = 1

	for queue.Len() > 0 {

		var current = queue.Front().Value
		queue.Remove(queue.Front())

		var nextRow = current.(*Point).Row + currentDirectionToNextCoordinates[current.(*Point).Direction][0]
		var nextColumn = current.(*Point).Column + currentDirectionToNextCoordinates[current.(*Point).Direction][1]

		if !isInRoom(nextRow, nextColumn) || (*room)[nextRow][nextColumn] == OBSTACLE {
			var newDirection = rotate90DegreesClockwise(current.(*Point).Direction)
			if isVisitedWithGivenDirection(current.(*Point).Row, current.(*Point).Column, newDirection) {
				break
			}

			markAsVisitedWithGivenDirection(current.(*Point).Row, current.(*Point).Column, newDirection)
			queue.PushBack(NewPoint(current.(*Point).Row, current.(*Point).Column, newDirection))
			continue
		}

		if !isVisitedWithGivenDirection(nextRow, nextColumn, current.(*Point).Direction) {
			if visited[nextRow][nextColumn] == 0 {
				maxCleanedPoints++
			}
			markAsVisitedWithGivenDirection(nextRow, nextColumn, current.(*Point).Direction)
			queue.PushBack(NewPoint(nextRow, nextColumn, current.(*Point).Direction))
		}
	}
	return maxCleanedPoints
}

func isVisitedWithGivenDirection(row, column, direction int) bool {
	return (visited[row][column] & (1 << direction)) != 0
}

func markAsVisitedWithGivenDirection(row, column, direction int) {
	visited[row][column] = (visited[row][column] | (1 << direction))
}

func rotate90DegreesClockwise(currentDirection int) int {
	return (currentDirection + 1) % len(directions)
}

func isInRoom(row, column int) bool {
	return row >= 0 && row < rows && column >= 0 && column < columns
}
