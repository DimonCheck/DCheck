// js/modules/blog.js
(function() {
    const POSTS_URL = 'data/posts.json';

    async function loadPosts() {
        try {
            const response = await fetch(POSTS_URL);
            if (!response.ok) throw new Error('Не удалось загрузить статьи');
            const data = await response.json();
            return data.posts || [];
        } catch (error) {
            console.error('Ошибка загрузки постов:', error);
            return [];
        }
    }

    function renderPostList(posts) {
        const container = document.getElementById('posts-list');
        if (!container) return;

        if (posts.length === 0) {
            container.innerHTML = '<p>Статей пока нет. Скоро появятся!</p>';
            return;
        }

        container.innerHTML = posts.map(post => `
            <div class="post-item" data-id="${post.id}">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-meta">📅 ${post.date} · ⏱️ ${post.readingTime || '?'} мин · 🏷️ ${post.tags ? post.tags.join(', ') : ''}</div>
                <p class="post-preview">${post.preview}</p>
                <button class="read-more-btn" data-id="${post.id}">Читать далее →</button>
            </div>
        `).join('');

        container.querySelectorAll('.read-more-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.dataset.id;
                openPost(postId);
            });
        });
    }

    function openPost(postId) {
        loadPosts().then(posts => {
            const post = posts.find(p => p.id === postId);
            if (!post) {
                alert('Статья не найдена');
                return;
            }

            const content = document.getElementById('content');
            if (!content) return;

            content.innerHTML = `
                <div class="post-full">
                    <button id="back-to-list" class="back-btn">← Назад к списку</button>
                    <h2>${post.title}</h2>
                    <div class="post-meta">📅 ${post.date} · ⏱️ ${post.readingTime || '?'} мин · 🏷️ ${post.tags ? post.tags.join(', ') : ''}</div>
                    <div class="post-content">${post.content}</div>
                </div>
            `;

            document.getElementById('back-to-list').addEventListener('click', function() {
                renderBlogPage();
            });

            document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.menu-btn[data-page="blog"]')?.classList.add('active');
        });
    }

    function renderBlogPage() {
        const content = document.getElementById('content');
        if (!content) return;

        // Загружаем HTML-шаблон страницы блога
        fetch('pages/blog.html')
            .then(res => res.text())
            .then(html => {
                content.innerHTML = html;
                return loadPosts();
            })
            .then(posts => {
                renderPostList(posts);
            })
            .catch(err => {
                console.error('Ошибка загрузки страницы блога:', err);
                content.innerHTML = '<h2>📝 Блог</h2><p>Не удалось загрузить страницу блога.</p>';
            });
    }

    function initBlog() {
        const content = document.getElementById('content');
        if (!content) return;

        // Проверяем, есть ли уже список постов на странице
        if (document.getElementById('posts-list')) {
            loadPosts().then(posts => renderPostList(posts));
        }
    }

    document.addEventListener('DOMContentLoaded', initBlog);
    document.addEventListener('contentLoaded', initBlog);

    window.BlogModule = {
        renderBlogPage,
        openPost,
        loadPosts
    };
})();