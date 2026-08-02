// js/modules/search.js
(function() {
    // Данные для поиска (берутся из основного объекта pages)
    let searchData = [];

    function buildSearchIndex(pages) {
        searchData = [];
        for (const [id, content] of Object.entries(pages)) {
            // Убираем HTML-теги и получаем чистый текст
            const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            searchData.push({ id, text, content: content });
        }
    }

    function search(query) {
        const q = query.toLowerCase().trim();
        if (!q) return [];
        return searchData.filter(item => item.text.toLowerCase().includes(q));
    }

    function renderSearchResults(results) {
        const container = document.getElementById('search-results');
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = '<p>Ничего не найдено.</p>';
            return;
        }

        container.innerHTML = results.map(item => `
            <div class="search-result-item" data-page="${item.id}">
                <div class="title">${item.id.charAt(0).toUpperCase() + item.id.slice(1)}</div>
                <div class="preview">${item.text.slice(0, 150)}...</div>
            </div>
        `).join('');

        // Клик по результату переключает страницу
        container.querySelectorAll('.search-result-item').forEach(el => {
            el.addEventListener('click', () => {
                const pageId = el.dataset.page;
                if (window.loadPage && typeof window.loadPage === 'function') {
                    window.loadPage(pageId);
                    // Скрываем результаты
                    container.innerHTML = '';
                }
            });
        });
    }

    // Экспортируем функции в глобальный объект
    window.SearchModule = {
        buildSearchIndex,
        search,
        renderSearchResults
    };
})();