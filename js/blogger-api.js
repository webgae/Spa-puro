const API_KEY = 'AIzaSyBFBbH1SQkSZf1LJzammWAe2karh5mG9rQ';
const BLOG_ID = '2756493429384988662';
const POSTS_POR_PAGINA = 5;

let paginaActual = 1;
let tokenSiguiente = '';
let tokenAnterior = [];
let categoriaSeleccionada = '';

// Funciones utilitarias
function crearSlug(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);
}

function crearExtracto(contenidoHTML, longitud = 200) {
    const temp = document.createElement('div');
    temp.innerHTML = contenidoHTML;
    const texto = temp.textContent || temp.innerText;
    return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto;
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function scrollToTop() {
    const inicioElement = document.getElementById('inicio');
    if (inicioElement) {
        inicioElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Funciones para el listado de posts
async function obtenerCategorias() {
    try {
        const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=500`;
        const response = await fetch(url);
        const data = await response.json();
        const posts = data.items || [];
        
        const categoriasUnicas = new Set();
        posts.forEach(post => {
            if (post.labels && Array.isArray(post.labels)) {
                post.labels.forEach(label => categoriasUnicas.add(label));
            }
        });
        
        const categorias = Array.from(categoriasUnicas).sort();
        const selectCategorias = document.getElementById('categorias');
        
        while (selectCategorias.options.length > 1) {
            selectCategorias.remove(1);
        }
        
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            selectCategorias.appendChild(option);
        });
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
    }
}

function filtrarPorCategoria(categoria) {
    categoriaSeleccionada = categoria;
    paginaActual = 1;
    tokenAnterior = [];
    tokenSiguiente = '';
    obtenerPosts();
}

async function obtenerPosts(pageToken = '') {
    try {
        scrollToTop();
        
        let url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=${POSTS_POR_PAGINA}${pageToken ? '&pageToken=' + pageToken : ''}`;
        
        if (categoriaSeleccionada) {
            url += `&labels=${encodeURIComponent(categoriaSeleccionada)}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        const posts = data.items || [];
        
        tokenSiguiente = data.nextPageToken || '';
        
        actualizarControlesPaginacion();
        mostrarPosts(posts);
    } catch (error) {
        console.error("Error al obtener los posts:", error);
    }
}

function actualizarControlesPaginacion() {
    document.getElementById('siguiente').disabled = !tokenSiguiente;
    document.getElementById('anterior').disabled = paginaActual === 1;
    document.getElementById('info-pagina').textContent = `Página ${paginaActual}`;
}

function mostrarPosts(posts) {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
        let imagenUrl = 'https://via.placeholder.com/150';
        if (post.content) {
            const imgMatch = post.content.match(/<img.+?src="(.*?)"/);
            if (imgMatch) {
                imagenUrl = imgMatch[1];
            }
        }
        
        const extracto = crearExtracto(post.content);
        const slug = crearSlug(post.title);
        const postUrl = `#post?slug=${slug}&id=${post.id}`;
        
        postsContainer.innerHTML += `
            <div class="post">
                <div class="row">
                    <div><img class="left-round medium" src="${imagenUrl}" alt="${post.title}"></div>
                    <div class="max"><h2 class="small"><a href="${postUrl}">${post.title}</a></h2></div>
                </div>
                <p>${extracto}</p>
                <div class="small-space"></div>
                <div class="right-align">
                    <a class="link large-text underline" href="${postUrl}">Ver más</a> 
                </div>
                <div class="small-space"></div>
            </div>
            <hr class="medium">
        `;
    });
}

async function cambiarPagina(direccion) {
    if (direccion === 'siguiente' && tokenSiguiente) {
        tokenAnterior.push(tokenSiguiente);
        paginaActual++;
        await obtenerPosts(tokenSiguiente);
    } else if (direccion === 'anterior' && paginaActual > 1) {
        paginaActual--;
        tokenAnterior.pop();
        const tokenPaginaAnterior = tokenAnterior[tokenAnterior.length - 1] || '';
        await obtenerPosts(tokenPaginaAnterior);
    }
}

// Funciones para post individual
const postHandler = {
    async cargarPost(postId) {
        if (!postId) return;

        try {
            const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${postId}?key=${API_KEY}`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Post no encontrado');
            
            const post = await response.json();
            
            document.getElementById('post-title').textContent = post.title;
            document.getElementById('post-meta').textContent = `Publicado el ${formatearFecha(post.published)}`;
            
            let contenido = post.content;
            contenido = contenido.replace(/<img/g, '<img class="post-image"');
            document.getElementById('post-content').innerHTML = contenido;

            aplicarEstilos();
        } catch (error) {
            console.error('Error al obtener el post:', error);
            document.getElementById('post-content').innerHTML = '<p>Error al cargar el post</p>';
        }
    }
};

function aplicarEstilos() {
    document.querySelectorAll('.post-image').forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '20px auto';
        img.style.borderRadius = '8px';
    });

    document.querySelectorAll('pre, code').forEach(bloque => {
        bloque.style.backgroundColor = '#f5f5f5';
        bloque.style.padding = '15px';
        bloque.style.borderRadius = '5px';
        bloque.style.overflow = 'auto';
        bloque.style.fontSize = '14px';
        bloque.style.lineHeight = '1.5';
        bloque.style.fontFamily = 'Consolas, Monaco, monospace';
    });
}
