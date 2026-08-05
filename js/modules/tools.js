// js/modules/tools.js
(function() {
    const TOOLS_URL = 'data/tools.json';

    function loadTools() {
        return fetch(TOOLS_URL)
            .then(res => {
                if (!res.ok) throw new Error('Ошибка загрузки инструментов');
                return res.json();
            })
            .then(data => data.tools || [])
            .catch(() => []);
    }

    function renderTools(container) {
        loadTools().then(tools => {
            if (!tools.length) {
                container.innerHTML = '<p>Инструментов пока нет</p>';
                return;
            }

            container.innerHTML = tools.map(tool => `
                <div class="tool-item" style="padding: 1rem 0; border-bottom: 1px solid var(--border);">
                    <h3>${tool.title}</h3>
                    <p>${tool.description}</p>
                    ${tool.url ? `<a href="${tool.url}" class="tool-link" style="color: var(--accent); text-decoration: none; font-weight: 500;">→ Открыть инструмент</a>` : ''}
                    <span class="tool-status" style="margin-left: 1rem; font-size: 0.8rem; color: var(--text-muted);">
                        ${tool.status === 'ready' ? '✅ Готов' : '⏳ Скоро'}
                    </span>
                </div>
            `).join('');
        });
    }

    window.ToolsModule = { renderTools, loadTools };
})();
