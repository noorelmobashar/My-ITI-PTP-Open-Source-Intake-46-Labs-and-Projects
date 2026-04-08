import importlib
import json
import sys
import tempfile
from contextlib import contextmanager, redirect_stdout
from io import StringIO
from pathlib import Path

import database
from queue import Queue


def capture_output(callable_obj, *args, **kwargs):
	buffer = StringIO()
	with redirect_stdout(buffer):
		result = callable_obj(*args, **kwargs)
	return result, buffer.getvalue()


@contextmanager
def isolated_queue_advanced_module():
	original_database_path = database.DATABASE_PATH

	with tempfile.TemporaryDirectory() as temp_dir:
		database.DATABASE_PATH = Path(temp_dir) / "models" / "database.json"
		sys.modules.pop("queue_advanced", None)
		queue_advanced = importlib.import_module("queue_advanced")

		try:
			yield queue_advanced, database.DATABASE_PATH
		finally:
			database.DATABASE_PATH = original_database_path
			sys.modules.pop("queue_advanced", None)


def test_queue_basic_operations():
	queue = Queue()

	assert queue.is_empty() == 1

	queue.insert("a")
	queue.insert("b")

	assert queue.is_empty() == 0
	assert queue.pop() == "a"
	assert queue.pop() == "b"
	assert queue.pop() is None
	assert queue.is_empty() == 1


def test_queue_advanced_persistence_and_bounds():
	with isolated_queue_advanced_module() as (queue_advanced, database_path):
		QueueAdvanced = queue_advanced.QueueAdvanced

		queue = QueueAdvanced("orders", 2)
		queue.insert("one")
		queue.insert("two")

		_, full_output = capture_output(queue.insert, "three")
		assert "WARNING: Queue is full" in full_output

		saved_data = json.loads(database_path.read_text())
		assert saved_data["orders"]["name"] == "orders"
		assert saved_data["orders"]["maxsize"] == 2
		assert saved_data["orders"]["items"] == ["one", "two"]

		assert queue.pop() == "one"
		assert queue.pop() == "two"

		_, empty_output = capture_output(queue.pop)
		assert "WARNING: Empty Queue" in empty_output

		reloaded_data = QueueAdvanced.load()
		assert reloaded_data["orders"]["items"] == []


def run_tests():
	test_queue_basic_operations()
	test_queue_advanced_persistence_and_bounds()
	print("All tests passed")


if __name__ == "__main__":
	run_tests()
