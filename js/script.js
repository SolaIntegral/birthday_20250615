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

    // プレゼントボックスのクリックイベント
    giftBox.addEventListener('click', () => {
        openGiftButton.classList.remove('hidden');
        giftBox.style.cursor = 'pointer';
    });

    // 開けるボタンのクリックイベント
    openGiftButton.addEventListener('click', () => {
        // 効果音再生
        boxOpenSound.play();
        
        // プレゼントボックスを開く
        giftBox.classList.add('open');
        
        // オープニングセクションをフェードアウト
        openingSection.classList.add('fade-out');
        
        setTimeout(() => {
            openingSection.classList.add('hidden');
            openingSection.classList.remove('fade-out');
            
            // メインメッセージセクションを表示
            mainMessageSection.classList.remove('hidden');
            mainMessageSection.classList.add('fade-in');
            
            // 背景画像をフェードイン
            const backgroundImage = mainMessageSection.querySelector('.background-image');
            backgroundImage.style.opacity = '1';
            
            // メッセージコンテナを表示
            const messageContainer = mainMessageSection.querySelector('.message-container');
            messageContainer.classList.add('show');
            
            // シャボン玉を生成
            createBubbles();
            
            // BGM再生開始
            bgm.play();
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
    bgmToggle.addEventListener('click', () => {
        if (bgm.paused) {
            bgm.play();
            bgmToggle.querySelector('.music-note').textContent = '♪';
        } else {
            bgm.pause();
            bgmToggle.querySelector('.music-note').textContent = '♫';
        }
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