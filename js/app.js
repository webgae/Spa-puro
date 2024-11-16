import { homePage } from './pages/home.js';
import { aboutPage } from './pages/about.js';
import { contactPage } from './pages/contact.js';
import { blogPage } from './pages/blog.js';
import { postPage } from './pages/post.js';

const routes = {
    '': homePage,
    'about': aboutPage,
    'contact': contactPage,
    'blog': blogPage,
    'post': postPage
};

// Inicializar el router
const router = new Router(routes);