document.addEventListener("DOMContentLoaded", () => {

    // 1. Gestione Navbar allo scroll
    const nav = document.querySelector('.main-nav');
    
    const handleScroll = () => {
        if (!nav) return; // Controllo di sicurezza
        
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Attiva subito al caricamento se la pagina è già scrollata

    // 2. Animazioni di Comparsa (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Scatta quando il 15% dell'elemento è visibile
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Ferma l'osservazione per non ripetere l'animazione
            }
        });
    }, observerOptions);

    // Applica l'osservatore agli elementi base
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Applica l'effetto "Stagger" (a cascata) per gli elementi della griglia
    const staggerItems = document.querySelectorAll('.stagger-grid .reveal-item');
    staggerItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`; // Ritardo basato sulla posizione
        observer.observe(item);
    });

    // 3. Smooth Scroll Preciso (Compensazione altezza navbar)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === "#") return; // Ignora se il link è vuoto

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calcola l'altezza della navbar per non coprire il titolo
                const navHeight = nav ? nav.offsetHeight : 0;
                
                // Calcola l'esatta posizione dell'elemento sullo schermo
                const elementPosition = targetElement.getBoundingClientRect().top;
                
                // Offset: Posizione elemento + Scroll attuale - Altezza Navbar - Spazio extra (20px)
                const offsetPosition = elementPosition + window.scrollY - navHeight - 20;
        
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});