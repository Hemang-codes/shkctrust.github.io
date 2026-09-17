const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded','false');
  }));

  document.querySelectorAll('.amt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.amt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ---------- gallery lightbox ----------
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length && lightbox) {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    let currentIndex = 0;
    let lastFocused = null;

    function showImage(index) {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[currentIndex];
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      lightboxCaption.textContent = item.getAttribute('data-caption') || img.alt || '';
    }

    function openLightbox(index) {
      lastFocused = document.activeElement;
      showImage(index);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    });
  }
  function setAmount(amount, buttonElement) {
    document.getElementById('selectedAmount').value = amount;
    document.getElementById('customAmountWrapper').style.display = 'none';
    document.querySelectorAll('.amt').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');
}

function toggleCustomAmount(buttonElement) {
    document.getElementById('customAmountWrapper').style.display = 'block';
    document.querySelectorAll('.amt').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');
}

function handleDonation(event) {
    event.preventDefault();
    
    let finalAmount = document.getElementById('selectedAmount').value;
    const isCustom = document.getElementById('customAmountWrapper').style.display === 'block';
    if (isCustom) {
        finalAmount = document.getElementById('customAmount').value;
    }
    
    if (!finalAmount || finalAmount < 10) {
        alert("Minimum donation amount is ₹10.");
        return;
    }

    const name = document.getElementById('donorName').value;
    const email = document.getElementById('donorEmail').value;
    const phone = document.getElementById('donorPhone').value;
    const pan = document.getElementById('donorPAN').value.toUpperCase();

    var options = {
        "key": "YOUR_RAZORPAY_KEY_ID", // Replace with your Live Key ID from Razorpay Dashboard
        "amount": finalAmount * 100, 
        "currency": "INR",
        "name": "Shree Hari Krishna Charitable Trust",
        "description": "General Donation / Seva Act",
        "image": "https://shkctrust.netlify.app", // Link your trust's official logo image here
        "handler": function (response){
            alert("Thank you! Payment Successful. Payment ID: " + response.razorpay_payment_id);
        },
        "prefill": {
            "name": name,
            "email": email,
            "contact": phone
        },
        "notes": {
            "donor_pan": pan,
            "purpose": "Seva Fund Donation"
        },
        "theme": {
            "color": "#800000"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
        alert("Payment Failed. Error Code: " + response.error.code + " Description: " + response.error.description);
    });
    rzp1.open();
}