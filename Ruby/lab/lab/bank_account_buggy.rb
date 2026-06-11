# =============================================================================
# Phase 2 — The AI Audit: Bank Account
#
# This script was "written by AI." It has exactly 5 mistakes:
#   - 2 syntax errors  (Ruby won't even run until these are fixed)
#   - 3 logic flaws    (Ruby runs but produces wrong results)
#
# Your job: find all 5, add a comment above each bug, then fix them.
# Use this format for your comments:
#   # BUG [n]: [what is wrong] → FIX: [what it should be]
# =============================================================================

class BankAccount
  attr_reader :balance, :owner

  def initialize(owner, initial_balance)
    @owner   = owner
    @balance = initial_balance
    @rate    = 0.05
  end

  def deposit(amount)
    if amount > 0
      # BUG [1]: The balance is subtracted instead of added. FIX: Change '-' to '+'
      @balance += amount
      puts "  New balance: $#{"%.2f" % @balance}"
    else
      puts "  Error: Deposit amount must be positive."
    end
  end

  # BUG [2]: No validation for withdrawal amount. FIX: Add validation for withdrawal amount
  def withdraw(amount)
    if amount > 0 && amount <= @balance
      @balance -= amount
      puts "  New balance: $#{"%.2f" % @balance}"
    else
      puts "  Error: Invalid withdrawal amount."
    end
  # BUG [3]: Missing 'end' for the method. FIX: Add 'end' to close the method definition
  end

  def apply_interest
    # BUG [4]: Interest is applied as a flat amount instead of a percentage. FIX: Change the calculation to multiply by (1 + rate)
    @balance = @balance * (1 + @rate)
    puts "  New balance: $#{"%.2f" % @balance}"
  end

  def display_info
    puts "Owner  : #{@owner}"
    # BUG [5]: Added curly bracees instead of parentheses. FIX: Change '{}' to '()'
    puts "Balance: $#{("%.2f" % @balance)}"
  end
end

# --- Script entry point ---

account = BankAccount.new("Alice", 1000)

puts "=== Account Info ==="
account.display_info
puts

puts "Depositing $500..."
account.deposit(500)
puts

puts "Withdrawing $200..."
account.withdraw(200)
puts

puts "Applying 5% interest..."
account.apply_interest
puts

puts "Attempting to overdraw $2000..."
account.withdraw(2000)
puts
account.display_info
