<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Database</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<?php include('navbar.php'); ?>
<div class="container-fluid py-5 px-md-5">
    <div class="card shadow-sm border-0 rounded">

        <div class="card-header bg-danger text-white text-center py-3">
            <h4 class="mb-0">Registered Users</h4>
        </div>

        <div class="card-body p-4">
            <div class="table-responsive">
                <table class="table table-striped table-hover table-bordered align-middle text-center mb-0">
                    <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>BirthDate</th>
                        <th>Username</th>
                        <th>Department</th>
                        <th>Actions</th> </tr>
                    </thead>
                    <tbody>
                    <?php

                    require('../controlers/user.php');
                    $userModel = new User();
                    $data = $userModel->getAll();

                    foreach($data as $row){
                        $viewLink = 'view.php?StudentID=' . "{$row['StudentID']}";
                        $deleteLink = '../controlers/operation.php?delete=1&StudentID=' . "{$row['StudentID']}";
                        $editLink = 'edit.php?StudentID=' . "{$row['StudentID']}";
                        $contactInfo = json_decode($row['ContactInfo'], true);
                        echo "<tr>";
                        echo    "<td>{$row['StudentID']}</td>" .
                                "<td>{$row['FirstName']}</td>" .
                                "<td>{$row['LastName']}</td>" .
                                "<td>{$contactInfo["address"]}</td>" .
                                "<td>{$contactInfo["phone"]}</td>" .
                                "<td>{$row['Gender']}</td>" .
                                "<td>{$row['BirthDate']}</td>" .
                                "<td>{$row['username']}</td>" .
                                "<td>{$row['Department']}</td>";

                        // Added Bootstrap buttons before closing the row
                        echo "<td>
                    
                                <div class='btn-group btn-group-sm text-nowrap' role='group' aria-label='Action Buttons'>
                                    <a href=$viewLink class='btn btn-info text-white'>View</a>
                                    <a href=$editLink class='btn btn-warning text-dark'>Update</a>
                                    <a href=$deleteLink class='btn btn-danger'>Delete</a>
                                </div>
                              </td>";

                        echo "</tr>";
                        $x=0;

                    }

                    ?>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
