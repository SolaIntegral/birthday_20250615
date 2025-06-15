document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const openingSection = document.getElementById('opening-section');
    const messageSection = document.getElementById('message-section');
    const albumSection = document.getElementById('album-section');
    const bgm = document.getElementById('bgm');
    const boxOpenSound = document.getElementById('box-open-sound');
    const pageFlipSound = document.getElementById('page-flip-sound');
    const scratchSound = document.getElementById('scratch-sound');
    const bgmControl = document.getElementById('bgm-control');
    const musicNote = document.getElementById('music-note');
    const tapHint = document.getElementById('tap-hint');
    const floatingStars = document.getElementById('floating-stars');
    const messageCards = document.querySelectorAll('.message-card');
    const memoryItems = document.querySelectorAll('.memory-item');
    const navButtons = document.querySelectorAll('.nav-button');
    const cloverIcon = document.querySelector('.clover-icon');
    const confettiContainer = document.querySelector('.confetti-container');
    const giftBox = document.getElementById('gift-box');
    const lightEffect = document.getElementById('light-effect');
    const footerText = document.querySelector('.footer-text');

    // 存在チェックからgiftBoxを除外
    if (!giftBox || !openingSection || !messageSection || !bgmControl || !musicNote || !lightEffect || !footerText) {
        console.warn('一部の要素が見つかりません。');
        return;
    }

    // フェードイン/フェードアウトの時間（ミリ秒）
    const FADE_DURATION = 1000;

    // 状態管理
    let isBoxOpened = false;
    let isBgmPlaying = false;

    // BGMコントロール
    bgmControl.addEventListener('click', () => {
        if (isBgmPlaying) {
            bgm.pause();
            musicNote.textContent = '♪';
        } else {
            bgm.play();
            musicNote.textContent = '♫';
        }
        isBgmPlaying = !isBgmPlaying;
    });

    // 星生成（数・ランダム性増強）
    function createStars() {
        if (!floatingStars) return;
        floatingStars.innerHTML = '';
        for (let i = 0; i < 80; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            floatingStars.appendChild(star);
        }
    }
    createStars();

    // openingSectionクリックで全演出を実行
    openingSection.addEventListener('click', () => {
        if (isBoxOpened) return;
        isBoxOpened = true;
        giftBox.classList.remove('heartbeat');
        // 拡大アニメーション
        giftBox.style.transition = 'transform 1.5s cubic-bezier(.68,-0.55,.27,1.55), opacity 1.2s';
        giftBox.style.transform = 'scale(1.35)';
        // フッターをフェードアウト
        footerText.style.animation = 'none';
        footerText.style.transition = 'opacity 0.7s';
        footerText.style.opacity = 0;
        // 星を減らす
        if (floatingStars) {
            Array.from(floatingStars.children).forEach((star, i) => {
                if (i % 2 === 0) star.style.opacity = 0.2;
            });
        }
        // 光エフェクト
        lightEffect.classList.add('active');
        // BGM再生（フェードイン）
        fadeIn(bgm);
        // 画面遷移
        setTimeout(() => {
            openingSection.style.opacity = 0;
            setTimeout(() => {
                openingSection.style.display = 'none';
                const messageSection = document.getElementById('message-section');
                if (messageSection) {
                    messageSection.classList.remove('hidden');
                    messageSection.style.display = 'flex';
                    messageSection.classList.add('fade-in');
                }
            }, 700);
        }, 700);
    }, { once: true });

    // スクラッチカバー
    const scratchCover = document.getElementById('scratch-cover');
    const bouquet = document.getElementById('bouquet');
    if (scratchCover) {
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let scratched = 0;
        const ctx = scratchCover.getContext('2d');

        function resizeScratch() {
            scratchCover.width = window.innerWidth;
            scratchCover.height = window.innerHeight;
            
            // 画像を読み込む
            const img = new Image();
            img.src = 'images/cover1.png';
            
            img.onload = function() {
                // 画像を描画
                ctx.drawImage(img, 0, 0, scratchCover.width, scratchCover.height);
            }
        }

        function scratch(x, y) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 32, 0, Math.PI * 2);
            ctx.fill();
            scratched++;
        }

        function getXY(e) {
            if (e.touches && e.touches.length > 0) {
                return [e.touches[0].clientX, e.touches[0].clientY];
            } else {
                return [e.clientX, e.clientY];
            }
        }

        scratchCover.addEventListener('mousedown', e => {
            isDrawing = true;
            const [x, y] = getXY(e);
            scratch(x, y);
        });
        scratchCover.addEventListener('mousemove', e => {
            if (!isDrawing) return;
            const [x, y] = getXY(e);
            scratch(x, y);
        });
        scratchCover.addEventListener('mouseup', () => isDrawing = false);
        scratchCover.addEventListener('mouseleave', () => isDrawing = false);

        scratchCover.addEventListener('touchstart', e => {
            isDrawing = true;
            const [x, y] = getXY(e);
            scratch(x, y);
        });
        scratchCover.addEventListener('touchmove', e => {
            if (!isDrawing) return;
            const [x, y] = getXY(e);
            scratch(x, y);
        });
        scratchCover.addEventListener('touchend', () => isDrawing = false);

        window.addEventListener('resize', resizeScratch);
        resizeScratch();

        // 一定以上削ったらカバーを消す
        function checkScratchClear() {
            const imageData = ctx.getImageData(0, 0, scratchCover.width, scratchCover.height);
            let clearPixels = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
                if (imageData.data[i + 3] < 128) clearPixels++;
            }
            if (clearPixels > imageData.data.length / 8) {
                scratchCover.style.transition = 'opacity 0.7s';
                scratchCover.style.opacity = 0;
                setTimeout(() => {
                    scratchCover.style.display = 'none';
                    // 最初のスライドを表示
                    const firstSlide = document.querySelector('.slide-image');
                    if (firstSlide) {
                        firstSlide.classList.add('active');
                    }
                }, 800);
            }
        }
        scratchCover.addEventListener('mousemove', checkScratchClear);
        scratchCover.addEventListener('touchmove', checkScratchClear);

        // スライド切り替えの処理
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide-image');
        const totalSlides = slides.length;

        // スクラッチ中はスライド切り替えを無効化
        let isScratching = true;

        function showSlide(index) {
            if (isScratching) return; // スクラッチ中は切り替えを無効化
            
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                    slide.classList.remove('next', 'prev');
                } else if (i < index) {
                    slide.classList.remove('active');
                    slide.classList.add('prev');
                    slide.classList.remove('next');
                } else {
                    slide.classList.remove('active');
                    slide.classList.add('next');
                    slide.classList.remove('prev');
                }
            });
        }

        // スワイプ検出
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        messageSection.addEventListener('touchstart', (e) => {
            if (isScratching) return; // スクラッチ中はスワイプを無効化
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        messageSection.addEventListener('touchend', (e) => {
            if (isScratching) return; // スクラッチ中はスワイプを無効化
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
        });

        function handleSwipe() {
            if (isScratching) return; // スクラッチ中はスワイプを無効化
            
            const swipeThreshold = 50;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // 上スワイプの検出（最後のスライドの場合）
            if (currentSlide === totalSlides - 1 && diffY > swipeThreshold) {
                const lastSlide = slides[currentSlide];
                lastSlide.classList.add('slide-up');
                
                setTimeout(() => {
                    window.location.href = 'album.html';
                }, 1000);
                return;
            }
            
            // 左右のスワイプ処理
            if (Math.abs(diffX) > swipeThreshold) {
                if (diffX > 0 && currentSlide < totalSlides - 1) {
                    // 左スワイプ
                    currentSlide++;
                } else if (diffX < 0 && currentSlide > 0) {
                    // 右スワイプ
                    currentSlide--;
                }
                showSlide(currentSlide);
            }
        }

        // マウスでのドラッグもサポート
        let isDragging = false;
        let startX = 0;
        let startY = 0;

        messageSection.addEventListener('mousedown', (e) => {
            if (isScratching) return; // スクラッチ中はドラッグを無効化
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
        });

        messageSection.addEventListener('mousemove', (e) => {
            if (!isDragging || isScratching) return; // スクラッチ中はドラッグを無効化
            const diffX = startX - e.clientX;
            const diffY = startY - e.clientY;
            
            // 上ドラッグの検出（最後のスライドの場合）
            if (currentSlide === totalSlides - 1 && diffY > 50) {
                const lastSlide = slides[currentSlide];
                lastSlide.classList.add('slide-up');
                
                setTimeout(() => {
                    window.location.href = 'album.html';
                }, 1000);
                isDragging = false;
                return;
            }
            
            // 左右のドラッグ処理
            if (Math.abs(diffX) > 50) {
                if (diffX > 0 && currentSlide < totalSlides - 1) {
                    currentSlide++;
                } else if (diffX < 0 && currentSlide > 0) {
                    currentSlide--;
                }
                showSlide(currentSlide);
                isDragging = false;
            }
        });

        messageSection.addEventListener('mouseup', () => {
            isDragging = false;
        });

        messageSection.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        // スクラッチ完了時の処理
        function onScratchComplete() {
            isScratching = false; // スクラッチ完了後、スライド切り替えを有効化
        }

        // スクラッチ完了を検知
        scratchCover.addEventListener('transitionend', () => {
            if (scratchCover.style.opacity === '0') {
                onScratchComplete();
            }
        });
    }

    // アルバムセクション
    const albumPages = document.querySelectorAll('.album-page');
    let currentPage = 0;

    function showPage(index) {
        albumPages.forEach((page, i) => {
            page.style.display = i === index ? 'block' : 'none';
        });
        
        // ページめくり音を再生
        pageFlipSound.currentTime = 0;
        pageFlipSound.play();
    }

    // スワイプ機能
    let touchStartX = 0;
    let touchEndX = 0;

    albumSection.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    albumSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentPage < albumPages.length - 1) {
                currentPage++;
            } else if (diff < 0 && currentPage > 0) {
                currentPage--;
            }
            showPage(currentPage);
        }
    }

    // 初期化
    function init() {
        // 要素の初期状態設定
        messageSection.style.display = 'none';
        albumSection.style.display = 'none';
        
        // スクラッチカバーの初期化
        resizeScratch();
        
        // アルバムの初期ページ表示
        showPage(0);
    }

    // 初期化の実行
    init();

    // フェードイン関数
    function fadeIn(audio, callback) {
        // 音声を確実に再生
        audio.currentTime = 0;
        audio.volume = 0;
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                let startTime = null;
                function fadeInStep(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    const volume = Math.min(progress / FADE_DURATION, 1);
                    
                    audio.volume = volume;
                    
                    if (progress < FADE_DURATION) {
                        requestAnimationFrame(fadeInStep);
                    } else if (callback) {
                        callback();
                    }
                }
                
                requestAnimationFrame(fadeInStep);
            }).catch(error => {
                console.error('音声の再生に失敗しました:', error);
            });
        }
    }

    // フェードアウト関数
    function fadeOut(audio, callback) {
        let startTime = null;
        const startVolume = audio.volume;
        
        function fadeOutStep(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const volume = Math.max(startVolume * (1 - progress / FADE_DURATION), 0);
            
            audio.volume = volume;
            
            if (progress < FADE_DURATION) {
                requestAnimationFrame(fadeOutStep);
            } else {
                audio.pause();
                if (callback) callback();
            }
        }
        
        requestAnimationFrame(fadeOutStep);
    }

    // 初期BGMのフェードイン（box_open.mp3）
    document.addEventListener('DOMContentLoaded', () => {
        // ページ読み込み時に即座にBGMを開始
        console.log('BGM開始');
        fadeIn(bgm);
    });

    // 紙吹雪の生成
    function createConfetti() {
        const colors = ['#DAA520', '#FF69B4', '#FF1493', '#FFE4E1'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confettiContainer.appendChild(confetti);
        }
    }

    // シャボン玉アニメーション
    const bubbleCanvas = document.getElementById('bubble-canvas');
    if (bubbleCanvas) {
        const ctx = bubbleCanvas.getContext('2d');
        let bubbles = [];
        function resizeBubbleCanvas() {
            bubbleCanvas.width = window.innerWidth;
            bubbleCanvas.height = window.innerHeight;
        }
        function createBubbles() {
            bubbles = [];
            for (let i = 0; i < 18; i++) {
                bubbles.push({
                    x: Math.random() * bubbleCanvas.width,
                    y: bubbleCanvas.height + Math.random() * 200,
                    r: 18 + Math.random() * 22,
                    speed: 0.7 + Math.random() * 1.2,
                    drift: (Math.random() - 0.5) * 0.7,
                    alpha: 0.25 + Math.random() * 0.25
                });
            }
        }
        function drawBubbles() {
            ctx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);
            for (const b of bubbles) {
                ctx.save();
                ctx.globalAlpha = b.alpha;
                const grad = ctx.createRadialGradient(b.x, b.y, b.r * 0.2, b.x, b.y, b.r);
                grad.addColorStop(0, 'rgba(255,255,255,0.8)');
                grad.addColorStop(1, 'rgba(173,216,230,0.2)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        function updateBubbles() {
            for (const b of bubbles) {
                b.y -= b.speed;
                b.x += b.drift;
                if (b.y + b.r < 0) {
                    b.x = Math.random() * bubbleCanvas.width;
                    b.y = bubbleCanvas.height + Math.random() * 100;
                }
            }
        }
        function animate() {
            updateBubbles();
            drawBubbles();
            requestAnimationFrame(animate);
        }
        window.addEventListener('resize', () => {
            resizeBubbleCanvas();
            createBubbles();
        });
        resizeBubbleCanvas();
        createBubbles();
        animate();
    }

    // メッセージカードのテキスト
    const messageTexts = [
        'ありがとう',
        '感謝',
        '大好き',
        'いつも',
        '笑顔',
        '最高',
        'お料理最高！',
        '優しいね',
        '見守ってくれて',
        '尊敬してる',
        '頼りになる',
        '相談相手'
    ];

    // メッセージカードの色
    const cardColors = [
        '#ffd1dc', // コーラルピンク
        '#98fb98', // ミントグリーン
        '#fffacd'  // クリームイエロー
    ];

    // メッセージカードを生成
    function createMessageCard() {
        const card = document.createElement('div');
        card.className = `message-card ${Math.random() > 0.5 ? 'heart' : 'star'}`;
        card.textContent = messageTexts[Math.floor(Math.random() * messageTexts.length)];
        card.style.backgroundColor = cardColors[Math.floor(Math.random() * cardColors.length)];
        card.style.left = `${Math.random() * 80 + 10}%`;
        
        const messageShower = document.querySelector('.message-shower');
        messageShower.appendChild(card);
        
        // タップイベント
        card.addEventListener('click', () => {
            card.style.transform = 'scale(1.2)';
            card.style.opacity = '0.8';
            setTimeout(() => {
                card.remove();
            }, 2000);
        });
        
        // アニメーション終了後に要素を削除
        card.addEventListener('animationend', () => {
            card.remove();
        });
    }

    // きらめきを生成
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        
        const sparkleContainer = document.querySelector('.sparkle-container');
        sparkleContainer.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }

    // 浮遊する粒子を生成
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        const floatingParticles = document.querySelector('.floating-particles');
        floatingParticles.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }

    // メッセージシャワーの開始
    function startMessageShower() {
        // メッセージカードの生成を開始
        setInterval(createMessageCard, 2000);
        
        // きらめきの生成を開始
        setInterval(createSparkle, 300);
        
        // 浮遊する粒子の生成を開始
        setInterval(createParticle, 1000);
    }

    // ナビゲーションボタンのクリックイベント
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.target;
            const currentSection = button.closest('section');
            
            // 現在のセクションをフェードアウト
            currentSection.classList.add('fade-out');
            
            setTimeout(() => {
                currentSection.classList.add('hidden');
                currentSection.classList.remove('fade-out');
                
                // ターゲットセクションを表示
                const nextSection = document.getElementById(targetSection);
                nextSection.classList.remove('hidden');
                nextSection.classList.add('fade-in');
                
                // メッセージカードのアニメーション
                if (targetSection === 'thank-you-section') {
                    messageCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
                
                // 思い出ギャラリーのアニメーション
                if (targetSection === 'memory-gallery-section') {
                    memoryItems.forEach((item, index) => {
                        const rotation = (Math.random() - 0.5) * 20;
                        const hoverRotation = (Math.random() - 0.5) * 10;
                        item.style.setProperty('--rotation', `${rotation}deg`);
                        item.style.setProperty('--hover-rotation', `${hoverRotation}deg`);
                        
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, index * 200);
                    });
                }
            }, 1000);
        });
    });

    // メッセージカードのクリックイベント
    messageCards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.dataset.name;
            const message = card.querySelector('p').textContent;
            
            // モーダルウィンドウの作成
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>${name}からのメッセージ</h2>
                    <p>${message}</p>
                    <button class="close-modal">閉じる</button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // モーダルをフェードイン
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // 閉じるボタンのイベントリスナー
            const closeButton = modal.querySelector('.close-modal');
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        });
    });

    // 思い出ギャラリーの写真クリックイベント
    memoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.caption').textContent;
            
            // ライトボックスの作成
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}">
                    <p>${caption}</p>
                    <button class="close-lightbox">閉じる</button>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            // ライトボックスをフェードイン
            setTimeout(() => {
                lightbox.classList.add('show');
            }, 10);
            
            // 閉じるボタンのイベントリスナー
            const closeButton = lightbox.querySelector('.close-lightbox');
            closeButton.addEventListener('click', () => {
                lightbox.classList.remove('show');
                setTimeout(() => {
                    lightbox.remove();
                }, 300);
            });
        });
    });

    // 隠しメッセージ
    cloverIcon.addEventListener('click', () => {
        const message = document.createElement('div');
        message.className = 'hidden-message-popup';
        message.textContent = 'お母さん、いつもありがとう！';
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 3000);
    });

    // 花びら・光の粒インタラクション
    if (messageSection) {
        function spawnParticle(x, y) {
            const isPetal = Math.random() < 0.6;
            const el = document.createElement('div');
            el.className = isPetal ? 'petal' : 'light-particle';
            el.style.left = (x - 14) + 'px';
            el.style.top = (y - 14) + 'px';
            messageSection.appendChild(el);
            setTimeout(() => el.remove(), isPetal ? 1800 : 1200);
        }
        // PC: マウス移動
        messageSection.addEventListener('mousemove', e => {
            if (e.buttons !== 0) return; // ドラッグ中は無視
            spawnParticle(e.clientX, e.clientY);
        });
        // スマホ: タッチ移動
        messageSection.addEventListener('touchmove', e => {
            if (e.touches.length > 0) {
                const t = e.touches[0];
                spawnParticle(t.clientX, t.clientY);
            }
        });
    }

    // スパークル演出
    const sparkleContainer = document.querySelector('.sparkle-container');
    if (sparkleContainer) {
        setInterval(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            // ボックス周囲のランダムな位置
            const angle = Math.random() * 2 * Math.PI;
            const radius = 90 + Math.random() * 30;
            const centerX = 90, centerY = 90;
            sparkle.style.left = `${centerX + Math.cos(angle) * radius}px`;
            sparkle.style.top = `${centerY + Math.sin(angle) * radius}px`;
            sparkleContainer.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1200);
        }, 1000);
    }
}); 