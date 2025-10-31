// Espera a que todo el contenido del DOM (la página HTML) se haya cargado
document.addEventListener('DOMContentLoaded', () => {

    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // --- 1. Función Asíncrona para Cargar Contenido ---
    // Usamos 'async/await' para que sea más fácil de leer
    async function loadContent(url) {
        try {
            // 'fetch' va a la URL y obtiene la respuesta
            const response = await fetch(url);

            // Si la respuesta no es exitosa (ej. 404 - No Encontrado)
            if (!response.ok) {
                // Lanza un error que será capturado por el 'catch'
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Si todo OK, convierte la respuesta en texto (el HTML del archivo parcial)
            const html = await response.text();

            // Inserta ese HTML dentro de nuestro contenedor <div id="main-content">
            mainContent.innerHTML = html;
            // llamamos a la función que busca los nuevos botones.
            addDynamicLinkListeners();
            // Actualiza el estado activo del navbar
            updateActiveLink(url);
            // Mueve el scroll arriba
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            // Si algo falla (ej. no hay conexión, error 404)
            console.error('Error al cargar la página:', error);
            // Muestra un mensaje amigable al usuario
            mainContent.innerHTML = '<div class="alert alert-danger">Error al cargar el contenido. Por favor, intente más tarde.</div>';
        }
    }

    // Función para actualizar el enlace activo en el navbar
    function addDynamicLinkListeners() {
        // Busca enlaces con la clase '.nav-link-dynamic' DENTRO del mainContent
        mainContent.querySelectorAll('.nav-link-dynamic').forEach(link => {
            
            // Evita que se añada el mismo listener varias veces (aunque en este
            // caso no pasaría nada porque se regenera el HTML)
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const pageUrl = event.target.getAttribute('href');
                if (pageUrl) {
                    loadContent(pageUrl);
                }
            });
        });
    }

    // Función para actualizar la clase 'active' en el navbar
    function updateActiveLink(url) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === url) {
                link.classList.add('active'); // 'active' es una clase de Bootstrap
            } else {
                link.classList.remove('active');
            }
        });
    }
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageUrl = event.target.getAttribute('href');
            if (pageUrl) {
                loadContent(pageUrl);
            }
        });
    });

    // ---Cargar la página de inicio por defecto ---
    // Al cargar la web, mostramos 'home.html' automáticamente
    loadContent('webs/home.html');

    // --- 3. Añadir "Listeners" a los enlaces del Navbar ---
    // Selecciona TODOS los enlaces (<a class="nav-link">) dentro del menú
    document.querySelectorAll('.navbar-nav .nav-link .foot-link').forEach(link => {
        
        // Por cada enlace, añade un "detector de clics"
        link.addEventListener('click', (event) => {
            
            // ¡MUY IMPORTANTE!
            // Evita que el enlace haga su acción por defecto (que es recargar la página)
            event.preventDefault(); 
            
            // Obtiene la URL del atributo href del enlace en el que se hizo clic
            const pageUrl = event.target.getAttribute('href');

            // Llama a nuestra función para cargar ese contenido
            if (pageUrl) {
                loadContent(pageUrl);
            }
        });
    });
    
document.querySelectorAll('footer .list-unstyled a').forEach(link => {
        
        // Añade un "detector de clics" a cada uno
        link.addEventListener('click', (event) => {
            
            // Evita que el enlace recargue la página
            event.preventDefault(); 
            
            // Obtiene la URL del atributo href
            const pageUrl = event.target.getAttribute('href');

            // Llama a la función para cargar el contenido
            if (pageUrl) {
                loadContent(pageUrl);
            }
        });
    });
});