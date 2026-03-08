<?php
    session_start();
    if(isset($_SESSION["user_id"]))
    {
        header("Location: ../views/list.php");
        exit;
    }
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
    <title>Student Registration | ITI</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        :root {
            --iti-red: #a32a29; /* Official ITI Maroon */
            --iti-black: #212529;
        }
        body {
            background-color: #f4f4f4;
        }
        .iti-header {
            background-color: var(--iti-red);
            color: white;
            border-bottom: 4px solid var(--iti-black);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .card {
            border: none;
            border-radius: 0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .form-label {
            color: var(--iti-black);
        }
        .btn-iti-submit {
            background-color: var(--iti-black);
            color: white;
            border-radius: 0;
            font-weight: bold;
            transition: 0.3s;
        }
        .btn-iti-submit:hover {
            background-color: var(--iti-red);
            color: white;
        }
        .btn-iti-outline {
            border: 1px solid var(--iti-black);
            color: var(--iti-black);
            border-radius: 0;
        }
        .btn-iti-outline:hover {
            background-color: #eee;
        }
        #code {
            background-color: var(--iti-red) !important;
        }
    </style>
    <script src="script.js" defer></script>
</head>
<body>
<?php include('navbar.php'); ?>
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">

            <div class="card shadow-sm">
                <div class="card-header iti-header text-center py-3">
                    <h4 class="mb-0">New Student Registration</h4>
                </div>

                <div class="card-body p-4 p-md-5">
                    <form action="../controlers/operation.php" method="post" enctype="multipart/form-data">

                        <div class="mb-4 bg-light p-3 border">
                            <label for="profile_image" class="form-label fw-bold">Profile Image</label>
                            <input class="form-control <?php echo isset($errors['profile_image']) ? 'is-invalid' : ''; ?>"
                                   type="file"
                                   id="profile_image"
                                   name="profile_image"
                                   accept="image/png, image/jpeg, image/jpg"
                                   >
                            <div class="form-text small">Accepted formats: JPG, JPEG, PNG. Optional.</div>
                            <?php if(isset($errors['profile_image'])): ?>
                                <div class="invalid-feedback fw-bold"><?php echo htmlspecialchars($errors['profile_image']); ?></div>
                            <?php endif; ?>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6 mb-3 mb-md-0">
                                <label for="f_name" class="form-label fw-bold">First Name</label>
                                <input type="text" class="form-control <?php echo isset($errors['f_name']) ? 'is-invalid' : ''; ?>" id="f_name" name="f_name" required>
                                <?php if(isset($errors['f_name'])): ?>
                                    <div class="invalid-feedback"><?php echo htmlspecialchars($errors['f_name']); ?></div>
                                <?php endif; ?>
                            </div>
                            <div class="col-md-6">
                                <label for="l_name" class="form-label fw-bold">Last Name</label>
                                <input type="text" class="form-control <?php echo isset($errors['l_name']) ? 'is-invalid' : ''; ?>" id="l_name" name="l_name" required>
                                <?php if(isset($errors['l_name'])): ?>
                                    <div class="invalid-feedback"><?php echo htmlspecialchars($errors['l_name']); ?></div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="address" class="form-label fw-bold">Address</label>
                            <textarea class="form-control <?php echo isset($errors['address']) ? 'is-invalid' : ''; ?>" id="address" name="address" rows="2" required></textarea>
                            <?php if(isset($errors['address'])): ?>
                                <div class="invalid-feedback"><?php echo htmlspecialchars($errors['address']); ?></div>
                            <?php endif; ?>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold d-block">Gender</label>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input <?php echo isset($errors['gender']) ? 'is-invalid' : ''; ?>" type="radio" name="gender" id="genderMale" value="male" required>
                                <label class="form-check-label" for="genderMale">Male</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input <?php echo isset($errors['gender']) ? 'is-invalid' : ''; ?>" type="radio" name="gender" id="genderFemale" value="female" required>
                                <label class="form-check-label" for="genderFemale">Female</label>
                            </div>
                            <?php if(isset($errors['gender'])): ?>
                                <div class="text-danger small fw-bold d-block"><?php echo htmlspecialchars($errors['gender']); ?></div>
                            <?php endif; ?>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6 mb-3 mb-md-0">
                                <label for="phone" class="form-label fw-bold">Phone Number</label>
                                <input type="tel" class="form-control <?php echo isset($errors['phone']) ? 'is-invalid' : ''; ?>" id="phone" name="phone"
                                       pattern="^01[0125][0-9]{8}$"
                                       placeholder="01xxxxxxxxx"
                                       title="Please enter a valid 11-digit Egyptian phone number"
                                       required>
                                <?php if(isset($errors['phone'])): ?>
                                    <div class="invalid-feedback"><?php echo htmlspecialchars($errors['phone']); ?></div>
                                <?php endif; ?>
                            </div>
                            <div class="col-md-6">
                                <label for="birthdate" class="form-label fw-bold">Birth Date</label>
                                <input type="date" class="form-control <?php echo isset($errors['birthdate']) ? 'is-invalid' : ''; ?>" id="birthdate" name="birthdate" required>
                                <?php if(isset($errors['birthdate'])): ?>
                                    <div class="invalid-feedback"><?php echo htmlspecialchars($errors['birthdate']); ?></div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6 mb-3 mb-md-0">
                                <label for="username" class="form-label fw-bold">Username</label>
                                <input type="text" class="form-control <?php echo isset($errors['username']) ? 'is-invalid' : ''; ?>" id="username" name="username" required>
                                <?php if(isset($errors['username'])): ?>
                                    <div class="invalid-feedback"><?php echo htmlspecialchars($errors['username']); ?></div>
                                <?php endif; ?>
                            </div>
                            <div class="col-md-6">
                                <label for="password" class="form-label fw-bold">Password</label>
                                <input type="password" class="form-control <?php echo isset($errors['password']) ? 'is-invalid' : ''; ?>" id="password" name="password" required>
                                <?php if(isset($errors['password'])): ?>
                                    <div class="invalid-feedback"><?php echo htmlspecialchars($errors['password']); ?></div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="department" class="form-label fw-bold">Department</label>
                            <input type="text" class="form-control bg-light" id="department" name="department" value="OpenSource" readonly required>
                        </div>

                        <hr class="my-4">

                        <div class="mb-4 text-center bg-light p-3 border rounded-0">
                            <label class="form-label fw-bold me-2">
                                Security Code: <span id="code" class="badge fs-6 ms-1"></span>
                            </label>
                            <input type="text" class="form-control d-inline-block w-auto <?php echo isset($errors['code']) ? 'is-invalid' : ''; ?>" name="code" placeholder="Enter Code" required>
                            <?php if(isset($errors['code'])): ?>
                                <div class="invalid-feedback d-block"><?php echo htmlspecialchars($errors['code']); ?></div>
                            <?php else: ?>
                                <div id="warnCode" class="text-danger mt-2 fw-bold" style="display: none;">Invalid Security Code</div>
                            <?php endif; ?>
                        </div>

                        <div class="d-grid gap-3 d-md-flex justify-content-md-center mt-4">
                            <button type="submit" name="register" class="btn btn-iti-submit px-5 py-2">SUBMIT REGISTRATION</button>
                            <button type="reset" class="btn btn-iti-outline px-5 py-2">RESET FORM</button>
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
