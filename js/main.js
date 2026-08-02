// js/main.js
const contentEl = document.getElementById('content');
const menuBtns = document.querySelectorAll('.menu-btn');

// ===== ПРИВЕТСТВИЕ ПО ВРЕМЕНИ =====
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 6) return '🌙 Доброй ночи';
    if (hour < 12) return '🌅 Доброе утро';
    if (hour < 18) return '☀️ Добрый день';
    return '🌆 Добрый вечер';
}

// ===== ДИНАМИЧЕСКАЯ ГЛАВНАЯ СТРАНИЦА =====
function renderHomePage() {
    const content = document.getElementById('content');
    if (!content) return;

    // Загружаем шаблон из pages.json
    fetch('data/pages.json')
        .then(res => res.json())
        .then(data => {
            const homeData = data.home;
            if (!homeData) return;

            // Вставляем приветствие + контент
            content.innerHTML = `
                <h2>${getGreeting()}!</h2>
                <p>Добро пожаловать на мой цифровой профиль. Здесь я собираю проекты, мысли и инструменты.</p>
                <p>📌 <span id="stats"></span></p>
                <div id="recent-posts"></div>
                <div id="recent-tools"></div>
            `;

            // Загружаем статистику
            loadStats();

            // Загружаем последние статьи
            loadRecentPosts();

            // Загружаем активные инструменты
            loadRecentTools();
        });
}

function loadStats() {
    Promise.all([
        fetch('data/posts.json').then(r => r.json()).then(d => d.posts || []),
        fetch('data/tools.json').then(r => r.json()).then(d => d.tools || []),
        fetch('data/pages.json').then(r => r.json()).then(d => {
            const projects = d.about?.projects || [];
            return projects;
        })
    ]).then(([posts, tools, projects]) => {
        const statsEl = document.getElementById('stats');
        if (statsEl) {
            statsEl.textContent = `${posts.length} статей, ${tools.length} инструментов, ${projects.length} проектов`;
        }
    });
}

function loadRecentPosts() {
    fetch('data/posts.json')
        .then(res => res.json())
        .then(data => {
            const posts = data.posts || [];
            const latestPosts = posts.slice(-2).reverse();
            const container = document.getElementById('recent-posts');
            if (container) {
                container.innerHTML = `
                    <h3 style="margin-top: 2rem; margin-bottom: 0.5rem;">📝 Последние статьи</h3>
                    ${latestPosts.map(post => `
                        <div class="post-preview" style="padding: 0.5rem 0; border-bottom: 1px solid var(--border);">
                            <a href="#" onclick="loadPage('blog'); return false;" style="font-weight: 500; color: var(--text-primary);">${post.title}</a>
                            <span style="color: var(--text-muted); font-size: 0.9rem; margin-left: 0.5rem;">${post.date}</span>
                        </div>
                    `).join('')}
                `;
            }
        });
}

function loadRecentTools() {
    fetch('data/tools.json')
        .then(res => res.json())
        .then(data => {
            const tools = data.tools || [];
            const activeTools = tools.filter(t => t.status === 'ready');
            const container = document.getElementById('recent-tools');
            if (container) {
                container.innerHTML = `
                    <h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem;">🛠️ Активные инструменты</h3>
                    ${activeTools.length ? activeTools.map(tool => `
                        <span style="background: var(--bg-body); padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.9rem; display: inline-block; margin: 0.2rem;">${tool.title}</span>
                    `).join(' ') : '<p style="color: var(--text-muted);">Пока нет активных инструментов</p>'}
                `;
            }
        });
}

// ===== ОСНОВНАЯ ЛОГИКА ЗАГРУЗКИ СТРАНИЦ =====
function loadPage(pageId) {
    // Блог
    if (pageId === 'blog') {
        menuBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.menu-btn[data-page="blog"]`)?.classList.add('active');
        if (window.BlogModule) {
            window.BlogModule.renderBlogPage();
        } else {
            contentEl.innerHTML = '<p>Модуль блога не загружен</p>';
        }
        return;
    }

    // Инструменты
    if (pageId === 'tools') {
        menuBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.menu-btn[data-page="tools"]`)?.classList.add('active');
        const html = `
            <h2>🛠️ Инструменты</h2>
            <p>Здесь будут полезные инструменты, которые я создал или использую.</p>
            <div id="tools-list"></div>
        `;
        contentEl.innerHTML = html;
        if (window.ToolsModule) {
            window.ToolsModule.renderTools(document.getElementById('tools-list'));
        }
        return;
    }

    // Главная страница
    if (pageId === 'home') {
        menuBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.menu-btn[data-page="home"]`)?.classList.add('active');
        renderHomePage();
        return;
    }

    // Остальные страницы — через PageLoader
    if (window.PageLoader) {
        window.PageLoader.renderPage(pageId, contentEl);
    } else {
        contentEl.innerHTML = '<p>Модуль загрузки не загружен</p>';
    }

    // Обновляем активную кнопку
    menuBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.menu-btn[data-page="${pageId}"]`)?.classList.add('active');
}

window.loadPage = loadPage;

// Обработчики кликов
menuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        if (page) loadPage(page);
    });
});

// Загрузка по умолчанию
document.addEventListener('DOMContentLoaded', () => {
    loadPage('home');
});
