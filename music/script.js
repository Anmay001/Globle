/* ===================================
   Smooth Scrolling & Navigation
   =================================== */

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navLinks = document.querySelector('.nav-links');
            const mobileToggle = document.querySelector('.mobile-toggle');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        }
    });
});


/* ===================================
   Sticky Navigation
   =================================== */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


/* ===================================
   Mobile Navigation Toggle
   =================================== */

const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});


/* ===================================
   Scroll Animations
   =================================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll(
    '.feature-card, .course-card, .testimonial-card, .contact-item'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});


/* ===================================
   FORM + GOOGLE SHEETS INTEGRATION
   =================================== */

const enquiryForm = document.getElementById('enquiryForm');
const formMessage = document.getElementById('formMessage');

/* 🔥 PASTE YOUR DEPLOYED GOOGLE SCRIPT WEB APP URL BELOW */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxtRK8JQDtCJDFYqqgbQFc4onifH90iQjwuSSeQigKD4XY3PduHXI4IBZj2mEzv5-g3/exec";


// Validation Rules
const validationRules = {
    fullName: {
        pattern: /^[a-zA-Z\s]{2,50}$/,
        message: 'Please enter a valid name'
    },
    phone: {
        pattern: /^[0-9]{10,12}$/,
        message: 'Please enter a valid phone number'
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    }
};


// Validate Input
function validateField(fieldName, value) {
    const rule = validationRules[fieldName];
    if (!rule) return true;
    return rule.pattern.test(value);
}


// Show Message
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;

    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}


// Submit Handler
enquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // URL Check
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("PASTE")) {
        showMessage("Google Sheet URL not configured!", "error");
        return;
    }

    const submitButton = enquiryForm.querySelector('.btn-submit');
    submitButton.classList.add('loading');

    // Collect Data
    const data = {
        fullName: enquiryForm.fullName.value.trim(),
        phone: enquiryForm.phone.value.trim(),
        email: enquiryForm.email.value.trim(),
        instrument: enquiryForm.instrument.value.trim(),
        message: enquiryForm.message.value.trim(),
        timestamp: new Date().toISOString()
    };


    // Validation
    let valid = true;

    Object.keys(validationRules).forEach(key => {
        if (data[key] && !validateField(key, data[key])) {
            valid = false;
        }
    });

    if (!data.fullName || !data.phone || !data.instrument) {
        valid = false;
    }

    if (!valid) {
        showMessage("Please enter valid form details", "error");
        submitButton.classList.remove('loading');
        return;
    }


    try {

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === "success") {

            showMessage("Enquiry sent successfully ✅", "success");
            enquiryForm.reset();

            // Prevent double submit
            submitButton.disabled = true;
            setTimeout(() => submitButton.disabled = false, 2000);

        } else {
            throw new Error("Sheet Error");
        }

    } catch (error) {

        console.error(error);
        showMessage("Submission failed. Try again later.", "error");

    } finally {
        submitButton.classList.remove('loading');
    }

});


/* ===================================
   Console Branding
   =================================== */

console.log('%c🎵 Harmony Music Academy', 'color:#d4a574;font-size:22px;font-weight:bold;');
console.log('%cGoogle Sheets Connected Ready ✔', 'color:green;font-size:14px;');
