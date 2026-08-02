// js/main.js
const contentEl = document.getElementById('content');
const menuBtns = document.querySelectorAll('.menu-btn');

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