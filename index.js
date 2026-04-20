// Gestione Navbar allo scroll (opzionale: la restringe leggermente)
const nav = document.querySelector('.floating-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.padding = '0.3rem 1rem';
    } else {
        nav.style.padding = '0.5rem 1.5rem';
    }
});

// Animazioni di comparsa allo scroll (Reveal Elements)
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100; // a quanti px dallo schermo scatta l'animazione

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

// Lancia la funzione all'avvio e allo scroll
window.addEventListener("scroll", reveal);
reveal(); // Per far apparire la hero al caricamento

// Smooth Scroll per i link della navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Calcola l'offset per non far coprire il titolo dalla navbar fluttuante
            const navHeight = document.querySelector('.floating-nav').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - navHeight - 30;
    
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});