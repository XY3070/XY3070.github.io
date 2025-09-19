document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const body = document.body;

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageUrl = this.src;
            const imageAlt = this.alt;

            // Create lightbox elements
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');

            const lightboxContent = document.createElement('div');
            lightboxContent.classList.add('lightbox-content');

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = imageAlt;

            const closeBtn = document.createElement('span');
            closeBtn.classList.add('close-btn');
            closeBtn.innerHTML = '&times;';

            lightboxContent.appendChild(img);
            lightboxContent.appendChild(closeBtn);
            lightbox.appendChild(lightboxContent);
            body.appendChild(lightbox);

            // Prevent scrolling when lightbox is open
            body.style.overflow = 'hidden';

            // Close lightbox when clicking on close button or outside the image
            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            function closeLightbox() {
                body.removeChild(lightbox);
                body.style.overflow = ''; // Restore scrolling
            }
        });
    });
});