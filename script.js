/**
 * Clínica Dental Lumina — Scripts Principales (PARTE 1)
 * Funcionalidad: Navbar con efecto scroll y Menú Móvil
 * Vanilla JS ES6+ — Optimizado y accesible
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Inicialización de módulos (Parte 1) ---
  initNavbarScroll();
  initMobileMenu();

  // Las siguientes funciones se integrarán en la Parte 2:
  // initFAQAccordion();
  // initContactForm();
  // initCurrentYear();
  // initSmoothScroll();
});

/* ============================================================
   FUNCIÓN 1: EFECTO DE SCROLL DINÁMICO EN LA NAVBAR
   ============================================================ */
function initNavbarScroll() {
  // Seleccionamos el elemento <header> con clase .navbar
  const navbar = document.querySelector('.navbar');
  if (!navbar) return; // Salimos si no existe (seguridad)

  // Bandera para controlar la frecuencia de ejecución (throttle)
  let ticking = false;

  // Umbral en píxeles a partir del cual se activa el estilo compacto
  const SCROLL_THRESHOLD = 50;

  // Función que evalúa la posición del scroll y aplica/quita la clase
  function updateNavbarStyle() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
    ticking = false; // Liberamos la bandera para la siguiente iteración
  }

  // Escuchamos el evento 'scroll' de la ventana
  window.addEventListener('scroll', () => {
    // Solo programamos una nueva actualización si no hay una en cola
    if (!ticking) {
      // Solicitamos que el navegador ejecute nuestra función en el siguiente
      // ciclo de renderizado, optimizando el rendimiento
      window.requestAnimationFrame(updateNavbarStyle);
      ticking = true;
    }
  });

  // Ejecutamos una vez al cargar la página por si el usuario ya ha hecho scroll
  // (por ejemplo, al recargar en medio de la página)
  updateNavbarStyle();
}

/* ============================================================
   FUNCIÓN 2: CONTROL DEL MENÚ DE HAMBURGUESA MÓVIL
   ============================================================ */
function initMobileMenu() {
  // Elementos del DOM necesarios
  const toggleButton = document.getElementById('navbarToggle');
  const navMenu = document.getElementById('navbarNav');

  // Si no existen ambos elementos, no hay nada que hacer
  if (!toggleButton || !navMenu) return;

  // Seleccionamos todos los enlaces internos dentro del menú móvil
  // para poder cerrar el menú cuando el usuario pulse en uno de ellos
  const menuLinks = navMenu.querySelectorAll('.navbar__link');

  // --- Función auxiliar para abrir el menú ---
  function openMenu() {
    navMenu.classList.add('navbar__nav--open');      // Muestra el panel
    toggleButton.classList.add('navbar__toggle--active'); // Convierte las barras en "X" (vía CSS)
    toggleButton.setAttribute('aria-expanded', 'true'); // Accesibilidad
  }

  // --- Función auxiliar para cerrar el menú ---
  function closeMenu() {
    navMenu.classList.remove('navbar__nav--open');
    toggleButton.classList.remove('navbar__toggle--active');
    toggleButton.setAttribute('aria-expanded', 'false');
  }

  // --- Evento: clic en el botón hamburguesa ---
  toggleButton.addEventListener('click', () => {
    // Si el menú ya está abierto, lo cerramos; si no, lo abrimos
    const isOpen = navMenu.classList.contains('navbar__nav--open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // --- Evento: clic en cualquier enlace del menú móvil ---
  // Cuando el usuario navega a una sección, cerramos el menú automáticamente
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Solo cerramos si el menú está efectivamente abierto
      if (navMenu.classList.contains('navbar__nav--open')) {
        closeMenu();
      }
    });
  });

  // --- Cierre adicional si se redimensiona la ventana a un tamaño de escritorio ---
  // Esto evita que el menú móvil quede abierto al cambiar de orientación
  window.addEventListener('resize', () => {
    // Si el viewport supera los 1024px (el breakpoint donde el menú móvil se oculta)
    if (window.innerWidth > 1024 && navMenu.classList.contains('navbar__nav--open')) {
      closeMenu();
    }
  });
}



/* ============================================================
   FUNCIÓN 3: ACORDEÓN INTERACTIVO DE FAQ
   ============================================================ */
function initFAQAccordion() {
  // Seleccionamos todos los botones disparadores del FAQ
  const triggers = document.querySelectorAll('.faq-trigger');
  if (!triggers.length) return; // Salir si no hay elementos

  // Función para cerrar un elemento FAQ específico
  function closeFaqItem(item) {
    item.classList.remove('active');
    const panel = item.querySelector('.faq-content');
    if (panel) {
      panel.style.maxHeight = '0';
    }
  }

  // Función para abrir un elemento FAQ específico
  function openFaqItem(item) {
    item.classList.add('active');
    const panel = item.querySelector('.faq-content');
    if (panel) {
      // Calculamos la altura real del contenido oculto para animar suavemente
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  }

  // Iteramos sobre cada disparador
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      // El contenedor padre del FAQ (.faq__item)
      const faqItem = trigger.closest('.faq__item');
      if (!faqItem) return;

      // Comprobamos si este elemento ya está activo
      const isActive = faqItem.classList.contains('active');

      // Cerramos todos los demás elementos FAQ (exclusividad mutua)
      const allFaqItems = document.querySelectorAll('.faq__item');
      allFaqItems.forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
          closeFaqItem(item);
        }
      });

      // Alternamos el estado del elemento clicado
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

  // Función para limpiar todos los mensajes de error y clases visuales previos
  function clearErrors() {
    // Eliminamos todas las clases 'input-error' de los campos
    const errorFields = form.querySelectorAll('.contact__form-input--error');
    errorFields.forEach(field => field.classList.remove('contact__form-input--error'));

    // Eliminamos todos los mensajes de error existentes
    const errorMessages = form.querySelectorAll('.contact__form-error');
    errorMessages.forEach(msg => msg.remove());
  }

  // Función para mostrar un error en un campo específico
  function showFieldError(field, message) {
    field.classList.add('contact__form-input--error');
    const errorSpan = document.createElement('span');
    errorSpan.className = 'contact__form-error';
    errorSpan.textContent = message;
    // Insertamos el mensaje justo después del campo
    field.parentNode.appendChild(errorSpan);
  }

  // Validación de formato de correo electrónico
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validación de formato de teléfono mexicano: exactamente 10 dígitos
  function isValidMexicanPhone(phone) {
    // Eliminamos todo lo que no sea dígito para permitir formatos como (55)1234-5678
    const digitsOnly = phone.replace(/\D/g, '');
    return /^\d{10}$/.test(digitsOnly);
  }

  // Función para mostrar el mensaje de éxito y reiniciar el formulario
  function showSuccessMessage() {
    // Creamos un contenedor de mensaje de éxito estilizado
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
    // Reemplazamos el contenido del formulario con el mensaje de éxito
    form.innerHTML = '';
    form.appendChild(successDiv);

    // Opcional: hacer scroll suave hasta el formulario para que el usuario vea el mensaje
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Manejador del evento submit
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenimos el envío real

    // Limpiamos errores previos
    clearErrors();

    // Obtención de campos del formulario
    const fullname = document.getElementById('fullname');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const service = document.getElementById('service');
    const preferredDate = document.getElementById('preferred-date');
    // El campo mensaje es opcional, así que no lo validamos como obligatorio

    let isValid = true;

    // Validación de Nombre Completo (no vacío)
    if (!fullname || fullname.value.trim() === '') {
      showFieldError(fullname, 'El nombre completo es obligatorio.');
      isValid = false;
    }

    // Validación de Teléfono (obligatorio y formato mexicano)
    if (!phone || phone.value.trim() === '') {
      showFieldError(phone, 'El teléfono es obligatorio.');
      isValid = false;
    } else if (!isValidMexicanPhone(phone.value.trim())) {
      showFieldError(phone, 'Ingrese un número de teléfono válido de 10 dígitos.');
      isValid = false;
    }

    // Validación de Correo Electrónico
    if (!email || email.value.trim() === '') {
      showFieldError(email, 'El correo electrónico es obligatorio.');
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showFieldError(email, 'Ingrese un correo electrónico válido.');
      isValid = false;
    }

    // Validación del Servicio de Interés (debe seleccionarse una opción)
    if (!service || service.value === '') {
      showFieldError(service, 'Seleccione un servicio de interés.');
      isValid = false;
    }

    // Validación de Fecha Deseada (no vacía)
    if (!preferredDate || preferredDate.value.trim() === '') {
      showFieldError(preferredDate, 'Seleccione una fecha para su cita.');
      isValid = false;
    }

    // Si todas las validaciones pasan, mostramos éxito
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
   FUNCIÓN 6: SCROLL SUAVE PARA ENLACES INTERNOS (refuerzo)
   ============================================================ */
function initSmoothScroll() {
  // Seleccionamos todos los enlaces que apuntan a un hash interno
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      // Si el href es solo "#", no hacemos nada (enlace vacío)
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
}
const imagenesGaleria = Array.from(document.querySelectorAll('.clickable-img')); 
let indiceActual = 0;

function openModal(elemento) {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    
    modal.style.display = "block";
    modalImg.src = elemento.src;
    indiceActual = imagenesGaleria.indexOf(elemento);
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

function changeImage(direccion) {
    indiceActual += direccion;
    
    if (indiceActual >= imagenesGaleria.length) {
        indiceActual = 0;
    }
    if (indiceActual < 0) {
        indiceActual = imagenesGaleria.length - 1;
    }
    
    const modalImg = document.getElementById("img01");
    modalImg.src = imagenesGaleria[indiceActual].src;
}
