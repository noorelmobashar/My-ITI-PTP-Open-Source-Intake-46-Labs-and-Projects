<?php
require_once __DIR__ . '/user.php';
require_once __DIR__ . '/../models/ProfileImage.php';
require_once __DIR__ . '/../models/Authenticate.php';

function validate($data)
{
    $data = trim($data);
    $data = htmlspecialchars($data);
    $data = addslashes($data);
    return $data;
}

session_start();

$userModel = new User();
$profileImage = new ProfileImage();
$auth = new Authenticate();

$requiresAuth = isset($_POST['edit']) || isset($_GET['delete']);
if ($requiresAuth && !isset($_SESSION['user_id'])) {
    header('location: ../views/login.php');
    exit;
}

if (isset($_GET['logout'])) {
    $auth->logout();
    header('location: ../views/login.php');
    exit;
}

unset($_POST['code']);

$errors = [];
if (isset($_POST['register']) || isset($_POST['edit'])) {
    if (!$profileImage->validate($_FILES['profile_image'] ?? null)) {
        $errors['profile_image'] = 'Profile image must be PNG, JPG, or JPEG';
    }

    if ($_POST['f_name']) {
        if (strlen($_POST['f_name']) < 3 || strlen($_POST['f_name']) > 50) {
            $errors['f_name'] = 'First name must be between 3 and 50 characters';
        }
    } else {
        $errors['f_name'] = 'First name is required';
    }

    if ($_POST['l_name']) {
        if (strlen($_POST['l_name']) < 3 || strlen($_POST['l_name']) > 50) {
            $errors['l_name'] = 'Last name must be between 3 and 50 characters';
        }
    } else {
        $errors['l_name'] = 'Last name is required';
    }

    if ($_POST['address']) {
        if (strlen($_POST['address']) < 20 || strlen($_POST['address']) > 200) {
            $errors['address'] = 'Address must be between 20 and 200 characters';
        }
    } else {
        $errors['address'] = 'Address is required';
    }

    if ($_POST['phone']) {
        if (!preg_match('/^01[0125]\d{8}$/', $_POST['phone'])) {
            $errors['phone'] = 'Phone number is invalid';
        }
    } else {
        $errors['phone'] = 'Phone number is required';
    }

    if ($_POST['birthdate']) {
        if (!preg_match('/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/', $_POST['birthdate'])) {
            $errors['birthdate'] = 'Birthdate is invalid';
        }
    } else {
        $errors['birthdate'] = 'Birthdate is required';
    }

    if ($_POST['gender']) {
        if ($_POST['gender'] != 'male' && $_POST['gender'] != 'female') {
            $errors['gender'] = 'Gender is invalid';
        }
    } else {
        $errors['gender'] = 'Gender is required';
    }

    if (isset($_POST['register'])) {
        if ($_POST['username']) {
            if (strlen($_POST['username']) < 3 || strlen($_POST['username']) > 50) {
                $errors['username'] = 'Username must be between 3 and 50 characters';
            }
            if ($userModel->usernameExists($_POST['username'])) {
                $errors['username'] = 'Username already exists';
            }
        } else {
            $errors['username'] = 'Username is required';
        }
    }

    if ($_POST['password']) {
        if (!preg_match('/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/', $_POST['password'])) {
            $errors['password'] = 'Password must be at least 8 characters and at least 1 character or digit';
        }
    } else {
        $errors['password'] = 'Password is required';
    }

    if (isset($_POST['register'])) {
        if ($_POST['department']) {
            if ($_POST['department'] != 'OpenSource') {
                $errors['department'] = 'Department does not exist';
            }
        } else {
            $errors['department'] = 'Department is required';
        }
    }

    if ($errors) {
        $errors = json_encode($errors);
        if (isset($_POST['register'])) {
            header('location: ../views/register.php?errors=' . $errors);
        } elseif (isset($_POST['edit'])) {
            $studentId = isset($_POST['StudentID']) ? (int) $_POST['StudentID'] : 0;
            header('location: ../views/edit.php?StudentID=' . $studentId . '&errors=' . $errors);
        }
        exit;
    } else {
        if (isset($_POST['register'])) {
            $profilePic = $profileImage->save($_FILES['profile_image'] ?? null, null);
            $ver = $userModel->create($_POST, $profilePic);
            if ($ver) {
                header('Location: ../views/login.php');
            } else {
                header('Location: ../views/register.php?error=SOMETHING_WRONG_HAPPENED');
            }
            exit;
        } elseif (isset($_POST['edit'])) {
            $studentId = (int) $_POST['StudentID'];
            $currentPic = $userModel->getCurrentProfilePic($studentId);
            $profilePic = $profileImage->save($_FILES['profile_image'] ?? null, $currentPic);
            $ver = $userModel->update($_POST, $profilePic);
            if ($ver) {
                if (isset($_SESSION['user_id']) && (int) $_SESSION['user_id'] === (int) $_POST['StudentID']) {
                    $user = $userModel->getById((int) $_POST['StudentID']);
                    if ($user) {
                        $_SESSION['username'] = $user['username'];
                        $_SESSION['profile_pic'] = $user['profile_pic'];
                    }
                }
                header('Location: ../views/list.php');
            } else {
                header('Location: ../views/edit.php?error=SOMETHING_WRONG_HAPPENED&StudentID=' . $_POST['StudentID']);
            }
            exit;
        }
    }
} elseif (isset($_POST['login'])) {
    $username = isset($_POST['username']) ? validate($_POST['username']) : '';
    $password = isset($_POST['password']) ? validate($_POST['password']) : '';

    if (!$username) {
        $errors['username'] = 'Username is required';
    }
    if (!$password) {
        $errors['password'] = 'Password is required';
    }

    if ($errors) {
        header('location: ../views/login.php?error=INVALID_CREDENTIALS');
        exit;
    }

    $user = $auth->login($username, $password);
    if ($user) {
        $_SESSION['user_id'] = validate($user['StudentID']);
        $_SESSION['username'] = validate($user['username']);
        $_SESSION['profile_pic'] = $user['profile_pic'];
        header('location: ../views/list.php');
    } else {
        header('location: ../views/login.php?error=INVALID_CREDENTIALS');
    }
    exit;
} elseif (isset($_GET['delete'])) {
    $studentId = isset($_GET['StudentID']) ? (int) $_GET['StudentID'] : 0;

    if ($studentId <= 0) {
        header('location: ../views/list.php?error=INVALID_STUDENT_ID');
        exit;
    }

    $ver = $userModel->delete($studentId);
    if ($ver) {
        if (isset($_SESSION['user_id']) && (int) $_SESSION['user_id'] === $studentId) {
            $auth->logout();
            header('location: ../views/login.php');
            exit;
        }
        header('location: ../views/list.php');
    } else {
        header('location: ../views/list.php?error=SOMETHING_WRONG_HAPPENED');
    }
    exit;
}
