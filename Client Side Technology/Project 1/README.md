# Online Examination System

## Overview
This project is a comprehensive web-based Online Examination System developed using vanilla JavaScript. It provides a robust platform for educational assessment, featuring distinct interfaces for Teachers and Students. The system utilizes the browser's LocalStorage for data persistence, ensuring a seamless experience without the need for a backend server during this phase of development.

## Features

### 👨‍🏫 Teacher Module
The teacher interface is designed for exam management and student performance tracking.
- **Dashboard**: A central hub to view all created exams and their status.
- **Exam Management**:
  - **Create Exams**: Teachers can create detailed exams with custom titles, durations, and difficulty levels.
  - **Question Bank**: Add multiple-choice questions with support for images, custom scores, and randomized answer choices.
  - **Edit/Delete**: Full control to modify existing exams or remove them.
- **Student Monitoring**: View detailed results and scores for students who have taken the exams.

### 👨‍🎓 Student Module
The student interface focuses on a user-friendly assessment experience.
- **Authentication**: Secure registration and login system.
- **Dashboard**: View available exams and track personal progress.
- **Exam Interface**:
  - **Timed Exams**: Real-time countdown timer that automatically submits the exam when time expires.
  - **Randomized Questions**: Questions are presented in a randomized order to ensure integrity.
  - **Immediate Feedback**: Instant scoring and result display upon submission.
- **Profile Management**: View and update personal profile information.

## 🛠️ Technologies Used
- **HTML5**: For semantic structure and layout.
- **CSS3**: Custom styling combined with Bootstrap 5 for a responsive and modern design.
- **JavaScript (ES6+)**: Core logic for state management, DOM manipulation, and exam flow control.
- **LocalStorage**: Used as a client-side database to store user data, exams, and results persistently.

## ⚙️ Technical Highlights

### 🖼️ Image Upload Integration
The system leverages the **ImgBB API** for efficient image hosting.
- **Endpoint**: `https://api.imgbb.com/1/upload`
- **Process**: When a teacher uploads an image for a question or a student uploads a profile picture, the file is sent via a POST request to ImgBB.
- **Storage**: The API returns a direct URL to the image, which is then stored in the application's LocalStorage. This approach keeps the local data size manageable while ensuring images are accessible.

### 📝 Exam Modification & Data Integrity
The system is designed to handle exam updates without compromising historical data.
- **Scenario**: A teacher modifies an exam (e.g., changes a correct answer or edits a question text) after some students have already completed it.
- **Behavior**: **Past results remain unchanged.** The system calculates and finalizes a student's score at the exact moment of submission. These scores are stored permanently in the student's record.
- **Impact**: Edits to an exam only affect **future** attempts. This ensures that students who have already been graded retain their original scores, preserving the integrity of the assessment history.

## 🚀 Getting Started

1. **Clone or Download** the project repository.
2. **Open** the project folder.
3. **Launch** the application by opening `index.html` in your preferred web browser.

## 🔑 Default Credentials

To access the Teacher Dashboard and test the administrative features, please use one of the following pre-configured accounts:

| Role | Username | Password |
|------|----------|----------|
| **Teacher** | `noorelmobashar` | `12345678a` |
| **Teacher** | `ahmedelsayed` | `abcdefgh1` |

*Note: You can also register a new Student account via the "Register" page.*

## 📞 Contact

For any inquiries or feedback regarding this project, please contact:

**Email**: [nooralmobasher1@gmail.com](mailto:nooralmobasher1@gmail.com)
