# frozen_string_literal: true

# The shared interface (abstract handler) that every output must implement.
# Has exactly one method — Interface Segregation Principle.
# Raises NotImplementedError at runtime if a subclass forgets to implement it.
class Handler
  # Called by the EventRouter for every dispatched event.
  # Subclasses MUST override this method.
  def call(event)
    raise NotImplementedError, "#{self.class} must implement the `call` method"
  end
end
