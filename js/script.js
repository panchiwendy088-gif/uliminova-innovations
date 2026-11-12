const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.site-header');
const sections = document.querySelectorAll('.reveal');
const galleryCards = document.querySelectorAll('[data-gallery-item]');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-description');
const lightboxCategory = document.getElementById('lightbox-category');
const closeButton = document.querySelector('.lightbox-close');
const prevButton = document.querySelector('.lightbox-nav.prev');
const nextButton = document.querySelector('.lightbox-nav.next');
let currentGallery = [];
let currentIndex = 0;

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('is-open');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    });
  });
}

const handleScrollState = () => {
  if (!header) return;
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleScrollState);
handleScrollState();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

sections.forEach((section) => revealObserver.observe(section));

const openLightbox = (card, index) => {
  const images = (card.dataset.images || '').split(',').map((url) => url.trim()).filter(Boolean);
  if (!images.length) return;

  currentGallery = images;
  currentIndex = index;

  const imageUrl = currentGallery[currentIndex];
  lightboxImage.src = imageUrl;
  lightboxImage.alt = `${card.dataset.title || 'Design'} preview`;
  lightboxTitle.textContent = card.dataset.title || 'Design';
  lightboxDesc.textContent = card.dataset.description || '';
  lightboxCategory.textContent = card.dataset.category || 'Design';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const updateLightboxImage = () => {
  if (!currentGallery.length) return;
  const imageUrl = currentGallery[currentIndex];
  lightboxImage.src = imageUrl;
  lightboxImage.alt = `Design preview ${currentIndex + 1}`;
};

const closeLightbox = () => {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

if (galleryCards.length) {
  galleryCards.forEach((card) => {
    const images = (card.dataset.images || '').split(',').map((url) => url.trim()).filter(Boolean);
    const firstImage = images[0];

    if (firstImage) {
      card.addEventListener('click', () => openLightbox(card, 0));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(card, 0);
        }
      });
      card.setAttribute('tabindex', '0');
    }
  });
}

if (closeButton) {
  closeButton.addEventListener('click', closeLightbox);
}

if (prevButton) {
  prevButton.addEventListener('click', () => {
    if (!currentGallery.length) return;
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightboxImage();
  });
}

if (nextButton) {
  nextButton.addEventListener('click', () => {
    if (!currentGallery.length) return;
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightboxImage();
  });
}

document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('is-open')) return;

  if (event.key === 'Escape') {
    closeLightbox();
  }

  if (event.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightboxImage();
  }

  if (event.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightboxImage();
  }
});

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});