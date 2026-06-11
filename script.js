/**
 * Clínica Dental Lumina — Scripts Principales (COMPLETO)
 * Funcionalidad: Navbar, Menú Móvil, FAQ, Formulario VIP y Scroll Suave
 * Vanilla JS ES6+ — Optimizado y accesible
 */

// ==========================================================================
// IMPORTS (Siempre al inicio del archivo)
// ==========================================================================
import PhotoSwipeLightbox from 'https://unpkg.com/photoswipe/dist/photoswipe-lightbox.esm.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- Inicialización de todos los módulos ---
  initNavbarScroll();
  initMobileMenu();
  initFAQAccordion();
  initContactForm();
  initCurrentYear();
  initSmoothScroll(); // <--- ¡Activado!
  initPhotoSwipe();
});

/* ============================================================
   FUNCIÓN 1: EFECTO DE SCROLL DINÁMICO EN LA NAVBAR
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
   FUNCIÓN 2: CONTROL DEL MENÚ DE HAMBURGUESA MÓVIL
   ============================================================ */
function initMobileMenu() {
  const toggleButton = document.getElementById('navbarToggle');
  const navMenu = document.getElementById('navbarNav');

  if (!toggleButton || !navMenu) return;

  const menuLinks = navMenu.querySelectorAll('.navbar__link');

  function openMenu() {
    navMenu.classList.add('navbar__nav--open');
    toggleButton.classList.add('navbar__toggle--active');
    toggleButton.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navMenu.classList.remove('navbar__nav--open');
    toggleButton.classList.remove('navbar__toggle--active');
    toggleButton.setAttribute('aria-expanded', 'false');
  }

  toggleButton.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('navbar__nav--open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('navbar__nav--open')) {
        closeMenu();
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && navMenu.classList.contains('navbar__nav--open')) {
      closeMenu();
    }
  });
}

/* ============================================================
   FUNCIÓN 3: ACORDEÓN INTERACTIVO DE FAQ
   ============================================================ */
function initFAQAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');
  if (!triggers.length) return;

  function closeFaqItem(item) {
    item.classList.remove('active');
    const panel = item.querySelector('.faq-content');
    if (panel) {
      panel.style.maxHeight = '0';
    }
  }

  function openFaqItem(item) {
    item.classList.add('active');
    const panel = item.querySelector('.faq-content');
    if (panel) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const faqItem = trigger.closest('.faq__item');
      if (!faqItem) return;

      const isActive = faqItem.classList.contains('active');
      const allFaqItems = document.querySelectorAll('.faq__item');
      
      allFaqItems.forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
          closeFaqItem(item);
        }
      });

      if (isActive) {
        closeFaqItem(faqItem);
      } else {
        openFaqItem(faqItem);
      }
    });
  });
}

/* ============================================================
   FUNCIÓN 4: VALIDACIÓN DEL FORMULARIO DE CITA VIP
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  function clearErrors() {
    const errorFields = form.querySelectorAll('.contact__form-input--error');
    errorFields.forEach(field => field.classList.remove('contact__form-input--error'));

    const errorMessages = form.querySelectorAll('.contact__form-error');
    errorMessages.forEach(msg => msg.remove());
  }

  function showFieldError(field, message) {
    field.classList.add('contact__form-input--error');
    const errorSpan = document.createElement('span');
    errorSpan.className = 'contact__form-error';
    errorSpan.textContent = message;
    field.parentNode.appendChild(errorSpan);
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validación de teléfono: 12 dígitos numéricos
  function isValidMexicanPhone(phone) {
    const digitsOnly = phone.replace(/\D/g, '');
    return /^\d{12}$/.test(digitsOnly);
  }

  function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'contact__form-success';
    successDiv.innerHTML = `
      <div class="contact__form-success-icon">
        <i class="fa-regular fa-circle-check"></i>
      </div>
      <h4 class="contact__form-success-title">Solicitud Recibida con Éxito</h4>
      <p class="contact__form-success-text">
        Un asesor de nuestro servicio VIP se comunicará con usted en menos de 15 minutos 
        para confirmar su espacio. Gracias por elegir la excelencia de Clínica Dental Lumina.
      </p>
    `;
    form.innerHTML = '';
    form.appendChild(successDiv);
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const fullname = document.getElementById('fullname');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const service = document.getElementById('service');
    const preferredDate = document.getElementById('preferred-date');

    let isValid = true;

    if (!fullname || fullname.value.trim() === '') {
      showFieldError(fullname, 'El nombre completo es obligatorio.');
      isValid = false;
    }

    if (!phone || phone.value.trim() === '') {
      showFieldError(phone, 'El teléfono es obligatorio.');
      isValid = false;
    } else if (!isValidMexicanPhone(phone.value.trim())) {
      showFieldError(phone, 'Ingrese un número de teléfono válido.');
      isValid = false;
    }

    if (!email || email.value.trim() === '') {
      showFieldError(email, 'El correo electrónico es obligatorio.');
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showFieldError(email, 'Ingrese un correo electrónico válido.');
      isValid = false;
    }

    if (!service || service.value === '') {
      showFieldError(service, 'Seleccione un servicio de interés.');
      isValid = false;
    }

    if (!preferredDate || preferredDate.value.trim() === '') {
      showFieldError(preferredDate, 'Seleccione una fecha para su cita.');
      isValid = false;
    }

    if (isValid) {
      showSuccessMessage();
    }
  });
}

/* ============================================================
   FUNCIÓN 5: ACTUALIZACIÓN DEL AÑO ACTUAL EN EL FOOTER
   ============================================================ */
function initCurrentYear() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* ============================================================
   FUNCIÓN 6: SCROLL SUAVE INTELIGENTE (Mejorado)
   ============================================================ */
function initSmoothScroll() {
  // Caso A: Enlaces estándar que apuntan a un ID (ej: <a href="#appointment-form">)
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

  // Caso B: Respaldo por si tus botones son etiquetas <button> o clases personalizadas
  // Esto buscará cualquier botón que tenga la clase para agendar o un atributo de destino
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
   FUNCIÓN 7: INICIALIZACIÓN DE LA GALERÍA VIP (PHOTOSWIPE)
   ============================================================ */
function initPhotoSwipe() {
  const lightbox = new PhotoSwipeLightbox({
      gallery: '#mi-galeria',
      children: 'a',
      pswpModule: () => import('https://unpkg.com/photoswipe/dist/photoswipe.esm.js')
  });
  lightbox.init();
}
/* ==========================================================================
   VALIDACIÓN, ENVÍO A WHATSAPP Y MODALES DEL FORMULARIO VIP
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.getElementById('appointment-form');
    
    // Identificamos los dos modales
    const successModal = document.getElementById('success-modal');
    const warningModal = document.getElementById('warning-modal');

    // Identificamos los botones de cerrar
    const closeSuccessBtn = document.getElementById('close-success-modal');
    const closeWarningBtn = document.getElementById('close-warning-modal');

    // NÚMERO DE WHATSAPP DE LA CLÍNICA (Solo números, sin el símbolo +)
    const clinicWhatsApp = "5541995018745"; 

    // Función rápida para cerrar modales
    const closeModal = (modal) => {
        if (modal) modal.classList.remove('is-active');
    };

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Bloqueamos la recarga de la página

            const requiredFields = appointmentForm.querySelectorAll('[required]');
            let hasEmptyFields = false;

            // 1. Revisamos si falta algo
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    hasEmptyFields = true;
                }
            });

            if (hasEmptyFields) {
                // FALTAN DATOS: Mostramos cartel de advertencia
                if (warningModal) warningModal.classList.add('is-active');
            } else {
                // TODO PERFECTO: Extraemos la información del formulario
                const name = document.getElementById('fullname').value.trim();
                const phone = document.getElementById('phone').value.trim();
                const email = document.getElementById('email').value.trim();
                
                // Extraemos el texto visible del servicio seleccionado
                const serviceSelect = document.getElementById('service');
                const service = serviceSelect.options[serviceSelect.selectedIndex].text;
                
                // Extraemos fecha y notas (o ponemos texto por defecto si los dejaron vacíos)
                const dateVal = document.getElementById('preferred-date').value.trim();
                const date = dateVal ? dateVal : 'No especificada';
                
                const messageVal = document.getElementById('message').value.trim();
                const message = messageVal ? messageVal : 'Sin notas adicionales';

                // 2. Construimos el mensaje de WhatsApp estructurado (con negritas *)
                const whatsappText = `*Nueva Solicitud de Cita VIP - Lumina* 💎\n\n` +
                                     `*Nombre:* ${name}\n` +
                                     `*Teléfono:* ${phone}\n` +
                                     `*Correo:* ${email}\n` +
                                     `*Servicio:* ${service}\n` +
                                     `*Fecha Deseada:* ${date}\n` +
                                     `*Notas:* ${message}`;

                // Codificamos el texto para que la URL lo pueda leer correctamente (respeta saltos de línea y espacios)
                const encodedText = encodeURIComponent(whatsappText);
                const whatsappUrl = `https://wa.me/${clinicWhatsApp}?text=${encodedText}`;

                // 3. ¡Magia! Abrimos WhatsApp en una pestaña nueva
                window.open(whatsappUrl, '_blank');

                // 4. Mostramos el cartel bonito de "Éxito" en tu web y limpiamos el formulario
                if (successModal) successModal.classList.add('is-active');
                appointmentForm.reset();
            }
        });
    }

    // ==========================================
    // LÓGICA PARA CERRAR LOS CARTELES
    // ==========================================
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
});
