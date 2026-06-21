# frozen_string_literal: true

# A simple data class representing a single life event.
# Carries only data — no display, storage, or processing logic (SRP).
class Event
  attr_reader :type, :description, :duration, :timestamp

  def initialize(type:, description:, duration:, timestamp: Time.now)
    @type        = type
    @description = description
    @duration    = duration          # in minutes
    @timestamp   = timestamp
  end

  # Human-readable one-liner used by multiple outputs.
  def to_s
    formatted_time = timestamp.strftime("%Y-%m-%d %H:%M")
    "[#{formatted_time}] #{type.upcase} — #{description} (#{duration} min)"
  end
end
