// ============================================
// Posts Management API — Frontend Logic
// ============================================

const API_BASE = '/api';

// --- State ---
let authToken = localStorage.getItem('auth_token');
let authUser  = JSON.parse(localStorage.getItem('auth_user') || 'null');
let deletePostId = null;

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    navigateTo('home');
});

// ============================================
// Navigation
// ============================================
function navigateTo(page, data = null) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

    // Show target
    const target = document.getElementById(`page-${page}`);
    if (target) {
        target.style.display = 'block';
        target.style.animation = 'none';
        target.offsetHeight; // trigger reflow
        target.style.animation = 'fadeInUp 0.4s ease-out';
    }

    // Page-specific logic
    switch (page) {
        case 'home':
            loadPosts();
            break;
        case 'show':
            if (data) loadSinglePost(data);
            break;
        case 'create':
            if (!authToken) { navigateTo('login'); return; }
            clearFormErrors('create');
            document.getElementById('create-title').value = '';
            document.getElementById('create-content').value = '';
            break;
        case 'edit':
            if (!authToken) { navigateTo('login'); return; }
            if (data) loadEditForm(data);
            break;
        case 'login':
            clearFormErrors('login');
            break;
        case 'register':
            clearFormErrors('register');
            break;
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const navLink = document.getElementById(`nav-${page}`);
    if (navLink) navLink.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// Auth State Management
// ============================================
function setAuth(token, user) {
    authToken = token;
    authUser  = user;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    updateAuthUI();
}

function clearAuth() {
    authToken = null;
    authUser  = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    updateAuthUI();
}

function updateAuthUI() {
    const isLoggedIn = !!authToken;

    // Desktop
    document.getElementById('guest-buttons').style.display = isLoggedIn ? 'none' : 'flex';
    document.getElementById('auth-buttons').style.display  = isLoggedIn ? 'flex' : 'none';

    // Mobile
    document.getElementById('mobile-guest').style.display = isLoggedIn ? 'none' : 'flex';
    document.getElementById('mobile-auth').style.display  = isLoggedIn ? 'flex' : 'none';

    // Auth-only elements
    document.querySelectorAll('.auth-only').forEach(el => {
        el.style.display = isLoggedIn ? '' : 'none';
    });

    if (isLoggedIn && authUser) {
        const greeting = `Hello, ${authUser.name}`;
        document.getElementById('user-greeting').textContent = greeting;
        document.getElementById('mobile-user-greeting').textContent = greeting;
    }
}

// ============================================
// API Helper
// ============================================
async function apiRequest(endpoint, method = 'GET', body = null) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    return { ok: response.ok, status: response.status, data };
}

// ============================================
// Posts
// ============================================
async function loadPosts() {
    const grid = document.getElementById('posts-grid');
    const empty = document.getElementById('empty-state');
    const loading = document.getElementById('loading-home');

    grid.innerHTML = '';
    empty.style.display = 'none';
    loading.style.display = 'flex';

    try {
        const { ok, data } = await apiRequest('/posts');

        loading.style.display = 'none';

        if (ok && data.data && data.data.length > 0) {
            grid.innerHTML = data.data.map(post => createPostCard(post)).join('');
            empty.style.display = 'none';
        } else {
            empty.style.display = 'block';
        }
    } catch (err) {
        loading.style.display = 'none';
        showToast('Failed to load posts', 'error');
    }
}

function createPostCard(post) {
    const excerpt = post.content.length > 150
        ? post.content.substring(0, 150) + '...'
        : post.content;

    const date = new Date(post.created_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    const initials = post.user
        ? post.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '??';

    const authorName = post.user ? post.user.name : 'Unknown';

    return `
        <div class="post-card" onclick="navigateTo('show', ${post.id})">
            <h3 class="post-card-title">${escapeHtml(post.title)}</h3>
            <p class="post-card-excerpt">${escapeHtml(excerpt)}</p>
            <div class="post-card-meta">
                <div class="post-author">
                    <div class="author-avatar">${initials}</div>
                    <span class="author-name">${escapeHtml(authorName)}</span>
                </div>
                <span class="post-date">${date}</span>
            </div>
        </div>
    `;
}

async function loadSinglePost(postId) {
    const container = document.getElementById('single-post-content');
    container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading post...</p></div>';

    try {
        const { ok, data } = await apiRequest(`/posts/${postId}`);

        if (!ok) {
            container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><h3>Post not found</h3></div>`;
            return;
        }

        const post = data.data;
        const date = new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });

        const initials = post.user
            ? post.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : '??';

        const authorName = post.user ? post.user.name : 'Unknown';
        const isOwner = authUser && post.user_id === authUser.id;

        container.innerHTML = `
            <h1 class="single-post-title">${escapeHtml(post.title)}</h1>
            <div class="single-post-meta">
                <div class="post-author">
                    <div class="author-avatar">${initials}</div>
                    <span class="author-name">${escapeHtml(authorName)}</span>
                </div>
                <span class="post-date">${date}</span>
            </div>
            <div class="single-post-content">${escapeHtml(post.content)}</div>
            ${isOwner ? `
                <div class="post-actions">
                    <button class="btn btn-ghost" onclick="navigateTo('edit', ${post.id})">✏️ Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${post.id})">🗑️ Delete</button>
                </div>
            ` : ''}
        `;
    } catch (err) {
        container.innerHTML = `<div class="empty-state"><div class="empty-icon">❌</div><h3>Error loading post</h3></div>`;
    }
}

// ============================================
// Create Post
// ============================================
async function handleCreatePost(event) {
    event.preventDefault();
    clearFormErrors('create');

    const title   = document.getElementById('create-title').value;
    const content = document.getElementById('create-content').value;
    const btn     = document.getElementById('create-submit-btn');

    setButtonLoading(btn, true);

    try {
        const { ok, status, data } = await apiRequest('/posts', 'POST', { title, content });

        if (ok) {
            showToast(data.message || 'Post created successfully!', 'success');
            navigateTo('home');
        } else if (status === 422) {
            showFormErrors('create', data.errors);
        } else if (status === 401) {
            showToast('Please login to create a post', 'error');
            clearAuth();
            navigateTo('login');
        } else {
            showToast(data.message || 'Failed to create post', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }

    setButtonLoading(btn, false);
}

// ============================================
// Edit Post
// ============================================
async function loadEditForm(postId) {
    clearFormErrors('edit');

    try {
        const { ok, data } = await apiRequest(`/posts/${postId}`);

        if (ok) {
            const post = data.data;
            document.getElementById('edit-post-id').value = post.id;
            document.getElementById('edit-title').value   = post.title;
            document.getElementById('edit-content').value = post.content;
        } else {
            showToast('Post not found', 'error');
            navigateTo('home');
        }
    } catch (err) {
        showToast('Failed to load post', 'error');
        navigateTo('home');
    }
}

async function handleEditPost(event) {
    event.preventDefault();
    clearFormErrors('edit');

    const id      = document.getElementById('edit-post-id').value;
    const title   = document.getElementById('edit-title').value;
    const content = document.getElementById('edit-content').value;
    const btn     = document.getElementById('edit-submit-btn');

    setButtonLoading(btn, true);

    try {
        const { ok, status, data } = await apiRequest(`/posts/${id}`, 'PUT', { title, content });

        if (ok) {
            showToast(data.message || 'Post updated successfully!', 'success');
            navigateTo('show', id);
        } else if (status === 422) {
            showFormErrors('edit', data.errors);
        } else if (status === 403) {
            showToast('You are not authorized to edit this post', 'error');
        } else if (status === 401) {
            showToast('Please login again', 'error');
            clearAuth();
            navigateTo('login');
        } else {
            showToast(data.message || 'Failed to update post', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }

    setButtonLoading(btn, false);
}

// ============================================
// Delete Post
// ============================================
function openDeleteModal(postId) {
    deletePostId = postId;
    document.getElementById('delete-modal').style.display = 'flex';
}

function closeDeleteModal() {
    deletePostId = null;
    document.getElementById('delete-modal').style.display = 'none';
}

async function confirmDelete() {
    if (!deletePostId) return;

    try {
        const { ok, data } = await apiRequest(`/posts/${deletePostId}`, 'DELETE');

        if (ok) {
            showToast(data.message || 'Post deleted successfully', 'success');
            navigateTo('home');
        } else {
            showToast(data.message || 'Failed to delete post', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }

    closeDeleteModal();
}

// ============================================
// Auth — Login
// ============================================
async function handleLogin(event) {
    event.preventDefault();
    clearFormErrors('login');

    const email    = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn      = document.getElementById('login-submit-btn');

    setButtonLoading(btn, true);

    try {
        const { ok, status, data } = await apiRequest('/login', 'POST', { email, password });

        if (ok) {
            setAuth(data.data.token, data.data.user);
            showToast(data.message || 'Welcome back!', 'success');
            navigateTo('home');
        } else if (status === 422) {
            showFormErrors('login', data.errors);
        } else {
            showToast(data.message || 'Invalid credentials', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }

    setButtonLoading(btn, false);
}

// ============================================
// Auth — Register
// ============================================
async function handleRegister(event) {
    event.preventDefault();
    clearFormErrors('register');

    const name     = document.getElementById('register-name').value;
    const email    = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const password_confirmation = document.getElementById('register-password-confirm').value;
    const btn      = document.getElementById('register-submit-btn');

    setButtonLoading(btn, true);

    try {
        const { ok, status, data } = await apiRequest('/register', 'POST', {
            name, email, password, password_confirmation
        });

        if (ok) {
            setAuth(data.data.token, data.data.user);
            showToast(data.message || 'Account created!', 'success');
            navigateTo('home');
        } else if (status === 422) {
            showFormErrors('register', data.errors);
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }

    setButtonLoading(btn, false);
}

// ============================================
// Auth — Logout
// ============================================
async function handleLogout() {
    try {
        await apiRequest('/logout', 'POST');
    } catch (err) {
        // Ignore errors, clear local state anyway
    }

    clearAuth();
    showToast('Logged out successfully', 'success');
    navigateTo('home');
}

// ============================================
// Utilities
// ============================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3000);
}

function setButtonLoading(btn, loading) {
    const text   = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');
    if (text) text.style.display   = loading ? 'none' : '';
    if (loader) loader.style.display = loading ? '' : 'none';
    btn.disabled = loading;
}

function showFormErrors(prefix, errors) {
    if (!errors) return;

    Object.keys(errors).forEach(field => {
        const input = document.getElementById(`${prefix}-${field}`);
        const errorDiv = document.getElementById(`${prefix}-${field}-errors`);

        if (input) input.classList.add('error');
        if (errorDiv) {
            errorDiv.innerHTML = errors[field].map(e => `<p>${escapeHtml(e)}</p>`).join('');
        }
    });
}

function clearFormErrors(prefix) {
    const form = document.getElementById(`${prefix}-form`) ||
                 document.getElementById(`${prefix}-post-form`);
    if (!form) return;

    form.querySelectorAll('.form-input').forEach(input => input.classList.remove('error'));
    form.querySelectorAll('.field-errors').forEach(div => div.innerHTML = '');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('open');
}
