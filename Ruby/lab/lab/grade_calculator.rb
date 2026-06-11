puts "Welcome to the Grade Calculator!"
print "How many scores?: "

num_scores = gets.chomp.to_i
scores = []

num_scores.times do |i|
  print "Enter score #{i + 1}: "
  score = gets.chomp.to_f
  scores << score
end

average = scores.sum / scores.size
letter_grade = nil
highest_score = scores.max
lowest_score = scores.min

if average >= 90
  letter_grade = 'A'
elsif average >= 80
  letter_grade = 'B'
elsif average >= 70
  letter_grade = 'C'
elsif average >= 60
  letter_grade = 'D'
else
  letter_grade = 'F'
end

puts "Average Score: #{average.round(2)}"
puts "Letter Grade: #{letter_grade}"
puts "Highest Score: #{highest_score}"
puts "Lowest Score: #{lowest_score}"