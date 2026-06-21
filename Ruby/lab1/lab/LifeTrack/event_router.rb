# frozen_string_literal: true

require_relative "handler"

# The Observer / Router.
# Manages a list of Handler objects and dispatches events to all of them.
# It depends ONLY on the Handler abstraction — never on any concrete class (DIP).
# Adding a new output never requires editing this file (OCP).
class EventRouter
  def initialize
    @handlers = []
  end

  # Register a handler. Validates that it is a Handler subclass (Liskov).
  def register(handler)
    unless handler.is_a?(Handler)
      raise ArgumentError, "#{handler.class} is not a Handler — cannot register"
    end

    @handlers << handler
  end

  # Dispatch an event to every registered handler (Observer).
  def dispatch(event)
    @handlers.each { |h| h.call(event) }
  end
end
