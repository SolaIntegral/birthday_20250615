document.addEventListener('DOMContentLoaded', () => {
    // 導入メッセージページの処理
    const introMessage = document.getElementById('intro-message');
    const photoGallery = document.getElementById('photo-gallery');
    const nextButton = document.querySelector('.next-button');
    
    // BGMのフェードイン再生（最初のユーザー操作で）
    const bgm = document.getElementById('bgm');
    let bgmStarted = false;
    function fadeIn(audio, callback) {
        audio.currentTime = 0;
        audio.volume = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                let startTime = null;
                function fadeInStep(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    const volume = Math.min(progress / 1000, 1);
                    audio.volume = volume;
                    if (progress < 1000) {
                        requestAnimationFrame(fadeInStep);
                    } else if (callback) {
                        callback();
                    }
                }
                requestAnimationFrame(fadeInStep);
            }).catch(() => {});
        }
    }
    function startBgmIfNeeded() {
        if (!bgmStarted) {
            fadeIn(bgm);
            bgmStarted = true;
        }
    }
    document.addEventListener('click', startBgmIfNeeded, { once: true });
    document.addEventListener('touchstart', startBgmIfNeeded, { once: true });
    
    // パーティクルエフェクトの初期化
    initParticles();
    
    // 次のページへ進むボタンの処理
    nextButton.addEventListener('click', () => {
        introMessage.classList.remove('active');
        photoGallery.classList.remove('hidden');
        photoGallery.classList.add('active');
        initPhotoGallery();
    });
    
    // 写真ギャラリーの初期化
    function initPhotoGallery() {
        // カルーセルの写真クリックでライトボックスを開く
        const carouselItems = document.querySelectorAll('.carousel-item');
        const lightbox = document.querySelector('.lightbox');
        const lightboxImg = lightbox.querySelector('img');
        const lightboxMessage = lightbox.querySelector('.photo-message');
        const closeButton = lightbox.querySelector('.close-button');

        carouselItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const message = item.dataset.message;
                lightboxImg.src = img.src;
                lightboxMessage.textContent = message;
                lightbox.classList.remove('hidden');
                createSparkles(item);
            });
        });
        closeButton.addEventListener('click', () => {
            lightbox.classList.add('hidden');
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.add('hidden');
            }
        });
    }
    
    // 魔法の軌跡の処理
    const magicTrail = document.querySelector('.magic-trail');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    document.addEventListener('mousedown', startDrawing);
    document.addEventListener('mousemove', draw);
    document.addEventListener('mouseup', stopDrawing);
    document.addEventListener('touchstart', handleTouch);
    document.addEventListener('touchmove', handleTouch);
    document.addEventListener('touchend', stopDrawing);
    
    function startDrawing(e) {
        isDrawing = true;
        const pos = getPosition(e);
        lastX = pos.x;
        lastY = pos.y;
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const pos = getPosition(e);
        const trail = document.createElement('div');
        trail.className = 'trail';
        trail.style.left = pos.x + 'px';
        trail.style.top = pos.y + 'px';
        magicTrail.appendChild(trail);
        
        // 軌跡のフェードアウト
        setTimeout(() => {
            trail.remove();
        }, 1000);
        
        lastX = pos.x;
        lastY = pos.y;
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        document.dispatchEvent(mouseEvent);
    }
    
    function getPosition(e) {
        return {
            x: e.clientX || e.touches[0].clientX,
            y: e.clientY || e.touches[0].clientY
        };
    }
    
    // 隠しメッセージの処理
    const hiddenMessages = document.querySelectorAll('.hidden-message');
    
    hiddenMessages.forEach(message => {
        message.addEventListener('click', () => {
            message.classList.add('show');
            createConfetti(message);
        });
    });
    
    // パーティクルエフェクト
    function initParticles() {
        const particles = document.querySelector('.particles');
        for (let i = 0; i < 50; i++) {
            createParticle(particles);
        }
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(particle);
    }
    
    // キラキラエフェクト
    function createSparkles(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = rect.left + Math.random() * rect.width + 'px';
            sparkle.style.top = rect.top + Math.random() * rect.height + 'px';
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 1000);
        }
    }
    
    // 紙吹雪エフェクト
    function createConfetti(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = rect.left + rect.width / 2 + 'px';
            confetti.style.top = rect.top + 'px';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 2000);
        }
    }
}); 