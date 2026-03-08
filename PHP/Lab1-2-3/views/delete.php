<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
if(isset($_REQUEST["StudentID"])) {
    header("Location: ../controlers/operation.php?delete=1&StudentID=" . urlencode($_REQUEST["StudentID"]));
} else {
    header("Location: list.php?error=INVALID_STUDENT_ID");
}
exit;
