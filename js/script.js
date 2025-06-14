document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const giftBox = document.querySelector('.gift-box');
    const openGiftButton = document.getElementById('open-gift');
    const openingSection = document.getElementById('opening-section');
    const mainMessageSection = document.getElementById('main-message-section');
    const thankYouSection = document.getElementById('thank-you-section');
    const memoryGallerySection = document.getElementById('memory-gallery-section');
    const bgm = document.getElementById('bgm');
    const boxOpenSound = document.getElementById('box-open-sound');
    const messageCards = document.querySelectorAll('.message-card');
    const memoryItems = document.querySelectorAll('.memory-item');
    const navButtons = document.querySelectorAll('.nav-button');
    const bgmToggle = document.getElementById('bgm-toggle');
    const cloverIcon = document.querySelector('.clover-icon');
    const confettiContainer = document.querySelector('.confetti-container');

    // フェードイン/フェードアウトの時間（ミリ秒）
    const FADE_DURATION = 1000;

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

    // プレゼントボックスのクリックイベント
    giftBox.addEventListener('click', () => {
        console.log('プレゼントボックスをクリック');
        // プレゼントボックスを開く
        giftBox.classList.add('open');
        
        // オープニングセクションをフェードアウト
        openingSection.classList.add('fade-out');
        
        // 現在のBGM（box_open.mp3）をフェードアウト
        fadeOut(bgm, () => {
            console.log('BGM切り替え');
            // 新しいBGM（background_music.mp3）をフェードイン
            fadeIn(boxOpenSound);
        });
        
        setTimeout(() => {
            openingSection.classList.add('hidden');
            openingSection.classList.remove('fade-out');
            
            // メインメッセージセクションを表示
            mainMessageSection.classList.remove('hidden');
            mainMessageSection.classList.add('fade-in');
            
            // メッセージシャワーを開始
            startMessageShower();
        }, 1000);
    });

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

    // BGMコントロール
    const bgmControl = document.querySelector('.bgm-control');
    let isPlaying = true;

    bgmControl.addEventListener('click', () => {
        if (isPlaying) {
            // 現在再生中のBGMをフェードアウト
            if (giftBox.classList.contains('open')) {
                fadeOut(boxOpenSound);
            } else {
                fadeOut(bgm);
            }
            bgmControl.textContent = '♪';
        } else {
            // 現在の状態に応じて適切なBGMをフェードイン
            if (giftBox.classList.contains('open')) {
                fadeIn(boxOpenSound);
            } else {
                fadeIn(bgm);
            }
            bgmControl.textContent = '♫';
        }
        isPlaying = !isPlaying;
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