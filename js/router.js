class Router {
    constructor(routes) {
        this.routes = routes;
        this.contentDiv = document.getElementById('main-content');
        
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    handleRoute() {
        let hash = window.location.hash.slice(1) || '';
        const [route, params] = hash.split('?');
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === route);
        });

        const content = this.routes[route] || this.routes[''];
        this.contentDiv.innerHTML = content;
        
        // Inicializar contenido específico según la ruta
        if (route === 'blog' || route === '') {
            setTimeout(() => {
                obtenerCategorias();
                obtenerPosts();
            }, 0);
        } else if (route === 'post') {
            const urlParams = new URLSearchParams(params);
            const postId = urlParams.get('id');
            postHandler.cargarPost(postId);
        }

        this.contentDiv.classList.add('page');
        this.contentDiv.classList.remove('active');
        setTimeout(() => this.contentDiv.classList.add('active'), 10);
    }
}
