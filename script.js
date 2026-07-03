// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let currentUser = null;
const USERS_KEY = 'ironforge_users';
const SESSION_KEY = 'ironforge_session';
const NUTRITION_KEY = 'ironforge_nutrition';
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔥 NEW STORAGE KEYS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const WEIGHT_KEY = 'ironforge_weight';
const WORKOUT_LOG_KEY = 'ironforge_workout_log';
const WATER_KEY = 'ironforge_water';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔥 100% WORKING EMBED LINKS (No ?si= parameter)
//  ✅ Sabhi videos embeddable hain
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const VIDEO_LINKS = {
    // ─── SINGLE MUSCLE ───
    'Chest': 'https://www.youtube.com/embed/SCVCLChPQFY',
    'Back': 'https://www.youtube.com/embed/eRPI2aG566s',
    'Shoulders':'https://www.youtube.com/embed/2QwK4aMSlow',
    'Arms': 'https://www.youtube.com/embed/Ost6UtXWTJg',
    'Legs': 'https://www.youtube.com/embed/8HuJbDeCvAM',
    'Core': 'https://www.youtube.com/embed/KMAgpxZtQ6k',

    // ─── DOUBLE MUSCLE ───
    'Chest+Triceps': 'https://www.youtube.com/embed/UCzx-7NzfHc',
    'Back+Biceps': 'https://www.youtube.com/embed/eRPI2aG566s',
    'Shoulders+Core': 'https://www.youtube.com/embed/yVRVjYHcd3I',
    'Legs+Glutes': 'https://www.youtube.com/embed/8HuJbDeCvAM',
    'Chest+Shoulders': 'https://www.youtube.com/embed/sz7MS2kELug',
    'Back+RearDelts': 'https://www.youtube.com/embed/nZ2jwmFLb34',

    // ─── PUSH PULL LEG ───
    'PushDay': 'https://www.youtube.com/embed/_NkCN0OpwVU',
    'PullDay': 'https://www.youtube.com/embed/78-NaFwVLTw',
    'LegDay': 'https://www.youtube.com/embed/8HuJbDeCvAM'
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UTILITY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; }
}
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}
function saveSession(email) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email, loggedIn: true }));
}
function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}
function getNutritionLogs() {
    try { return JSON.parse(localStorage.getItem(NUTRITION_KEY)) || []; } catch { return []; }
}
function saveNutritionLogs(logs) {
    localStorage.setItem(NUTRITION_KEY, JSON.stringify(logs));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  TOAST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function showToast(type, message) {
    const container = document.getElementById('toastContainer');
    if (!container) { console.warn('Toast container not found'); return; }
    const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
    const colors = { success: 'success', error: 'error', info: 'info' };
    const toast = document.createElement('div');
    toast.className = 'toast-custom d-flex align-items-center';
    toast.innerHTML = `
        <span class="toast-icon ${colors[type]}"><i class="bi ${icons[type]}"></i></span>
        <span>${message}</span>
        <button type="button" class="btn-close btn-close-white ms-auto" style="font-size:0.7rem;" onclick="this.parentElement.remove()"></button>
    `;
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AUTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function registerUser(name, email, password, plan) {
    const users = getUsers();
    if (users[email]) { showToast('error', 'Email already registered!'); return false; }
    users[email] = {
        name,
        email,
        password,
        plan,
        joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        workoutsCompleted: 0,
        streak: 0,
        currentPlan: 'Push Pull Leg'
    };
    saveUsers(users);
    showToast('success', `Welcome ${name}! Your account is ready.`);
    return true;
}

function loginUser(email, password) {
    const users = getUsers();
    if (!users[email]) { showToast('error', 'No account found with this email.'); return false; }
    if (users[email].password !== password) { showToast('error', 'Incorrect password.'); return false; }
    currentUser = users[email];
    saveSession(email);
    showToast('success', `Welcome back, ${currentUser.name}!`);
    updateUI();
    return true;
}

function handleLogout() {
    clearSession();
    currentUser = null;
    updateUI();
    showToast('info', 'Logged out successfully.');
    document.querySelectorAll('.modal.show').forEach(m => { const instance = bootstrap.Modal.getInstance(m); if (instance) instance.hide(); });
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UI UPDATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function updateUI() {
    const session = getSession();
    const authBtns = document.getElementById('authButtons');
    const userDropdown = document.getElementById('userDropdown');
    const dashSection = document.getElementById('dashboard');
    const profileSection = document.getElementById('profile');

    if (session && session.loggedIn) {
        const users = getUsers();
        const user = users[session.email];
        if (user) {
            currentUser = user;
            authBtns.style.display = 'none';
            userDropdown.style.display = 'block';
            document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
            document.getElementById('userNameDisplay').textContent = user.name.split(' ')[0];
            dashSection.classList.remove('section-hide');
            profileSection.classList.remove('section-hide');

            document.getElementById('dashUserName').textContent = user.name;
            document.getElementById('statWorkouts').textContent = user.workoutsCompleted || 0;
            document.getElementById('statStreak').textContent = user.streak || 0;
            document.getElementById('statPlan').textContent = user.currentPlan || 'Push Pull Leg';
            document.getElementById('statMembership').textContent = user.plan || 'Basic';

            document.getElementById('profileName').textContent = user.name;
            document.getElementById('profileEmail').textContent = user.email;
            document.getElementById('profilePlan').textContent = user.plan || 'Basic';
            document.getElementById('profileDetailName').textContent = user.name;
            document.getElementById('profileDetailEmail').textContent = user.email;
            document.getElementById('profileDetailPlan').textContent = user.plan || 'Basic';
            document.getElementById('profileDetailJoined').textContent = user.joined || 'Jan 2025';

            document.querySelector('#profile .user-avatar').textContent = user.name.charAt(0).toUpperCase();
            document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
        }
    } else {
        authBtns.style.display = 'flex';
        userDropdown.style.display = 'none';
        dashSection.classList.add('section-hide');
        profileSection.classList.add('section-hide');
        currentUser = null;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  WORKOUT QUICK START
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function startWorkout(type) {
    if (!currentUser) {
        showToast('error', 'Please login to start a workout.');
        document.getElementById('loginModal').querySelector('input').focus();
        const modal = new bootstrap.Modal(document.getElementById('loginModal'));
        modal.show();
        return;
    }
    showToast('success', `🔥 ${type} workout started! Let's go!`);
    const users = getUsers();
    if (users[currentUser.email]) {
        users[currentUser.email].workoutsCompleted = (users[currentUser.email].workoutsCompleted || 0) + 1;
        users[currentUser.email].streak = (users[currentUser.email].streak || 0) + 1;
        saveUsers(users);
        currentUser = users[currentUser.email];
        updateUI();
    }
    document.getElementById('workouts').scrollIntoView({ behavior: 'smooth' });
}

function switchPlanTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) { const trigger = new bootstrap.Tab(tab); trigger.show(); }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  VIDEO MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function showVideo(muscle) {
    let videoUrl = VIDEO_LINKS[muscle];
    if (!videoUrl) { videoUrl = VIDEO_LINKS['Chest']; showToast('info', 'Showing default tutorial.'); }
    videoUrl = videoUrl.split('?')[0];
    if (!videoUrl.includes('/embed/')) {
        const videoId = videoUrl.split('v=')[1]?.split('&')[0];
        if (videoId) videoUrl = `https://www.youtube.com/embed/${videoId}`;
        else { videoUrl = VIDEO_LINKS['Chest']; }
    }
    const modal = new bootstrap.Modal(document.getElementById('videoModal'));
    const iframe = document.getElementById('videoModalIframe');
    const title = document.getElementById('videoModalTitle');
    iframe.src = '';
    setTimeout(() => { iframe.src = videoUrl + '?autoplay=1&rel=0'; }, 200);
    title.innerHTML = `<i class="bi bi-play-circle me-2 text-primary-custom"></i> ${muscle} Tutorial`;
    modal.show();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔥 1. BMI CALCULATOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function calculateBMI(weight, heightCm) {
    const heightM = heightCm / 100;
    return weight / (heightM * heightM);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return { category: 'Underweight', color: '#ffc107', message: 'You are underweight. Consider a balanced diet to gain muscle.' };
    if (bmi < 25) return { category: 'Normal', color: '#4caf50', message: 'You are in the healthy weight range. Keep up the good work!' };
    if (bmi < 30) return { category: 'Overweight', color: '#ff9800', message: 'You are overweight. Consider regular exercise and portion control.' };
    return { category: 'Obese', color: '#f44336', message: 'You are in the obese range. Consult a healthcare professional for guidance.' };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔥 2. WEIGHT TRACKER (with Chart)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let weightChartInstance = null;

function getWeightEntries() {
    try { return JSON.parse(localStorage.getItem(WEIGHT_KEY)) || []; } catch { return []; }
}
function saveWeightEntries(entries) {
    localStorage.setItem(WEIGHT_KEY, JSON.stringify(entries));
}

function renderWeightChart() {
    const entries = getWeightEntries();
    const ctx = document.getElementById('weightChart').getContext('2d');
    if (weightChartInstance) weightChartInstance.destroy();

    const labels = entries.map(e => e.date);
    const data = entries.map(e => e.weight);

    weightChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Weight (kg)',
                data: data,
                borderColor: '#e63946',
                backgroundColor: 'rgba(230, 57, 70, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#e63946'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#fff' } }
            },
            scales: {
                y: { beginAtZero: false, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#fff' } },
                x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#fff' } }
            }
        }
    });

    // Update history list
    const list = document.getElementById('weightHistoryList');
    if (!list) return;
    list.innerHTML = '';
    entries.slice().reverse().slice(0, 5).forEach(e => {
        const li = document.createElement('li');
        li.textContent = `${e.date}: ${e.weight} kg`;
        list.appendChild(li);
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔥 3. WORKOUT LOG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function getWorkoutLogs() {
    try { return JSON.parse(localStorage.getItem(WORKOUT_LOG_KEY)) || []; } catch { return []; }
}
function saveWorkoutLogs(logs) {
    localStorage.setItem(WORKOUT_LOG_KEY, JSON.stringify(logs));
}

function renderWorkoutLogs() {
    const logs = getWorkoutLogs();
    const tbody = document.getElementById('workoutLogBody');
    if (!tbody) return;
    if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-muted text-center">No logs yet. Start tracking!</td></tr>';
        return;
    }
    tbody.innerHTML = '';
    logs.slice().reverse().forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${log.exercise}</td>
            <td>${log.sets}</td>
            <td>${log.reps}</td>
            <td>${log.weight} kg</td>
        `;
        tbody.appendChild(tr);
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔥 4. WATER TRACKER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function getWaterCount() {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem(WATER_KEY) || '{}');
    return data[today] || 0;
}

function setWaterCount(count) {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem(WATER_KEY) || '{}');
    if (count < 0) count = 0;
    if (count > 8) count = 8;
    data[today] = count;
    localStorage.setItem(WATER_KEY, JSON.stringify(data));
    updateWaterUI();
}

function updateWaterUI() {
    const count = getWaterCount();
    const el = document.getElementById('waterCount');
    const progress = document.getElementById('waterProgress');
    const icon = document.getElementById('waterIcon');
    if (el) el.textContent = count;
    if (progress) progress.style.width = `${(count / 8) * 100}%`;
    if (icon) {
        if (count === 0) icon.textContent = '💧';
        else if (count < 4) icon.textContent = '🚰';
        else if (count < 6) icon.textContent = '💦';
        else if (count < 8) icon.textContent = '🌊';
        else icon.textContent = '🏆';
    }
}

function addWater(delta) {
    let count = getWaterCount();
    count += delta;
    if (count < 0) count = 0;
    if (count > 8) count = 8;
    setWaterCount(count);
    if (delta > 0 && count === 8) showToast('success', '🎉 Amazing! You hit your 8 glass water goal!');
}

function resetWater() {
    setWaterCount(0);
    showToast('info', 'Water tracker reset for today.');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  NUTRITION TRACKER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderNutritionLogs() {
    const list = document.getElementById('foodLogList');
    if (!list) return;
    const logs = getNutritionLogs();
    if (logs.length === 0) { list.innerHTML = '<li class="text-muted">No meals logged yet. Add one above!</li>'; return; }
    list.innerHTML = '';
    logs.slice().reverse().forEach(log => {
        const li = document.createElement('li');
        li.className = 'py-2 border-bottom border-secondary border-opacity-10 d-flex justify-content-between';
        li.innerHTML = `<span>${log.food}</span><span class="text-primary-custom">${log.calories} kcal</span>`;
        list.appendChild(li);
    });
}

function addNutritionLog(food, calories) {
    const logs = getNutritionLogs();
    logs.push({ food, calories, date: new Date().toISOString() });
    saveNutritionLogs(logs);
    renderNutritionLogs();
    showToast('success', `✅ Logged: ${food} (${calories} kcal)`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EVENT LISTENERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── Register ──
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const plan = document.getElementById('regPlan').value;
    if (!name || !email || !password) { showToast('error', 'Please fill in all fields.'); return; }
    if (password.length < 6) { showToast('error', 'Password must be at least 6 characters.'); return; }
    if (registerUser(name, email, password, plan)) {
        const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        if (modal) modal.hide();
        if (loginUser(email, password)) updateUI();
        this.reset();
    }
});

// ── Login ──
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) { showToast('error', 'Please enter email and password.'); return; }
    if (loginUser(email, password)) {
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (modal) modal.hide();
        this.reset();
        updateUI();
    }
});

// ── Logout ──
document.getElementById('logoutBtn').addEventListener('click', function(e) { e.preventDefault(); handleLogout(); });

// ── Nutrition Form ──
document.getElementById('nutritionForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const food = document.getElementById('foodItem').value.trim();
    const calories = parseInt(document.getElementById('foodCalories').value.trim());
    if (!food || !calories) { showToast('error', 'Please enter both food name and calories.'); return; }
    if (isNaN(calories) || calories <= 0) { showToast('error', 'Please enter a valid calorie number.'); return; }
    addNutritionLog(food, calories);
    this.reset();
});

// ── Video Watch Buttons ──
document.querySelectorAll('.watch-video-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const muscle = this.getAttribute('data-muscle');
        if (muscle && VIDEO_LINKS[muscle]) showVideo(muscle);
        else if (muscle) { showToast('info', `Showing default tutorial.`); showVideo('Chest'); }
        else showToast('error', 'Video not available.');
    });
});

// ── Nav links ──
document.querySelectorAll('.navbar .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const target = this.getAttribute('href');
        if (target && target.startsWith('#')) {
            e.preventDefault();
            const el = document.querySelector(target);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            const nav = document.getElementById('navMenu');
            const bsCollapse = bootstrap.Collapse.getInstance(nav);
            if (bsCollapse) bsCollapse.hide();
        }
    });
});

// ── Tab click for workout sections (NOW TRIGGERS WORKOUT START) ──
document.querySelectorAll('#planTabs .nav-link').forEach(tab => {
    // Jab tab click ho, workout start karo
    tab.addEventListener('click', function(e) {
        let plan = '';
        const id = this.id;
        if (id === 'single-tab') plan = 'Single Muscle';
        else if (id === 'double-tab') plan = 'Double Muscle';
        else if (id === 'ppl-tab') plan = 'Push Pull Leg';
        
        if (plan) {
            // Ye wahi function hai jo Dashboard ke buttons use karte hain
            startWorkout(plan);
        }
    });
    
    // URL hash update karne ke liye (purana functionality)
    tab.addEventListener('shown.bs.tab', function(e) {
        const target = this.getAttribute('data-bs-target');
        if (target) {
            history.replaceState(null, '', '#workouts');
        }
    });
});
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔥 NEW FEATURES EVENT LISTENERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── BMI ──
document.getElementById('bmiForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const height = parseFloat(document.getElementById('bmiHeight').value);
    if (!weight || !height || weight <= 0 || height <= 0) {
        showToast('error', 'Please enter valid weight and height.');
        return;
    }
    const bmi = calculateBMI(weight, height);
    const info = getBMICategory(bmi);
    const resultDiv = document.getElementById('bmiResult');
    resultDiv.style.display = 'block';
    document.getElementById('bmiValue').textContent = bmi.toFixed(1);
    document.getElementById('bmiValue').style.color = info.color;
    document.getElementById('bmiCategory').textContent = info.category;
    document.getElementById('bmiCategory').style.color = info.color;
    document.getElementById('bmiMessage').textContent = info.message;
});

// ── Weight Tracker ──
document.getElementById('weightForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const date = document.getElementById('weightDate').value;
    const weight = parseFloat(document.getElementById('weightValue').value);
    if (!date || !weight) { showToast('error', 'Please enter date and weight.'); return; }
    const entries = getWeightEntries();
    // Check if entry exists for date
    const existingIndex = entries.findIndex(e => e.date === date);
    if (existingIndex !== -1) {
        entries[existingIndex].weight = weight;
    } else {
        entries.push({ date, weight });
    }
    saveWeightEntries(entries);
    renderWeightChart();
    showToast('success', `✅ Weight logged for ${date}: ${weight} kg`);
    this.reset();
    // Set today's date as default
    document.getElementById('weightDate').value = new Date().toISOString().split('T')[0];
});

// ── Workout Log ──
document.getElementById('workoutLogForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const exercise = document.getElementById('logExercise').value.trim();
    const sets = parseInt(document.getElementById('logSets').value);
    const reps = parseInt(document.getElementById('logReps').value);
    const weight = parseFloat(document.getElementById('logWeight').value);
    if (!exercise || !sets || !reps || weight < 0) { showToast('error', 'Please fill all fields correctly.'); return; }
    const logs = getWorkoutLogs();
    logs.push({ exercise, sets, reps, weight, date: new Date().toISOString() });
    saveWorkoutLogs(logs);
    renderWorkoutLogs();
    showToast('success', `✅ Logged: ${exercise} (${sets}x${reps} @ ${weight}kg)`);
    this.reset();
});

// ── Water Tracker (Initial load & reset) ──
document.addEventListener('DOMContentLoaded', function() {
    updateUI();
    renderNutritionLogs();
    renderWeightChart();
    renderWorkoutLogs();
    updateWaterUI();

    // Set default date for weight tracker
    const weightDateInput = document.getElementById('weightDate');
    if (weightDateInput) {
        weightDateInput.value = new Date().toISOString().split('T')[0];
    }

    if (window.location.hash) {
        setTimeout(() => {
            const el = document.querySelector(window.location.hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SEED DEMO USER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(function seedDemoUser() {
    const users = getUsers();
    if (!users['demo@ironforge.com']) {
        users['demo@ironforge.com'] = {
            name: 'Demo User',
            email: 'demo@ironforge.com',
            password: 'demo123',
            plan: 'Pro',
            joined: 'January 2025',
            workoutsCompleted: 8,
            streak: 4,
            currentPlan: 'Push Pull Leg'
        };
        saveUsers(users);
    }
})();

console.log('🏋️ IronForge Gym - 4 New Features Added!');
console.log('📧 Demo login: demo@ironforge.com / demo123');
console.log('1️⃣ BMI Calculator');
console.log('2️⃣ Weight Tracker with Chart');
console.log('3️⃣ Workout Log');
console.log('4️⃣ Water Tracker');