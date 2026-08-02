// js/modules/pageLoader.js
(function() {
    const PAGES_URL = 'data/pages.json';

    function renderPage(pageId, container) {
        fetch(PAGES_URL)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки JSON');
                return response.json();
            })
            .then(data => {
                console.log('✅ Данные загружены:', data);
                const pageData = data[pageId];
                if (!pageData) {
                    container.innerHTML = `<p>⚠️ Страница "${pageId}" не найдена.</p><p>Доступные ключи: ${Object.keys(data).join(', ')}</p>`;
                    return;
                }

                let html = `<h2>${pageData.title}</h2>`;

                // ========== СТРАНИЦА "ОБ АВТОРЕ" (с аккордеоном и проектами) ==========
                if (pageId === 'about') {
                    // Основной контент
                    html += `<div class="about-content">${pageData.content || ''}</div>`;

                    // Образование (аккордеон)
                    if (pageData.education && pageData.education.length) {
                        html += pageData.education.map((item, index) => `
                            <div class="accordion-item">
                                <button class="accordion-header" data-target="edu-${index}">
                                    <span>${item.title}</span>
                                    <span class="arrow">▾</span>
                                </button>
                                <div class="accordion-body" id="edu-${index}">
                                    ${item.content}
                                </div>
                            </div>
                        `).join('');
                    }

                    // Проекты (карточки)
                    if (pageData.projects && pageData.projects.length) {
                        html += `<div class="project-grid">`;
                        html += pageData.projects.map(project => `
                            <div class="project-card">
                                <h4>${project.title}</h4>
                                <p>${project.description}</p>
                                <a href="${project.url}" target="_blank">→ Подробнее</a>
                            </div>
                        `).join('');
                        html += `</div>`;
                    }
                } else {
                    // ========== ВСЕ ОСТАЛЬНЫЕ СТРАНИЦЫ ==========
                    html += pageData.content || '';
                }

                container.innerHTML = html;

                // Переинициализация аккордеона (если есть)
                document.querySelectorAll('.accordion-header').forEach(header => {
                    header.removeEventListener('click', accordionHandler);
                    header.addEventListener('click', accordionHandler);
                });

                document.dispatchEvent(new Event('contentLoaded'));
            })
            .catch(error => {
                console.error('❌ Ошибка загрузки данных:', error);
                container.innerHTML = `<p>❌ Не удалось загрузить данные. Проверьте консоль.</p>`;
            });
    }

    // Обработчик аккордеона
    function accordionHandler(e) {
        const header = e.currentTarget;
        const targetId = header.dataset.target;
        const body = document.getElementById(targetId);
        if (!body) return;

        document.querySelectorAll('.accordion-body').forEach(b => {
            if (b !== body) {
                b.classList.remove('open');
                b.previousElementSibling?.classList.remove('open');
            }
        });

        body.classList.toggle('open');
        header.classList.toggle('open');
    }

    window.PageLoader = { renderPage };
})();