<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<nav class="navbar navbar-expand-lg sticky-top shadow-sm" style="background-color: #212529; border-bottom: 4px solid #a32a29;">
    <div class="container-fluid px-md-5">
        <a class="navbar-brand d-flex align-items-center" href="list.php">
            <div class="bg-white p-1 rounded-circle me-2" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #a32a29; font-weight: 900; font-size: 1.2rem;">ITI</span>
            </div>
            <span class="text-white fw-bold letter-spacing-1">Information Technology Institute</span>
        </a>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#itiNavbar">
            <span class="navbar-toggler-icon" style="filter: invert(1);"></span>
        </button>

        <div class="collapse navbar-collapse" id="itiNavbar">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                <li class="nav-item">
                    <?php
                    if(isset($_SESSION['user_id'])) {
                        echo '<a class="nav-link text-white opacity-75" href="list.php">Student List</a>';
                    }
                    ?>
                </li>
            </ul>



            <div class="d-flex">
                <?php
                if(!isset($_SESSION['user_id'])) {
                   echo '<a href="register.php" class="btn px-4 fw-bold me-3" style="background-color: #a32a29; color: white; border-radius: 0;">
                        REGISTER NOW
                    </a>
    
                    <a href="login.php" class="btn px-4 fw-bold" style="background-color: #a32a29; color: white; border-radius: 0;">
                        Login
                    </a>';
                }
                else
                {
                    $name = htmlspecialchars($_SESSION['username']);
                    $image = $_SESSION['profile_pic'] ?? null;
                    $imageSrc = $image
                        ? htmlspecialchars($image)
                        : "https://ui-avatars.com/api/?name=" . urlencode($name) . "&background=a32a29&color=fff&size=64";
                    echo "<div class='d-flex align-items-center text-white me-3 px-2'>
                            <img src='{$imageSrc}' alt='Profile' class='rounded-circle border border-light me-2' style='width: 36px; height: 36px; object-fit: cover;'>
                            <span class='fw-bold'>Hello, {$name}</span>
                          </div>";
                    echo '<a href="../controlers/operation.php?logout=1" class="btn px-4 fw-bold" style="background-color: #a32a29; color: white; border-radius: 0;">
                            Logout
                          </a>';
                }
                ?>
            </div>
        </div>
    </div>
</nav>

<style>
    .nav-link:hover { color: #a32a29 !important; opacity: 1 !important; }
    .letter-spacing-1 { letter-spacing: 1px; }
</style>
