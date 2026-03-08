<?php
    if(isset($_SESSION["user_id"])) {
        header("Location: list.php");
        exit;
    }
    $errorMessage = "";
    if (isset($_GET['error']) && $_GET['error'] === 'INVALID_CREDENTIALS') {
        $errorMessage = "Invalid username or password. Please try again.";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Login | ITI</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        :root {
            --iti-red: #a32a29; /* ITI Maroon */
            --iti-black: #212529;
        }
        body { background-color: #f4f4f4; height: 100vh; display: flex; flex-direction: column; }

        /* Centering the login card */
        .login-container { flex: 1; display: flex; align-items: center; justify-content: center; }

        .iti-card {
            border: none;
            border-radius: 0;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .iti-header {
            background-color: var(--iti-red);
            color: white;
            border-bottom: 4px solid var(--iti-black);
            padding: 2rem 1rem;
        }
        .btn-iti {
            background-color: var(--iti-black);
            color: white;
            border-radius: 0;
            font-weight: bold;
            transition: 0.3s;
            width: 100%;
        }
        .btn-iti:hover { background-color: var(--iti-red); color: white; }

        .form-control:focus {
            border-color: var(--iti-red);
            box-shadow: 0 0 0 0.25rem rgba(163, 42, 41, 0.25);
        }
    </style>
</head>
<body>

<?php include('navbar.php'); ?>

<div class="login-container px-3">
    <div class="card iti-card">
        <div class="card-header iti-header text-center">
            <h3 class="mb-0 fw-bold">ITI PORTAL</h3>
            <small class="opacity-75">Sign in to your account</small>
        </div>
        <div class="card-body p-4 p-md-5">

            <?php if(!empty($errorMessage)): ?>
                <div class="alert alert-danger rounded-0 small fw-bold mb-4 border-start border-4 border-danger">
                    <?php echo $errorMessage; ?>
                </div>
            <?php endif; ?>

            <form action="../controlers/operation.php" method="post">

                <div class="mb-3">
                    <label for="username" class="form-label fw-bold">Username</label>
                    <input type="text" class="form-control" id="username" name="username" placeholder="Enter your username" required>
                </div>

                <div class="mb-4">
                    <label for="password" class="form-label fw-bold">Password</label>
                    <input type="password" class="form-control" id="password" name="password" placeholder="Enter your password" required>
                </div>

                <div class="mb-3">
                    <button type="submit" name="login" class="btn btn-iti py-2">LOGIN</button>
                </div>

                <div class="text-center mt-4">
                    <p class="small text-muted mb-0">Don't have an account?</p>
                    <a href="register.php" class="text-decoration-none fw-bold" style="color: var(--iti-red);">Register Here</a>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>