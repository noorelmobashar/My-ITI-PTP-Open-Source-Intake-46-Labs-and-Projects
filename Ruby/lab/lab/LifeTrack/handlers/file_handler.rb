# frozen_string_literal: true

require_relative "../handler"

# Appends the event to a plain-text log file.
# One responsibility only — no terminal output, no stats (SRP).
class FileHandler < Handler
  DEFAULT_LOG = "life_track.log"

  def initialize(path: DEFAULT_LOG)
    @path = path
  end

  def call(event)
    File.open(@path, "a") do |f|
      f.puts event.to_s
    end
  end
end
