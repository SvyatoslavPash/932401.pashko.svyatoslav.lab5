/* ============================================================
   ЛР5: DOM и взаимодействие с элементами страницы
   Вариант 16. «Предприниматель и стартапер» — идеи с метриками
   ============================================================ */
const dailyRevenues = [12000, 1000, 1500, 1000, 2500, 1000, 1000];

function calculateSum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) sum += arr[i];
    return sum;
}
function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) if (arr[i] > max) max = arr[i];
    return max;
}
function filterRevenue(arr, threshold) {
    const out = [];
    for (let i = 0; i < arr.length; i++) if (arr[i] > threshold) out.push(arr[i]);
    return out;
}
function analyzeStartup(arr) {
    const total = calculateSum(arr);
    const max   = findMax(arr);
    const avg   = total / arr.length;
    const high  = filterRevenue(arr, 10000);
    let low = 0;
    for (let i = 0; i < arr.length; i++) if (arr[i] <= 3000) low++;
    console.log('=== ДАННЫЕ СТАРТАПА ===');
    console.log('Общая выручка:', total, '₽; высоких дней:', high.length);
    console.log('Максимум:', max, '₽; средняя:', avg.toFixed(2), '₽');
    console.log('Доля низких дней:', ((low / arr.length) * 100).toFixed(1) + '%');
    if (avg < 5000) console.log('Стоит проанализировать причины низкой выручки');
    else            console.log('Показатели в норме.');
}
analyzeStartup(dailyRevenues);


const STORAGE_IDEAS = 'startup_ideas';
const STORAGE_THEME = 'startup_theme';

const DEFAULT_IDEAS = [
    { id: 1, title: 'AI-тренер по силовым видам спорта', audience: 'Спортсмены-любители, пауэрлифтеры', metric: '10 000 MAU' },
    { id: 2, title: 'Хаб автомобильных прошивок',         audience: 'Владельцы японских авто',          metric: '5 000 MAU'  },
    { id: 3, title: 'Облачная среда для C++',              audience: 'Студенты IT-специальностей',        metric: '1 000 MAU'  },
    { id: 4, title: 'Генератор 2D ассетов',                audience: 'Инди-разработчики игр',              metric: '20 000 MAU' }
];

let ideas = [];

function checkExists(el, name) {
    if (!el) {
        console.error('Элемент не найден: ' + name);
        return false;
    }
    return true;
}

function loadIdeasFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_IDEAS);
        if (!raw) return DEFAULT_IDEAS.slice();
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : DEFAULT_IDEAS.slice();
    } catch (e) {
        console.error('Ошибка чтения идей из localStorage:', e);
        return DEFAULT_IDEAS.slice();
    }
}
function saveIdeasToStorage() {
    try {
        localStorage.setItem(STORAGE_IDEAS, JSON.stringify(ideas));
    } catch (e) {
        console.error('Ошибка сохранения идей:', e);
    }
}

function loadTheme() {
    try { return localStorage.getItem(STORAGE_THEME) || 'light'; }
    catch (e) { console.error('Ошибка чтения темы:', e); return 'light'; }
}
function saveTheme(theme) {
    try { localStorage.setItem(STORAGE_THEME, theme); }
    catch (e) { console.error('Ошибка сохранения темы:', e); }
}
function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-theme', isDark);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = isDark ? '☀️ Светлая тема' : '🌙 Тёмная тема';
    saveTheme(theme);
}

function renderIdeas() {
    const container = document.querySelector('#ideas-container');
    if (!checkExists(container, '#ideas-container')) return;

    container.innerHTML = '';

    ideas.forEach(function (idea) {
        const card = document.createElement('article');
        card.className = 'idea-card';
        card.setAttribute('data-id', idea.id); 

        const h3 = document.createElement('h3');
        h3.textContent = idea.title;           

        const aud = document.createElement('p');
        const audStrong = document.createElement('strong');
        audStrong.textContent = 'Целевая аудитория: ';
        aud.appendChild(audStrong);
        aud.appendChild(document.createTextNode(idea.audience));

        const met = document.createElement('p');
        const metStrong = document.createElement('strong');
        metStrong.textContent = 'Метрика: ';
        met.appendChild(metStrong);
        met.appendChild(document.createTextNode(idea.metric));

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'delete-btn';
        delBtn.textContent = 'Удалить';
        delBtn.addEventListener('click', function () {
            deleteIdeaById(idea.id);
        });

        card.appendChild(h3);
        card.appendChild(aud);
        card.appendChild(met);
        card.appendChild(delBtn);
        container.appendChild(card);
    });

    const allCards = document.querySelectorAll('.idea-card');
    console.log('[querySelectorAll] Карточек на странице: ' + allCards.length);
}

function addIdea(title, audience, metric) {
    if (!title || !audience || !metric) {
        alert('Заполните все поля!');
        return;
    }
    const newId = ideas.length ? Math.max.apply(null, ideas.map(function (i) { return i.id; })) + 1 : 1;
    ideas.push({ id: newId, title: title, audience: audience, metric: metric });
    saveIdeasToStorage();
    renderIdeas();
}

function deleteIdeaById(id) {
    ideas = ideas.filter(function (i) { return i.id !== id; });
    saveIdeasToStorage();
    renderIdeas();
}

function deleteLastIdea() {
    if (ideas.length === 0) {
        alert('Список идей пуст — удалять нечего.');
        return;
    }
    ideas.pop();
    saveIdeasToStorage();
    renderIdeas();
}

function toggleIdeasVisibility() {
    const container = document.getElementById('ideas-container');
    const btn       = document.getElementById('toggle-ideas');
    if (!checkExists(container, '#ideas-container') || !checkExists(btn, '#toggle-ideas')) return;

    const isHidden = container.style.display === 'none';
    container.style.display = isHidden ? '' : 'none';
    btn.textContent = isHidden ? 'Скрыть идеи' : 'Показать идеи';
}

document.addEventListener('DOMContentLoaded', function () {
    const themeBtn   = document.getElementById('theme-toggle');
    const addBtn     = document.getElementById('add-idea');
    const delLastBtn = document.getElementById('delete-last');
    const toggleBtn  = document.getElementById('toggle-ideas');
    const form       = document.getElementById('idea-form');

    checkExists(themeBtn,   '#theme-toggle');
    checkExists(addBtn,     '#add-idea');
    checkExists(delLastBtn, '#delete-last');
    checkExists(toggleBtn,  '#toggle-ideas');
    checkExists(form,       '#idea-form');

    ideas = loadIdeasFromStorage();
    renderIdeas();
    applyTheme(loadTheme());

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            const isDark = document.body.classList.contains('dark-theme');
            applyTheme(isDark ? 'light' : 'dark');
        });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const title    = form.querySelector('input[name="idea-title"]').value.trim();
            const audience = form.querySelector('input[name="idea-audience"]').value.trim();
            const metric   = form.querySelector('input[name="idea-metric"]').value.trim();
            addIdea(title, audience, metric);
            form.reset();
        });
    }

    if (delLastBtn) delLastBtn.addEventListener('click', deleteLastIdea);
    if (toggleBtn)  toggleBtn.addEventListener('click', toggleIdeasVisibility);

    console.log('ЛР №5: скрипт успешно инициализирован.');
});