<?php

class DBConnection
{
    private static ?DBConnection $instance = null;
    private PDO $connection;

    private function __construct()
    {
        $this->connection = new PDO('mysql:host=127.0.0.1;dbname=iti', 'noor', 'noor');
    }

    public static function getInstance(): DBConnection
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function getConnection(): PDO
    {
        return $this->connection;
    }
}
