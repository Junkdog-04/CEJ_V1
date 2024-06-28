document.addEventListener("DOMContentLoaded", function() {
    // Selecciona la lista de navegación en el menú
    const nav = document.querySelector('nav ul');

    // Inicializa el Slick Slider (carrusel de imágenes)
    $('.slider').slick({
        dots: true, // Muestra puntos de navegación
        infinite: true, // Habilita el bucle infinito
        speed: 500, // Velocidad de la transición
        fade: true, // Habilita la transición de desvanecimiento
        cssEase: 'linear' // Tipo de animación CSS
    });

    // Remueve el preloader después de que la página haya cargado con un retraso
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.body.classList.add('loaded');
        }, 2300); // Ajusta el retraso aquí (2300ms = 2.3 segundos)
    });

    // Efecto de escritura en el campo de búsqueda
    const searchInput = document.getElementById('search-input');

    // Verificar si el elemento existe
    if (!searchInput) {
        console.error('El elemento con id "search-input" no se encontró en el DOM.');
        return; // Detener la ejecución si el elemento no se encuentra
    }

    const keywords = [
        'Derecho Civil',
        'Derecho Penal',
        'Derecho Laboral',
        'Derecho Constitucional',
        'Derecho Administrativo',
        'Derecho Internacional'
    ];
    let keywordIndex = 0;
    let charIndex = 0;
    const typingSpeed = 150;
    const delayBetweenKeywords = 2000;

    // Función para el efecto de escritura
    function typeEffect() {
        const currentKeyword = keywords[keywordIndex];
        if (charIndex < currentKeyword.length) {
            searchInput.placeholder += currentKeyword.charAt(charIndex);
            charIndex++;
            setTimeout(typeEffect, typingSpeed);
        } else {
            charIndex = 0;
            keywordIndex = (keywordIndex + 1) % keywords.length;
            setTimeout(() => {
                searchInput.placeholder = '';
                typeEffect();
            }, delayBetweenKeywords);
        }
    }

    typeEffect();

    // Funcionalidad para la búsqueda en tiempo real
    $('.search_form').on('submit', function(e) {
        e.preventDefault();
        const query = $('#search-input').val();

        // Mostrar el cargador
        $('#loader').show();
        $('#courses-grid').hide();

        $.ajax({
            url: '/courses/search',
            method: 'GET',
            data: { query: query },
            success: function (data) {
                // Ocultar el cargador
                $('#loader').hide();
                $('#courses-grid').show();

                // Actualizar los cursos
                $('#courses-grid').html('');
                data.forEach(course => {
                    $('#courses-grid').append(`
                        <div class="course_card">
                            <img src="${course.thumbnail}" alt="${course.title}">
                            <div class="course_info">
                                <h3 class="course_title">${course.title}</h3>
                                <p class="course_description">${course.description}</p>
                                <p class="course_price">$${course.price}</p>
                                <a href="#" class="course_buy">Comprar</a>
                            </div>
                        </div>
                    `);
                });
            },
            error: function (err) {
                console.error(err);
                // Ocultar el cargador
                $('#loader').hide();
                $('#courses-grid').show();
            }
        });
    });
});
