# frozen_string_literal: true

require_relative "../handler"

# Collects events silently and prints a statistics summary.
# The summary fires automatically on exit via at_exit — the menu loop
# never calls it directly (as required by the brief).
# One responsibility only (SRP).
class StatsHandler < Handler
  def initialize
    @events = []
    # Register the summary to fire automatically when the program exits.
    at_exit { print_summary }
  end

  def call(event)
    @events << event
  end

  private

  def print_summary
    return if @events.empty?

    puts "\n#{"=" * 40}"
    puts "       📊  LifeTrack Session Stats"
    puts "=" * 40

    total_events   = @events.size
    total_duration = @events.sum(&:duration)

    # Group events by type
    by_type = @events.group_by(&:type)

    puts "  Total events logged : #{total_events}"
    puts "  Total time tracked  : #{total_duration} min"
    puts ""

    by_type.each do |type, events|
      count    = events.size
      duration = events.sum(&:duration)
      puts "  #{type.capitalize}:"
      puts "    Sessions : #{count}"
      puts "    Duration : #{duration} min"
      puts ""
    end

    puts "=" * 40
  end
end
