# frozen_string_literal: true

require_relative "event"
require_relative "event_router"
require_relative "handlers/console_handler"
require_relative "handlers/file_handler"
require_relative "handlers/stats_handler"

# ── Wire up the pipeline (the ONLY place concrete classes are mentioned) ──
router = EventRouter.new
router.register(ConsoleHandler.new)
router.register(FileHandler.new)
router.register(StatsHandler.new)

# ── Event type definitions ──
EVENT_TYPES = {
  "1" => "work",
  "2" => "study",
  "3" => "exercise",
  "4" => "meal"
}.freeze

# ── Menu loop ──
loop do
  puts "\n=== LifeTrack ==="
  puts "1. Log a work session"
  puts "2. Log a study session"
  puts "3. Log an exercise session"
  puts "4. Log a meal"
  puts "5. Exit"
  print "\nChoose an option: "

  choice = gets&.chomp

  break if choice == "5" || choice.nil?

  type = EVENT_TYPES[choice]
  unless type
    puts "Invalid option. Please choose 1–5."
    next
  end

  print "Description: "
  description = gets&.chomp
  break if description.nil?

  print "Duration (minutes): "
  duration_input = gets&.chomp
  break if duration_input.nil?

  duration = duration_input.to_i
  if duration <= 0
    puts "Duration must be a positive number."
    next
  end

  event = Event.new(type: type, description: description, duration: duration)
  router.dispatch(event)
end

puts "\nGoodbye! 👋"
