<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Posts Management - A modern platform to create, share, and manage your posts securely.">
    <title>Posts Management API</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/app.css">
</head>
<body>
    <!-- Toast Container -->
    <div id="toast-container"></div>

    <!-- Navbar -->
    <nav class="navbar" id="navbar">
        <div class="navbar-inner">
            <a href="#" class="navbar-brand" onclick="navigateTo('home')">
                <span class="brand-icon">✦</span>
                <span class="brand-text">PostsAPI</span>
            </a>
            <div class="navbar-links">
                <a href="#" class="nav-link" onclick="navigateTo('home')" id="nav-home">
                    <span class="nav-icon">🏠</span> Home
                </a>
                <a href="#" class="nav-link auth-only" onclick="navigateTo('create')" id="nav-create" style="display:none;">
                    <span class="nav-icon">✍️</span> New Post
                </a>
            </div>
            <div class="navbar-auth">
                <!-- Guest buttons -->
                <div id="guest-buttons">
                    <button class="btn btn-ghost" onclick="navigateTo('login')">Sign In</button>
                    <button class="btn btn-primary" onclick="navigateTo('register')">Sign Up</button>
                </div>
                <!-- Auth buttons -->
                <div id="auth-buttons" style="display:none;">
                    <span class="user-greeting" id="user-greeting"></span>
                    <button class="btn btn-ghost" onclick="handleLogout()">Logout</button>
                </div>
            </div>
            <button class="mobile-menu-btn" id="mobile-menu-btn" onclick="toggleMobileMenu()">
                <span></span><span></span><span></span>
            </button>
        </div>
        <!-- Mobile menu -->
        <div class="mobile-menu" id="mobile-menu">
            <a href="#" onclick="navigateTo('home'); toggleMobileMenu();">Home</a>
            <a href="#" class="auth-only" onclick="navigateTo('create'); toggleMobileMenu();" style="display:none;">New Post</a>
            <div id="mobile-guest" class="mobile-auth-section">
                <button class="btn btn-ghost btn-block" onclick="navigateTo('login'); toggleMobileMenu();">Sign In</button>
                <button class="btn btn-primary btn-block" onclick="navigateTo('register'); toggleMobileMenu();">Sign Up</button>
            </div>
            <div id="mobile-auth" class="mobile-auth-section" style="display:none;">
                <span class="user-greeting" id="mobile-user-greeting"></span>
                <button class="btn btn-ghost btn-block" onclick="handleLogout(); toggleMobileMenu();">Logout</button>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content" id="main-content">

        <!-- ============ HOME / POSTS FEED ============ -->
        <section class="page" id="page-home">
            <div class="page-header">
                <h1 class="page-title">
                    <span class="gradient-text">Explore Posts</span>
                </h1>
                <p class="page-subtitle">Discover stories, ideas, and insights from our community</p>
            </div>
            <div class="posts-grid" id="posts-grid">
                <!-- Posts loaded dynamically -->
            </div>
            <div class="empty-state" id="empty-state" style="display:none;">
                <div class="empty-icon">📭</div>
                <h3>No posts yet</h3>
                <p>Be the first to share something amazing!</p>
            </div>
            <div class="loading-spinner" id="loading-home">
                <div class="spinner"></div>
                <p>Loading posts...</p>
            </div>
        </section>

        <!-- ============ SINGLE POST ============ -->
        <section class="page" id="page-show" style="display:none;">
            <div class="single-post-container">
                <button class="btn btn-ghost back-btn" onclick="navigateTo('home')">← Back to Posts</button>
                <article class="single-post-card" id="single-post-content">
                    <!-- Loaded dynamically -->
                </article>
            </div>
        </section>

        <!-- ============ CREATE POST ============ -->
        <section class="page" id="page-create" style="display:none;">
            <div class="form-container">
                <div class="form-card glass-card">
                    <h2 class="form-title">
                        <span class="gradient-text">Create New Post</span>
                    </h2>
                    <form id="create-post-form" onsubmit="handleCreatePost(event)">
                        <div class="form-group" id="create-title-group">
                            <label for="create-title">Title</label>
                            <input type="text" id="create-title" placeholder="Enter a compelling title..." class="form-input">
                            <div class="field-errors" id="create-title-errors"></div>
                        </div>
                        <div class="form-group" id="create-content-group">
                            <label for="create-content">Content</label>
                            <textarea id="create-content" placeholder="Write your post content..." class="form-input form-textarea" rows="8"></textarea>
                            <div class="field-errors" id="create-content-errors"></div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block btn-lg" id="create-submit-btn">
                            <span class="btn-text">Publish Post</span>
                            <span class="btn-loader" style="display:none;">Publishing...</span>
                        </button>
                    </form>
                </div>
            </div>
        </section>

        <!-- ============ EDIT POST ============ -->
        <section class="page" id="page-edit" style="display:none;">
            <div class="form-container">
                <div class="form-card glass-card">
                    <h2 class="form-title">
                        <span class="gradient-text">Edit Post</span>
                    </h2>
                    <form id="edit-post-form" onsubmit="handleEditPost(event)">
                        <input type="hidden" id="edit-post-id">
                        <div class="form-group" id="edit-title-group">
                            <label for="edit-title">Title</label>
                            <input type="text" id="edit-title" placeholder="Enter a compelling title..." class="form-input">
                            <div class="field-errors" id="edit-title-errors"></div>
                        </div>
                        <div class="form-group" id="edit-content-group">
                            <label for="edit-content">Content</label>
                            <textarea id="edit-content" placeholder="Write your post content..." class="form-input form-textarea" rows="8"></textarea>
                            <div class="field-errors" id="edit-content-errors"></div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-ghost" onclick="navigateTo('home')">Cancel</button>
                            <button type="submit" class="btn btn-primary btn-lg" id="edit-submit-btn">
                                <span class="btn-text">Update Post</span>
                                <span class="btn-loader" style="display:none;">Updating...</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>

        <!-- ============ LOGIN ============ -->
        <section class="page" id="page-login" style="display:none;">
            <div class="form-container auth-container">
                <div class="form-card glass-card auth-card">
                    <div class="auth-header">
                        <div class="auth-icon">🔐</div>
                        <h2 class="form-title">Welcome Back</h2>
                        <p class="auth-subtitle">Sign in to your account</p>
                    </div>
                    <form id="login-form" onsubmit="handleLogin(event)">
                        <div class="form-group" id="login-email-group">
                            <label for="login-email">Email</label>
                            <input type="email" id="login-email" placeholder="you@example.com" class="form-input">
                            <div class="field-errors" id="login-email-errors"></div>
                        </div>
                        <div class="form-group" id="login-password-group">
                            <label for="login-password">Password</label>
                            <input type="password" id="login-password" placeholder="••••••••" class="form-input">
                            <div class="field-errors" id="login-password-errors"></div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block btn-lg" id="login-submit-btn">
                            <span class="btn-text">Sign In</span>
                            <span class="btn-loader" style="display:none;">Signing in...</span>
                        </button>
                    </form>
                    <p class="auth-footer">Don't have an account? <a href="#" onclick="navigateTo('register')">Sign Up</a></p>
                </div>
            </div>
        </section>

        <!-- ============ REGISTER ============ -->
        <section class="page" id="page-register" style="display:none;">
            <div class="form-container auth-container">
                <div class="form-card glass-card auth-card">
                    <div class="auth-header">
                        <div class="auth-icon">🚀</div>
                        <h2 class="form-title">Create Account</h2>
                        <p class="auth-subtitle">Join our community today</p>
                    </div>
                    <form id="register-form" onsubmit="handleRegister(event)">
                        <div class="form-group" id="register-name-group">
                            <label for="register-name">Full Name</label>
                            <input type="text" id="register-name" placeholder="John Doe" class="form-input">
                            <div class="field-errors" id="register-name-errors"></div>
                        </div>
                        <div class="form-group" id="register-email-group">
                            <label for="register-email">Email</label>
                            <input type="email" id="register-email" placeholder="you@example.com" class="form-input">
                            <div class="field-errors" id="register-email-errors"></div>
                        </div>
                        <div class="form-group" id="register-password-group">
                            <label for="register-password">Password</label>
                            <input type="password" id="register-password" placeholder="••••••••" class="form-input">
                            <div class="field-errors" id="register-password-errors"></div>
                        </div>
                        <div class="form-group" id="register-password-confirmation-group">
                            <label for="register-password-confirm">Confirm Password</label>
                            <input type="password" id="register-password-confirm" placeholder="••••••••" class="form-input">
                            <div class="field-errors" id="register-password_confirmation-errors"></div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block btn-lg" id="register-submit-btn">
                            <span class="btn-text">Create Account</span>
                            <span class="btn-loader" style="display:none;">Creating...</span>
                        </button>
                    </form>
                    <p class="auth-footer">Already have an account? <a href="#" onclick="navigateTo('login')">Sign In</a></p>
                </div>
            </div>
        </section>
    </main>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" id="delete-modal" style="display:none;">
        <div class="modal-card glass-card">
            <div class="modal-icon">⚠️</div>
            <h3>Delete Post</h3>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div class="modal-actions">
                <button class="btn btn-ghost" onclick="closeDeleteModal()">Cancel</button>
                <button class="btn btn-danger" id="confirm-delete-btn" onclick="confirmDelete()">Delete</button>
            </div>
        </div>
    </div>

    <script src="/js/app.js"></script>
</body>
</html>
