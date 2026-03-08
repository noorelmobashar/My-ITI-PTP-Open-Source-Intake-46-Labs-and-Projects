<?php

require_once __DIR__ . '/../models/DBConnection.php';

class User
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = DBConnection::getInstance()->getConnection();
    }

    public function getById(int $id)
    {
        $stm = $this->conn->prepare('SELECT * FROM student s JOIN credentials c ON s.studentID = c.studentID WHERE s.studentID = ?');
        $stm->execute([$id]);
        return $stm->fetch(PDO::FETCH_ASSOC);
    }

    public function create(array $newUser, ?string $profilePic): bool
    {
        $contactInfo = json_encode([
            'address' => $newUser['address'],
            'phone' => $newUser['phone'],
        ]);

        $stm = $this->conn->prepare('INSERT INTO student (FirstName, LastName, Gender, BirthDate, ContactInfo, profile_pic) VALUES (?, ?, ?, ?, ?, ?)');
        $res = $stm->execute([
            $newUser['f_name'],
            $newUser['l_name'],
            $newUser['gender'],
            $newUser['birthdate'],
            $contactInfo,
            $profilePic,
        ]);

        if ($res) {
            $stm = $this->conn->prepare('INSERT INTO credentials VALUES (?, ?, ?)');
            $stm->execute([
                $this->conn->lastInsertId(),
                $newUser['username'],
                $newUser['password'],
            ]);
        }

        return $res;
    }

    public function update(array $newUser, ?string $profilePic): bool
    {
        $contactInfo = json_encode([
            'address' => $newUser['address'],
            'phone' => $newUser['phone'],
        ]);

        $stm = $this->conn->prepare('UPDATE student SET FirstName = ?, LastName = ?, Gender = ?, BirthDate = ?, ContactInfo = ?, profile_pic = ? WHERE StudentID = ?');
        $res = $stm->execute([
            $newUser['f_name'],
            $newUser['l_name'],
            $newUser['gender'],
            $newUser['birthdate'],
            $contactInfo,
            $profilePic,
            $newUser['StudentID'],
        ]);

        $stm = $this->conn->prepare('UPDATE credentials SET password = ? WHERE StudentID = ?');
        $stm->execute([
            $newUser['password'],
            $newUser['StudentID'],
        ]);

        return $res;
    }

    public function delete(int $id): bool
    {
        $stm = $this->conn->prepare('DELETE FROM student WHERE studentID = ?');
        return $stm->execute([$id]);
    }

    public function getAll(): array
    {
        $stm = $this->conn->prepare('SELECT * FROM student s JOIN credentials c ON s.studentID = c.studentID');
        $stm->execute();
        return $stm->fetchAll(PDO::FETCH_ASSOC);
    }

    public function usernameExists(string $username)
    {
        $stm = $this->conn->prepare('SELECT * FROM credentials WHERE username = ?');
        $stm->execute([$username]);
        return $stm->fetch(PDO::FETCH_ASSOC);
    }

    public function getCurrentProfilePic(int $id)
    {
        $stm = $this->conn->prepare('SELECT profile_pic FROM student WHERE StudentID = ?');
        $stm->execute([$id]);
        $currentUser = $stm->fetch(PDO::FETCH_ASSOC);
        return $currentUser ? $currentUser['profile_pic'] : null;
    }
}
