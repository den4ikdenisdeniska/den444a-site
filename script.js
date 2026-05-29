// SVG иконка как переменная
const folderIcon = `
<svg class="work-icon" width="65" height="65" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M42,31h14v21c0,4.971-4.029,9-9,9H25c-4.971,0-9-4.029-9-9V20c0-4.971,4.029-9,9-9h11v14C36,28.314,38.686,31,42,31z" fill="currentColor"/>
    <path d="M42,27c-1.104,0-2-0.895-2-2V11.343L55.657,27H42z" fill="currentColor"/>
</svg>
`;

// Данные работ
const worksData = [
    { name: "Работа 1", project: "Современный лендинг" },
    { name: "Работа 2", project: "Интернет-магазин" },
    { name: "Работа 3", project: "Корпоративный сайт" },
    { name: "Работа 4", project: "Сайт портфолио" },
    { name: "Работа 5", project: "Блог" }
];

// Генерация карточек работ
function generateWorkCards() {
    const grid = document.getElementById('worksGrid');
    if (!grid) return;
    
    grid.innerHTML = worksData.map((work, index) => `
        <div class="work-card" data-project="${work.project}" data-delay="${0.1 * (index + 1)}">
            <div class="card-inner">
                <div class="work-icon-wrapper">
                    ${folderIcon}
                </div>
                <p class="work-title">${work.name}</p>
            </div>
        </div>
    `).join('');
}

// Ленивая загрузка
function initLazyLoad() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.work-card').forEach(card => {
        observer.observe(card);
    });
}

// Твои партиклы - с тёмным фоном для тёмной темы
// Партиклы - с адаптацией под телефон
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = -1000, mouseY = -1000;
    let animationId;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // На телефонах частицы меньше
            const isMobile = window.innerWidth <= 768;
            this.size = isMobile ? Math.random() * 2 + 0.5 : Math.random() * 4 + 1;
            this.speedX = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.8);
            this.speedY = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.8);
            this.type = Math.random() > 0.8 ? 'square' : 'circle';
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * (isMobile ? 0.02 : 0.05);
            this.updateColor();
        }
        
        updateColor() {
            const isDark = document.body.classList.contains('dark-theme');
            const isMobile = window.innerWidth <= 768;
            if (isDark) {
                const opacity = isMobile ? Math.random() * 0.15 + 0.05 : Math.random() * 0.3 + 0.1;
                this.color = `rgba(255, 255, 255, ${opacity})`;
                this.lineColor = `rgba(255, 255, 255, ${opacity * 0.5})`;
            } else {
                const opacity = isMobile ? Math.random() * 0.12 + 0.04 : Math.random() * 0.25 + 0.08;
                this.color = `rgba(102, 51, 153, ${opacity})`;
                this.lineColor = `rgba(102, 51, 153, ${opacity * 0.5})`;
            }
        }
        
        repel(mx, my, strength) {
            const dx = this.x - mx;
            const dy = this.y - my;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                const angle = Math.atan2(dy, dx);
                const force = (120 - distance) / 120 * strength;
                this.x += Math.cos(angle) * force;
                this.y += Math.sin(angle) * force;
            }
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            
            const isMobile = window.innerWidth <= 768;
            if (!isMobile) {
                this.repel(mouseX, mouseY, 2.5);
            }
            
            if (this.x < -50) this.x = canvas.width + 50;
            if (this.x > canvas.width + 50) this.x = -50;
            if (this.y < -50) this.y = canvas.height + 50;
            if (this.y > canvas.height + 50) this.y = -50;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            ctx.fillStyle = this.color;
            if (this.type === 'square') {
                ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        
        drawLine(other) {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = this.lineColor;
                ctx.lineWidth = 0.5;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
            }
        }
    }
    
    function initParticleSystem() {
        particles = [];
        // На телефонах - 30 частиц, на компьютере - 100
        let count = window.innerWidth <= 768 ? 30 : 100;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    
    function updateParticlesColor() {
        particles.forEach(p => p.updateColor());
    }
    
    function animateParticles() {
        if (!ctx) return;
        
        const isDark = document.body.classList.contains('dark-theme');
        const isMobile = window.innerWidth <= 768;
        if (isDark) {
            ctx.fillStyle = `rgba(10, 10, 10, ${isMobile ? 0.25 : 0.15})`;
        } else {
            ctx.fillStyle = `rgba(230, 230, 250, ${isMobile ? 0.2 : 0.12})`;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                particles[i].drawLine(particles[j]);
            }
        }
        
        animationId = requestAnimationFrame(animateParticles);
    }
    
    resizeCanvas();
    initParticleSystem();
    animateParticles();
    
    window.addEventListener('resize', () => { 
        resizeCanvas(); 
        initParticleSystem();
    });
    
    const observer = new MutationObserver(() => {
        updateParticlesColor();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}
// Эффект печатной машинки
function initTypingEffect() {
    const textElement = document.getElementById('typingText');
    if (!textElement) return;
    
    const phrases = ['Разработчик веб-сайтов', 'Создаю современные сайты', 'Воплощаю идеи в код'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeEffect, 500);
            return;
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(typeEffect, speed);
    }
    
    typeEffect();
}

// Кастомный курсор
// Кастомный курсор
// Кастомный курсор
function initCustomCursor() {
    if (window.innerWidth <= 768) return;
    
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    if (!cursor || !cursorFollower) return;
    
    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;
    
    // Скрываем стандартный курсор на всей странице
    document.body.style.cursor = 'none';
    
    // Добавляем стиль для всех элементов
    const style = document.createElement('style');
    style.textContent = `
        a, button, .work-card, .service-item, .social-link, .feature, 
        .theme-toggle, .scroll-top, .burger, .menu-link, * {
            cursor: none !important;
        }
    `;
    document.head.appendChild(style);
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        cursorFollower.style.transform = `translate(${mouseX - 20}px, ${mouseY - 20}px)`;
    });
    
    // При скролле обновляем позицию
    window.addEventListener('scroll', () => {
        cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        cursorFollower.style.transform = `translate(${mouseX - 20}px, ${mouseY - 20}px)`;
    });
    
    // При выходе мыши за пределы окна
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
    });
    
    const hoverElements = document.querySelectorAll('a, .work-card, .service-item, .social-link, .feature, button, .theme-toggle, .scroll-top, .burger, .menu-link');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.opacity = '0';
            cursorFollower.style.width = '50px';
            cursorFollower.style.height = '50px';
            
            const isDark = document.body.classList.contains('dark-theme');
            if (isDark) {
                cursorFollower.style.background = 'rgba(255, 255, 255, 0.15)';
                cursorFollower.style.border = '2px solid #ffffff';
            } else {
                cursorFollower.style.background = 'rgba(102, 51, 153, 0.15)';
                cursorFollower.style.border = '2px solid #9966CC';
            }
            
            cursorFollower.style.backdropFilter = 'blur(4px)';
            cursorFollower.innerHTML = '<span>✦</span>';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.opacity = '1';
            cursorFollower.style.width = '40px';
            cursorFollower.style.height = '40px';
            cursorFollower.style.background = 'transparent';
            
            const isDark = document.body.classList.contains('dark-theme');
            if (isDark) {
                cursorFollower.style.border = '2px solid rgba(255, 255, 255, 0.5)';
            } else {
                cursorFollower.style.border = '2px solid rgba(102, 51, 153, 0.5)';
            }
            
            cursorFollower.style.backdropFilter = 'none';
            cursorFollower.innerHTML = '';
        });
    });
}

// Бургер-меню
function initBurgerMenu() {
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!burger || !mobileMenu) return;
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Тёмная тема
// Тёмная тема
// Тёмная тема
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.documentElement.classList.add('dark-theme');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.documentElement.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
}

// Кнопка наверх
function initScrollTop() {
    const scrollTop = document.getElementById('scrollTop');
    if (!scrollTop) return;
    
    window.addEventListener('scroll', () => {
        scrollTop.classList.toggle('visible', window.scrollY > 300);
    });
    
    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Плавный скролл
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Запуск всех функций
document.addEventListener('DOMContentLoaded', function() {
    generateWorkCards();
    initLazyLoad();
    initParticles();
    initTypingEffect();
    initCustomCursor();
    initBurgerMenu();
    initThemeToggle();
    initScrollTop();
    initSmoothScroll();
    
    // WOW.js инициализация
    if (typeof WOW !== 'undefined') {
        setTimeout(() => {
            var wow = new WOW({
                boxClass: 'wow',
                animateClass: 'animate__animated',
                offset: 50,
                mobile: true,
                live: true
            });
            wow.init();
        }, 100);
    }
    
    console.log('Сайт успешно загружен!');
});