# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Clear existing data
Post.destroy_all
User.destroy_all

# Create Users
user1 = User.create!(name: "Noor Elmobashar", email: "noor@example.com")
user2 = User.create!(name: "Ahmed Ali", email: "ahmed@example.com")
user3 = User.create!(name: "Sara Mohamed", email: "sara@example.com")

# Create Posts (One-to-Many: User 1:M Post)
Post.create!(title: "First Post", body: "This is the first post content.", user: user1)
Post.create!(title: "Second Post", body: "This is the second post content.", user: user1)
Post.create!(title: "Third Post", body: "This is the third post content.", user: user2)
Post.create!(title: "Fourth Post", body: "This is the fourth post content.", user: user3)

puts "Seeded #{User.count} users and #{Post.count} posts."
