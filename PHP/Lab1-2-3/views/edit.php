<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
require('../controlers/user.php');

$userModel = new User();
$userData = $userModel->getById((int) $_REQUEST['StudentID']);
$f_name = $userData['FirstName'];
$l_name = $userData['LastName'];
$gender = $userData['Gender'];
$birthdate = $userData['BirthDate'];
$dept = $userData['Department'];
$username_val = $userData['username'];
$password_val = $userData['password'];
$contact = json_decode($userData['ContactInfo'], true);
$address = $contact['address'];
$phone = $contact['phone'];
$profilePic = $userData['profile_pic'] ?? null;
$errors = [];
if (isset($_GET['errors'])) {
    $errors = json_decode($_GET['errors'], true);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Student | ITI</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        :root {
            --iti-red: #a32a29;
            --iti-black: #212529;
        }
        .iti-header {
            background-color: var(--iti-red);
            color: white;
            border-bottom: 4px solid var(--iti-black);
        }
        .btn-iti {
            background-color: var(--iti-black);
            color: white;
            border-radius: 0;
            font-weight: bold;
        }
        .btn-iti:hover {
            background-color: var(--iti-red);
            color: white;
        }
        .form-label { color: var(--iti-black); }
        .card { border-radius: 0; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    </style>
</head>
<body class="bg-light">
<?php include('navbar.php'); ?>
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">

            <div class="card shadow-sm">
                <div class="card-header iti-header text-center py-3">
                    <h4 class="mb-0 text-uppercase">Edit Student Information</h4>
                </div>

                <div class="card-body p-4 p-md-5">
                    <form action="../controlers/operation.php" method="post" enctype="multipart/form-data">
                        <input type="hidden" name="StudentID" value="<?php echo $_REQUEST['StudentID']; ?>">

                        <div class="mb-4 bg-light p-3 border">
                            <label for="profile_image" class="form-label fw-bold">Profile Image</label>
                            <div class="d-flex align-items-center gap-3 mb-2">
                                <?php
                                $previewSrc = $profilePic
                                    ? htmlspecialchars($profilePic)
                                    : "https://ui-avatars.com/api/?name=" . urlencode($f_name . " " . $l_name) . "&background=a32a29&color=fff&size=64";
                                ?>
                                <img src="<?php echo $previewSrc; ?>" alt="Current Profile" class="rounded-circle border" style="width: 64px; height: 64px; object-fit: cover;">
                                <small class="text-muted">Leave empty to keep the current image.</small>
                            </div>
                            <input class="form-control <?php echo isset($errors['profile_image']) ? 'is-invalid' : ''; ?>"
                                   type="file"
                                   id="profile_image"
                                   name="profile_image"
                                   accept="image/png, image/jpeg, image/jpg">
                            <?php if(isset($errors['profile_image'])): ?>
                                <div class="invalid-feedback"><?php echo htmlspecialchars($errors['profile_image']); ?></div>
                            <?php endif; ?>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6 mb-3 mb-md-0">
                                <label for="f_name" class="form-label fw-bold">First Name</label>
                                <input type="text" class="form-control <?php echo isset($errors['f_name']) ? 'is-invalid' : ''; ?>" id="f_name" name="f_name" value="<?php echo htmlspecialchars($f_name); ?>" required>
                                <?php if(isset($errors['f_name'])): ?>
                                    <div class="invalid-feedback"><?php echo htmlspecialchars($errors['f_name']); ?></div>
                                <?php endif; ?>
                            </div>
                            <div class="col-md-6">
                                <label for="l_name" class="form-label fw-bold">Last Name</label>
                                <input type="text" class="form-control <?php echo isset($errors['l_name']) ? 'is-invalid' : ''; ?>" id="l_name" name="l_name" value="<?php echo htmlspecialchars($l_name); ?>">
                                <?php if(isset($errors['l_name'])): ?>
                                    <div class="invalid-feedback"><?php echo htmlspecialchars($errors['l_name']); ?></div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="address" class="form-label fw-bold">Address</label>
                            <textarea class="form-control <?php echo isset($errors['address']) ? 'is-invalid' : ''; ?>" id="address" name="address" rows="3" required><?php echo htmlspecialchars($address); ?></textarea>
                            <?php if(isset($errors['address'])): ?>
                                <div class="invalid-feedback"><?php echo htmlspecialchars($errors['address']); ?></div>
                            <?php endif; ?>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6 mb-3 mb-md-0">
                                <label for="phone" class="form-label fw-bold">Phone Number (Egypt)</label>
                                <input type="tel" class="form-control <?php echo isset($errors['phone']) ? 'is-invalid' : ''; ?>" id="phone" name="phone" pattern="^01[0125][0-9]{8}$" value="<?php echo htmlspecialchars($phone); ?>" required>
                                <?php if(isset($errors['phone'])): ?>
                                    <div class="invalid-feedback"><?php echo htmlspecialchars($errors['phone']); ?></div>
                                <?php endif; ?>
                            </div>
                            <div class="col-md-6">
                                <label for="birthdate" class="form-label fw-bold">Birth Date</label>
                                <input type="date" class="form-control <?php echo isset($errors['birthdate']) ? 'is-invalid' : ''; ?>" id="birthdate" name="birthdate" value="<?php echo $birthdate; ?>" required>
                                <?php if(isset($errors['birthdate'])): ?>
                                    <div class="invalid-feedback"><?php echo htmlspecialchars($errors['birthdate']); ?></div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold d-block">Gender</label>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input <?php echo isset($errors['gender']) ? 'is-invalid' : ''; ?>" type="radio" name="gender" id="genderMale" value="male" <?php if(strtolower($gender) == 'male') echo 'checked'; ?> required>
                                <label class="form-check-label" for="genderMale">Male</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input <?php echo isset($errors['gender']) ? 'is-invalid' : ''; ?>" type="radio" name="gender" id="genderFemale" value="female" <?php if(strtolower($gender) == 'female') echo 'checked'; ?> required>
                                <label class="form-check-label" for="genderFemale">Female</label>
                            </div>
                            <?php if(isset($errors['gender'])): ?>
                                <div class="text-danger small fw-bold d-block"><?php echo htmlspecialchars($errors['gender']); ?></div>
                            <?php endif; ?>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6 mb-3 mb-md-0">
                                <label for="username" class="form-label fw-bold">Username</label>
                                <input type="text" class="form-control bg-light" id="username" name="username" value="<?php echo htmlspecialchars($username_val); ?>" readonly required>
                            </div>
                            <div class="col-md-6">
                                <label for="password" class="form-label fw-bold">Password</label>
                                <input type="password" class="form-control <?php echo isset($errors['password']) ? 'is-invalid' : ''; ?>" id="password" name="password" value="<?php echo htmlspecialchars($password_val); ?>" required>
                                <?php if(isset($errors['password'])): ?>
                                    <div class="invalid-feedback"><?php echo htmlspecialchars($errors['password']); ?></div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="department" class="form-label fw-bold">Department</label>
                            <input type="text" class="form-control bg-light" id="department" name="department" value="<?php echo $dept; ?>" readonly required>
                        </div>

                        <div class="d-grid gap-3 d-md-flex justify-content-md-center mt-4">
                            <button type="submit" name="edit" class="btn btn-iti px-5 py-2">SAVE CHANGES</button>
                            <a href="list.php" class="btn btn-outline-secondary px-5 py-2">CANCEL</a>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
