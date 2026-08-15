// js/main.js
const contentEl = document.getElementById('content');
const menuBtns = document.querySelectorAll('.menu-btn');

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 6) return '      Доброй ночи';
    if (hour < 12) return '      Доброе утро';
    if (hour < 18) return '      Добрый день';
    return '      Добрый вечер';
}

function renderHomePage() {
    const content = document.getElementById('content');
    if (!content) return;

    fetch('data/pages.json')
        .then(res => res.json())
        .then(data => {
            const homeData = data.home;
            if (!homeData) return;

            content.innerHTML = `
                <div class="hero">
                    <h2>${getGreeting()}!</h2>
                    <p class="subtitle">Добро пожаловать на мой цифровой профиль. Здесь я собираю проекты, мысли и инструменты.</p>
                    <div class="stats-row" id="stats">
                        <!-- Статистика подставится через JS -->
                    </div>
                </div>
                <div id="recent-posts"></div>
                <div id="recent-tools"></div>
            `;

            loadStats();
            loadRecentPosts();
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
            statsEl.innerHTML = `
                <div class="stat-item">
                    <span class="num">${posts.length}</span>
                    <span class="label">статей</span>
                </div>
                <div class="stat-item">
                    <span class="num">${tools.length}</span>
                    <span class="label">инструментов</span>
                </div>
                <div class="stat-item">
                    <span class="num">${projects.length}</span>
                    <span class="label">проектов</span>
                </div>
            `;
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
                if (latestPosts.length) {
                    container.innerHTML = `
                        <h3 style="margin-top: 2rem; margin-bottom: 0.8rem;"> Последние статьи</h3>
                        <div class="posts-grid">
                            ${latestPosts.map(post => `
                                <div class="post-card" onclick="window.BlogModule.openPost('${post.id}')" style="cursor: pointer;">
                                    <div class="post-info">
                                        <span class="post-title-link">${post.title}</span>
                                        <span class="post-date"> ${post.date}</span>
                                    </div>
                                    <span class="post-tag">Читать →</span>
                                </div>
                            `).join('')}
                        </div>
                    `;
                } else {
                    container.innerHTML = `
                        <h3 style="margin-top: 2rem; margin-bottom: 0.5rem;"> Последние статьи</h3>
                        <p style="color: var(--text-muted);">Статей пока нет</p>
                    `;
                }
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
                if (activeTools.length) {
                    container.innerHTML = `
                        <h3 style="margin-top: 1.5rem; margin-bottom: 0.8rem;"> Активные инструменты</h3>
                        <div class="tools-grid">
                            ${activeTools.map(tool => `
                                <a href="${tool.url}" class="tool-card" style="text-decoration: none; cursor: pointer;">
                                    <span class="icon"></span>
                                    <span class="name">${tool.title.replace(/^[^\s]+\s/, '')}</span>
                                    <span class="status-badge">Готов</span>
                                </a>
                            `).join('')}
                        </div>
                    `;
                } else {
                    container.innerHTML = `
                        <h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem;"> Активные инструменты</h3>
                        <p style="color: var(--text-muted);">Пока нет активных инструментов</p>
                    `;
                }
            }
        });
}

function loadPage(pageId) {
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

    if (pageId === 'tools') {
        menuBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.menu-btn[data-page="tools"]`)?.classList.add('active');
        const html = `
            <h2> Инструменты</h2>
            <p>Здесь будут полезные инструменты, которые я создал или использую.</p>
            <div id="tools-list"></div>
        `;
        contentEl.innerHTML = html;
        if (window.ToolsModule) {
            window.ToolsModule.renderTools(document.getElementById('tools-list'));
        }
        return;
    }

    if (pageId === 'home') {
        menuBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.menu-btn[data-page="home"]`)?.classList.add('active');
        renderHomePage();
        return;
    }

    if (window.PageLoader) {
        window.PageLoader.renderPage(pageId, contentEl);
    } else {
        contentEl.innerHTML = '<p>Модуль загрузки не загружен</p>';
    }

    menuBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.menu-btn[data-page="${pageId}"]`)?.classList.add('active');
}

window.loadPage = loadPage;

menuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        if (page) loadPage(page);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadPage('home');
});
