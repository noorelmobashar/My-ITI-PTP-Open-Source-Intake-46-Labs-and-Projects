<?php

require_once __DIR__ . '/DBConnection.php';

class Authenticate
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = DBConnection::getInstance()->getConnection();
    }

    public function login(string $username, string $password)
    {
        $stm = $this->conn->prepare('SELECT s.*, c.username, c.password FROM credentials c JOIN student s ON s.StudentID = c.StudentID WHERE c.username = ?');
        $stm->execute([$username]);
        $user = $stm->fetch(PDO::FETCH_ASSOC);

        if (!$user || $password != $user['password']) {
            return false;
        }

        unset($user['password']);
        return $user;
    }

    public function logout(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        session_unset();
        session_destroy();
    }
}
