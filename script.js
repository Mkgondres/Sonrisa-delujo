/**
 * Clínica Dental Lumina — Scripts Principales (LIMPIO Y UNIFICADO)
 * Funcionalidad: Navbar, Menú Móvil VIP, Formulario a Formsubmit, Scroll y Galería
 */

// ==========================================================================
// IMPORTS
// ==========================================================================
import PhotoSwipeLightbox from 'https://unpkg.com/photoswipe/dist/photoswipe-lightbox.esm.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de todos los módulos
    initNavbarScroll();
    initMobileMenuVIP();
    initContactFormVIP();
    initCurrentYear();
    initSmoothScroll();
    initPhotoSwipe();
});

/* ============================================================
   1. SCROLL DINÁMICO EN LA NAVBAR
   ============================================================ */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let ticking = false;
    const SCROLL_THRESHOLD = 50;

    function updateNavbarStyle() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbarStyle);
            ticking = true;
        }
    });
    updateNavbarStyle();
}

/* ============================================================
   2. MENÚ MÓVIL INTELIGENTE (Cierra al tocar fuera)
   ============================================================ */
function initMobileMenuVIP() {
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarNav = document.getElementById('navbarNav');
    const navbarLinks = document.querySelectorAll('.navbar__link');

    if (!navbarToggle || !navbarNav) return;

    // Abrir/Cerrar al tocar el botón hamburguesa
    navbarToggle.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que el clic choque con el cierre externo
        navbarToggle.classList.toggle('navbar__toggle--active');
        navbarNav.classList.toggle('navbar__nav--open');
        
        const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';
        navbarToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Cerrar al tocar fuera del menú
    document.addEventListener('click', (event) => {
        const isMenuOpen = navbarNav.classList.contains('navbar__nav--open');
        const isClickInsideMenu = navbarNav.contains(event.target);
        const isClickOnToggle = navbarToggle.contains(event.target);

        if (isMenuOpen && !isClickInsideMenu && !isClickOnToggle) {
            navbarToggle.classList.remove('navbar__toggle--active');
            navbarNav.classList.remove('navbar__nav--open');
            navbarToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Cerrar al tocar un enlace del menú
    navbarLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarToggle.classList.remove('navbar__toggle--active');
            navbarNav.classList.remove('navbar__nav--open');
            navbarToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ============================================================
   3. FORMULARIO VIP (Validación, Envío Invisible y Modales)
   ============================================================ */
function initContactFormVIP() {
    const appointmentForm = document.getElementById('appointment-form');
    const successModal = document.getElementById('success-modal');
    const warningModal = document.getElementById('warning-modal');
    const closeSuccessBtn = document.getElementById('close-success-modal');
    const closeWarningBtn = document.getElementById('close-warning-modal');
    const submitBtn = appointmentForm ? appointmentForm.querySelector('button[type="submit"]') : null;

    const clinicEmail = "gondresmk@gmail.com"; 

    const closeModal = (modal) => {
        if (modal) modal.classList.remove('is-active');
    };

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Bloquear recarga de página

            const requiredFields = appointmentForm.querySelectorAll('[required]');
            let hasEmptyFields = false;

            // Revisar campos vacíos
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    hasEmptyFields = true;
                }
            });

            if (hasEmptyFields) {
                // Mostrar cartel de advertencia
                if (warningModal) warningModal.classList.add('is-active');
            } else {
                // Animación de botón cargando
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando solicitud...';
                submitBtn.disabled = true;

                // Extraer datos
                const name = document.getElementById('fullname').value.trim();
                const phone = document.getElementById('phone').value.trim();
                const email = document.getElementById('email').value.trim();
                const serviceSelect = document.getElementById('service');
                const service = serviceSelect.options[serviceSelect.selectedIndex].text;
                const dateVal = document.getElementById('preferred-date').value.trim();
                const date = dateVal ? dateVal : 'No especificada';
                const messageVal = document.getElementById('message').value.trim();
                const message = messageVal ? messageVal : 'Sin notas adicionales';

                // Envío por Formsubmit
                fetch(`https://formsubmit.co/ajax/${clinicEmail}`, {
                    method: "POST",
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: `💎 Nueva Solicitud de Cita VIP: ${name}`,
                        Nombre: name,
                        Teléfono: phone,
                        Correo: email,
                        Servicio: service,
                        Fecha_Deseada: date,
                        Notas: message,
                        _template: "table"
                    })
                })
                .then(response => response.json())
                .then(data => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    if (successModal) successModal.classList.add('is-active');
                    appointmentForm.reset();
                })
                .catch(error => {
                    console.log(error);
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    alert("Hubo un error de conexión. Por favor, intente de nuevo.");
                });
            }
        });
    }

    // Eventos para cerrar los modales
    if (closeSuccessBtn && successModal) {
        closeSuccessBtn.addEventListener('click', () => closeModal(successModal));
        successModal.addEventListener('click', (event) => {
            if (event.target === successModal) closeModal(successModal);
        });
    }

    if (closeWarningBtn && warningModal) {
        closeWarningBtn.addEventListener('click', () => closeModal(warningModal));
        warningModal.addEventListener('click', (event) => {
            if (event.target === warningModal) closeModal(warningModal);
        });
    }
}

/* ============================================================
   4. AÑO ACTUAL (FOOTER)
   ============================================================ */
function initCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/* ============================================================
   5. SCROLL SUAVE
   ============================================================ */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            if (!targetId) return;

            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });

    const actionButtons = document.querySelectorAll('.btn-agendar, [data-target="appointment-form"]');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetElement = document.getElementById('appointment-form');
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });
}

/* ============================================================
   6. GALERÍA VIP (PHOTOSWIPE)
   ============================================================ */
function initPhotoSwipe() {
    const lightbox = new PhotoSwipeLightbox({
        gallery: '#mi-galeria',
        children: 'a',
        pswpModule: () => import('https://unpkg.com/photoswipe/dist/photoswipe.esm.js')
    });
    lightbox.init();
}
