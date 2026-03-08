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
    <title>Student Profile | ITI</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        :root {
            --iti-red: #a32a29; /* Official ITI Maroon */
            --iti-black: #212529;
        }
        body { background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }

        .iti-header {
            background-color: var(--iti-red);
            color: white;
            border-bottom: 4px solid var(--iti-black);
        }
        .profile-card {
            border: none;
            border-radius: 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .info-label {
            color: var(--iti-red);
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 1px;
        }
        .info-value {
            font-size: 1.1rem;
            margin-bottom: 1.2rem;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .btn-iti {
            background-color: var(--iti-black);
            color: white;
            border-radius: 0;
            transition: 0.3s;
        }
        .btn-iti:hover {
            background-color: var(--iti-red);
            color: white;
        }
    </style>
</head>
<body>
<?php include('navbar.php'); ?>
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card profile-card">
                <?php
                require('../controlers/user.php');

                // Fetch data
                $userModel = new User();
                $data = $userModel->getById((int) $_REQUEST['StudentID']);

                // Fix: Accessing by column names (since you used PDO::FETCH_ASSOC usually)
                $f_name = $data['FirstName'] ?? 'N/A';
                $l_name = $data['LastName'] ?? 'N/A';
                $gender = strtolower($data['Gender'] ?? 'male');
                $dept   = $data['Department'] ?? 'OpenSource';

                // Fix: Decode JSON for Address
                $contact = json_decode($data['ContactInfo'] ?? '{}', true);
                $address = $contact['address'] ?? 'No Address Provided';
                $profilePic = $data['profile_pic'] ?? null;

                $greeting = ($gender == 'male') ? 'Mr.' : 'Ms.';
                ?>

                <div class="card-header iti-header py-4 text-center">
                    <h2 class="mb-0">STUDENT PROFILE</h2>
                    <p class="mb-0 opacity-75">Information Technology Institute</p>
                </div>

                <div class="card-body p-5">
                    <div class="row">
                        <div class="col-md-4 text-center border-end">
                            <?php
                            $profileSrc = $profilePic
                                ? htmlspecialchars($profilePic)
                                : "https://ui-avatars.com/api/?name=" . urlencode($f_name . " " . $l_name) . "&background=a32a29&color=fff&size=150";
                            ?>
                            <img src="<?php echo $profileSrc; ?>"
                                 class="img-fluid rounded-circle mb-3 shadow-sm" style="width: 20vh; height: 20vh;" alt="Profile">
                            <h4 class="fw-bold"><?php echo "$greeting $f_name"; ?></h4>
                            <span class="badge bg-dark"><?php echo $dept; ?></span>
                        </div>

                        <div class="col-md-8 ps-md-5">
                            <div class="info-label">Full Name</div>
                            <div class="info-value"><?php echo "$f_name $l_name"; ?></div>

                            <div class="info-label">Address</div>
                            <div class="info-value"><?php echo $address; ?></div>

                            <div class="info-label">Department</div>
                            <div class="info-value"><?php echo $dept; ?></div>

                            <div class="info-label">Gender</div>
                            <div class="info-value text-capitalize"><?php echo $gender; ?></div>
                        </div>
                    </div>
                </div>

                <div class="card-footer bg-white border-0 text-center pb-4">
                    <a href="list.php" class="btn btn-iti px-4">Back to List</a>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>
