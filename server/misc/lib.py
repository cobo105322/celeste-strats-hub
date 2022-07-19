from heapq import heappop, heappush
from itertools import count
from math import inf


class Matrix:
    def __init__(self, data):
        self.data = data

    def __eq__(self, other):
        return isinstance(other, Matrix) and self.data == other.data

    def __copy__(self):
        return self.__class__([row.copy() for row in self.data])

    def __getitem__(self, key):
        return self.data[key[0]][key[1]]

    def __setitem__(self, key, value):
        self.data[key[0]][key[1]] = value

    def __str__(self):
        return '\n'.join(' '.join([str(item) if item is not None else '-' for item in row]) for row in self.data)

    @classmethod
    def from_dimensions(cls, rows, cols):
        return cls([[None] * cols for _ in range(rows)])

    @classmethod
    def from_string(cls, string, delimiter=''):
        return cls([cls.row_from_string(line, delimiter) for line in string.split('\n')])

    @classmethod
    def row_from_string(cls, string, delimiter=''):
        items = string if delimiter == '' else string.split(delimiter)  # No delimiter = split on whitespace
        return [cls.value_from_string(item) for item in items]

    @classmethod
    def value_from_string(cls, string):
        return string

    def indexes(self):
        for i in range(len(self.data)):
            for j in range(len(self.data[i])):
                yield i, j

    def rows(self):
        return len(self.data)

    def cols(self):
        return len(self.data[0])

    def in_bounds(self, position):
        i, j = position
        return 0 <= i < len(self.data) and 0 <= j < len(self.data[i])

    def transpose(self):
        return self.__class__([list(t) for t in zip(*self.data)])

    def adjacent(self, position, diagonals=False):
        i, j = position
        options = [(i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)]
        if diagonals:
            options.extend([(i - 1, j - 1), (i - 1, j + 1), (i + 1, j - 1), (i + 1, j + 1)])
        return [position for position in options if self.in_bounds(position)]


# Adapted from https://docs.python.org/3.7/library/heapq.html#priority-queue-implementation-notes
class PriorityQueue:
    REMOVED = '<removed-task>'  # placeholder for a removed task

    def __init__(self, initial_data=None):
        self.pq = []  # list of entries arranged in a heap
        self.entry_finder = {}  # mapping of tasks to entries
        self.counter = count()  # unique sequence count
        if initial_data:
            for k, v in initial_data.items():
                self.add_task(k, v)

    def add_task(self, task, priority=0):
        'Add a new task or update the priority of an existing task'
        if task in self.entry_finder:
            self.remove_task(task)
        count = next(self.counter)
        entry = [priority, count, task]
        self.entry_finder[task] = entry
        heappush(self.pq, entry)

    def remove_task(self, task):
        'Mark an existing task as REMOVED.  Raise KeyError if not found.'
        entry = self.entry_finder.pop(task)
        entry[-1] = PriorityQueue.REMOVED

    def pop_task(self):
        'Remove and return the lowest priority task. Raise KeyError if empty.'
        while self.pq:
            priority, count, task = heappop(self.pq)
            if task is not PriorityQueue.REMOVED:
                del self.entry_finder[task]
                return task
        raise KeyError('pop from an empty priority queue')


def dijkstra(adjacency_matrix: Matrix, start_node: int, end_node: int) -> int:
    dist = {node: inf for node in adjacency_matrix.indexes()}
    dist[start_node] = 0
    unvisited = PriorityQueue(dist)
    while unvisited:
        visiting = unvisited.pop_task()
        if visiting == end_node:
            return dist[end_node]
        for neighbor in adjacency_matrix.adjacent(visiting):
            new_dist = dist[visiting] + adjacency_matrix[neighbor]
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                unvisited.remove_task(neighbor)
                unvisited.add_task(neighbor, new_dist)


# chapter = '1a'
# with open(f'strats/{chapter}/{chapter}.json') as f:
#     strats = json.load(f)
#
# nodes = {}
# for strat in strats:
#     nodes[strat['start']] = None
#     nodes[strat['end']] = None
# node_indexes = {node: i for i, node in enumerate(nodes.keys())}
# print(node_indexes)
# print(node_indexes['1 start'], node_indexes['end end'])
# graph = Matrix.from_dimensions(len(nodes), len(nodes))
# for strat in strats:
#     start_index = node_indexes[strat['start']]
#     end_index = node_indexes[strat['end']]
#     graph[(start_index, end_index)] = 1  # replace with weight
# print(str(graph))