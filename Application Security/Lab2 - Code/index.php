<?php
$conn = new mysqli("127.0.0.1", "noor", "noor", "application_security_course");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$id = $_GET['id'];

$sql = "SELECT courseid, coursename FROM courses WHERE courseid=$id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "Course ID: " . $row["courseid"]. " - Name: " . $row["coursename"]. "<br>";
    }
} else {
    echo "0 results";
}

$conn->close();
?>
