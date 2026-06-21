# frozen_string_literal: true

require_relative "../handler"

# Prints the event to the terminal.
# One responsibility only — no file I/O, no stats (SRP).
class ConsoleHandler < Handler
  def call(event)
    puts "\n#{event}"
    puts "✓ Event logged."
  end
end
