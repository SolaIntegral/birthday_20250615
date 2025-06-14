document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const giftBox = document.getElementById('gift-box');
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
    const giftBoxTop = document.getElementById('gift-box-top');
    const lightEffect = document.getElementById('light-effect');

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

    // ギフトボックスのクリックイベント
    giftBox.addEventListener('click', () => {
        if (isBoxOpened) return;
        
        // 蓋のアニメーション
        giftBoxTop.style.opacity = '1';
        giftBoxTop.classList.add('open');
        
        // 光のエフェクト
        lightEffect.classList.add('active');
        
        // サウンド再生
        boxOpenSound.play();
        
        // 状態更新
        isBoxOpened = true;
        
        // セクション切り替え
        setTimeout(() => {
            openingSection.style.display = 'none';
            messageSection.style.display = 'flex';
        }, 1500);
    });

    // スクラッチカバー
    const scratchCover = document.getElementById('scratch-cover');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function initScratchCover() {
        canvas.width = scratchCover.offsetWidth;
        canvas.height = scratchCover.offsetHeight;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        scratchCover.appendChild(canvas);
    }

    function scratch(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // スクラッチ音を再生
        if (!scratchSound.playing) {
            scratchSound.currentTime = 0;
            scratchSound.play();
        }
        
        lastX = x;
        lastY = y;
    }

    // タッチイベント
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        scratch(e);
    });

    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseleave', () => isDrawing = false);

    canvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        scratch(e);
    });

    canvas.addEventListener('touchmove', scratch);
    canvas.addEventListener('touchend', () => isDrawing = false);

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
        initScratchCover();
        showPage(0);
    }

    // ページ読み込み完了時に初期化
    window.addEventListener('load', init);

    // 星の生成
    function createStars() {
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            floatingStars.appendChild(star);
        }
    }

    // 初期化
    function init() {
        // 要素の初期状態設定
        messageSection.style.display = 'none';
        albumSection.style.display = 'none';
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

    // シャボン玉の生成
    function createBubbles() {
        const bubblesContainer = document.querySelector('.bubbles');
        for (let i = 0; i < 10; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.style.left = Math.random() * 100 + 'vw';
            bubble.style.animationDelay = Math.random() * 4 + 's';
            bubblesContainer.appendChild(bubble);
        }
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

    // 初期化
    createConfetti();
}); 