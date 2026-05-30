// ==========================================
// SİSTEM HAFIZASI (LOCALSTORAGE ENTEGRASYONU)
// ==========================================
let appData = {
    todos: [],
    goals: [],
    events: []
};

// Tarayıcı hafızasından verileri güvenli şekilde yükle
function loadSystemData() {
    const localData = localStorage.getItem('hayatos_web_data');
    if (localData) {
        appData = JSON.parse(localData);
    } else {
        // İlk kez açılıyorsa varsayılan şablonu oluştur
        appData = { todos: [], goals: [], events: [] };
        saveSystemData();
    }
}

// Verileri tarayıcı hafızasına kaydet ve güncelle
function saveSystemData() {
    localStorage.setItem('hayatos_web_data', JSON.stringify(appData));
    // Değişiklik olduğu an Master Dashboard'u arkada sessizce güncelle
    renderMasterDashboard();
}

// ==========================================
// DİNAMİK EKRAN DEĞİŞTİRME MEKANİZMASI
// ==========================================
function switchScreen(screenId) {
    // 1. Tüm ekranları görünmez yap
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    // 2. Sol menüdeki tüm butonların aktiflik ışığını söndür
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    
    // 3. Seçilen ekranı ve tıklandığı butonu aktifleştir (Neon ışıklarını yak)
    document.getElementById('screen-' + screenId).classList.add('active');
    
    // Tıklanan butona .active sınıfını ekle
    const clickedBtn = Array.from(document.querySelectorAll('.menu-btn')).find(b => b.getAttribute('onclick').includes(screenId));
    if (clickedBtn) clickedBtn.classList.add('active');

    // 4. Seçilen ekrana göre listeleri tazeleyerek ekrana bas
    if (screenId === 'todo') renderTodos();
    if (screenId === 'goals') renderGoals();
    if (screenId === 'calendar') renderEvents();
    if (screenId === 'master') renderMasterDashboard();
}

// ==========================================
// 1. CORE DIJITAL SAAT DÖNGÜSÜ (CANLI SANİYE)
// ==========================================
function updateClock() {
    const now = new Date();
    // Saati SS:DD:SS formatına böl ve ekrana bas
    const timeString = now.toTimeString().split(' ')[0];
    const clockEl = document.getElementById('clock');
    if (clockEl) clockEl.innerText = timeString;
}
setInterval(updateClock, 1000);
updateClock(); // İlk açılışta gecikmesiz çalışması için

// ==========================================
// 2. YAPILACAKLAR MATRİSİ (TO-DO) MANTIĞI
// ==========================================
function renderTodos() {
    const listContainer = document.getElementById('todo-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    
    if (appData.todos.length === 0) {
        listContainer.innerHTML = '<div style="color: #525260; padding: 20px;">Kayıtlı görev bulunamadı. Terminal boş.</div>';
        return;
    }

    appData.todos.forEach((todo, index) => {
        const row = document.createElement('div');
        row.className = 'item-row';
        row.innerHTML = `
            <span class="item-text">• ${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${index})">✕ SİL</button>
        `;
        listContainer.appendChild(row);
    });
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (text) {
        appData.todos.push({ text: text });
        saveSystemData();
        input.value = '';
        renderTodos();
    }
}

function deleteTodo(index) {
    appData.todos.splice(index, 1);
    saveSystemData();
    renderTodos();
}

// ==========================================
// 3. STRATEJİK VİZYON HEDEFLERİ MANTIĞI
// ==========================================
function renderGoals() {
    const listContainer = document.getElementById('goal-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (appData.goals.length === 0) {
        listContainer.innerHTML = '<div style="color: #525260; padding: 20px;">Kayıtlı vizyoner hedef bulunamadı.</div>';
        return;
    }

    appData.goals.forEach((goal, index) => {
        const row = document.createElement('div');
        row.className = 'item-row';
        
        const isChecked = goal.checked ? 'checked' : '';
        const crossTextStyle = goal.checked ? 'style="text-decoration: line-through; color: #1DB954;"' : '';

        row.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <input type="checkbox" ${isChecked} onchange="toggleGoal(${index})" style="width: 18px; height: 18px; cursor: pointer;">
                <span class="item-text" ${crossTextStyle}>${goal.text}</span>
            </div>
            <button class="delete-btn" onclick="deleteGoal(${index})">✕ SİL</button>
        `;
        listContainer.appendChild(row);
    });
}

function addGoal() {
    const input = document.getElementById('goal-input');
    const text = input.value.trim();
    if (text) {
        appData.goals.push({ text: text, checked: false });
        saveSystemData();
        input.value = '';
        renderGoals();
    }
}

function toggleGoal(index) {
    appData.goals[index].checked = !appData.goals[index].checked;
    saveSystemData();
    renderGoals();
}

function deleteGoal(index) {
    appData.goals.splice(index, 1);
    saveSystemData();
    renderGoals();
}

// ==========================================
// 4. AJANDA VE ETKİNLİK ZAMANLAYICI MANTIĞI
// ==========================================
function renderEvents() {
    const listContainer = document.getElementById('event-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (appData.events.length === 0) {
        listContainer.innerHTML = '<div style="color: #525260; padding: 20px;">Zaman tünelinde planlanan olay yok.</div>';
        return;
    }

    appData.events.forEach((ev, index) => {
        const row = document.createElement('div');
        row.className = 'item-row';
        row.innerHTML = `
            <span class="item-text" style="color: #BD00FF;">[${ev.date}] <span style="color: #E0E0E6;">➔ ${ev.title}</span></span>
            <button class="delete-btn" onclick="deleteEvent(${index})">✕ SİL</button>
        `;
        listContainer.appendChild(row);
    });
}

function addEvent() {
    const titleInput = document.getElementById('event-title-input');
    const dateInput = document.getElementById('event-date-input');
    const title = titleInput.value.trim();
    const date = dateInput.value.trim();

    if (title && date) {
        appData.events.push({ title: title, date: date });
        saveSystemData();
        titleInput.value = '';
        dateInput.value = '';
        renderEvents();
    }
}

function deleteEvent(index) {
    appData.events.splice(index, 1);
    saveSystemData();
    renderEvents();
}

// ==========================================
// 5. MASTER OPERATIONS DASHBOARD MATRIX
// ==========================================
function renderMasterDashboard() {
    const grid = document.getElementById('master-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Kart 1: Yapılacak Görevler Sistemi
    const todoCard = document.createElement('div');
    todoCard.className = 'matrix-card';
    let todoItems = appData.todos.slice(0, 5).map(t => `<div class="matrix-item">• ${t.text}</div>`).join('');
    if (appData.todos.length === 0) todoItems = '<div class="matrix-item" style="color: #525260;">Aktif görev yok.</div>';
    todoCard.innerHTML = `
        <div class="matrix-card-title">● YAPILACAK GÖREVLER SİSTEMİ</div>
        ${todoItems}
    `;
    grid.appendChild(todoCard);

    // Kart 2: Stratejik Hedefler Endeksi
    const goalCard = document.createElement('div');
    goalCard.className = 'matrix-card';
    let goalItems = appData.goals.slice(0, 5).map(g => {
        const status = g.checked ? '<span style="color: #1DB954;">[✓ COMPLETE]</span>' : '<span style="color: #BD00FF;">[PENDING]</span>';
        return `<div class="matrix-item">${status} ${g.text}</div>`;
    }).join('');
    if (appData.goals.length === 0) goalItems = '<div class="matrix-item" style="color: #525260;">Aktif vizyon kaydı yok.</div>';
    goalCard.innerHTML = `
        <div class="matrix-card-title">● STRATEJİK HEDEFLER ENDEKSİ</div>
        ${goalItems}
    `;
    grid.appendChild(goalCard);

    // Kart 3: Planlanan Zaman Kronolojisi
    const calCard = document.createElement('div');
    calCard.className = 'matrix-card';
    let eventItems = appData.events.slice(0, 5).map(e => `<div class="matrix-item">[${e.date}] ➔ ${e.title}</div>`).join('');
    if (appData.events.length === 0) eventItems = '<div class="matrix-item" style="color: #525260;">Zaman tüneli boş.</div>';
    calCard.innerHTML = `
        <div class="matrix-card-title">● PLANLANAN ZAMAN KRONOLOJİSİ</div>
        ${eventItems}
    `;
    grid.appendChild(calCard);
}

// ==========================================
// ENTER TUŞU İLE HIZLI EKLEME OTOMASYONU
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Giriş alanlarında Enter tuşunu yakala
    const todoInp = document.getElementById('todo-input');
    if (todoInp) todoInp.addEventListener("keypress", (e) => { if (e.key === "Enter") addTodo(); });

    const goalInp = document.getElementById('goal-input');
    if (goalInp) goalInp.addEventListener("keypress", (e) => { if (e.key === "Enter") addGoal(); });
    
    const evTitleInp = document.getElementById('event-title-input');
    const evDateInp = document.getElementById('event-date-input');
    if (evTitleInp) evTitleInp.addEventListener("keypress", (e) => { if (e.key === "Enter") addEvent(); });
    if (evDateInp) evDateInp.addEventListener("keypress", (e) => { if (e.key === "Enter") addEvent(); });
});

// ==========================================
// SİSTEM BAŞLANGICI (INITIALIZE SCRIPT)
// ==========================================
loadSystemData();