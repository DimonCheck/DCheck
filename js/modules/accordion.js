// js/modules/accordion.js
(function() {
    function initAccordion() {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.removeEventListener('click', accordionHandler);
            header.addEventListener('click', accordionHandler);
        });
    }

    function accordionHandler(e) {
        const header = e.currentTarget;
        const targetId = header.dataset.target;
        const body = document.getElementById(targetId);
        if (!body) return;

        // Закрываем все остальные блоки
        document.querySelectorAll('.accordion-body').forEach(b => {
            if (b !== body) {
                b.classList.remove('open');
                b.previousElementSibling?.classList.remove('open');
            }
        });

        body.classList.toggle('open');
        header.classList.toggle('open');
    }

    // Запускаем при загрузке и при динамической подгрузке контента
    document.addEventListener('DOMContentLoaded', initAccordion);
    document.addEventListener('contentLoaded', initAccordion);
})();