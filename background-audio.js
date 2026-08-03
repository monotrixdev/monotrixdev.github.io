(function() {
    // Import modern typography font
    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap';
    document.head.appendChild(fontLink);

    // Inject custom alert styles
    var style = document.createElement('style');
    style.textContent = `
      .custom-alert-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(10, 8, 12, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999999;
          opacity: 0;
          transition: opacity 0.25s ease;
          font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .custom-alert-box {
          background: rgba(22, 19, 26, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 32px 40px;
          max-width: 420px;
          width: 85%;
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.6), 
                      inset 0 1px 1px rgba(255, 255, 255, 0.15);
          text-align: center;
          transform: translateY(20px) scale(0.95);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          color: #fbf7fe;
      }
      .custom-alert-overlay.show {
          opacity: 1;
      }
      .custom-alert-overlay.show .custom-alert-box {
          transform: translateY(0) scale(1);
      }
      .custom-alert-message {
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 28px;
          white-space: pre-line;
          color: #e6def0;
          font-weight: 400;
      }
      .custom-alert-btn {
          background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
          color: white;
          border: none;
          padding: 12px 40px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 30px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
      }
      .custom-alert-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6);
          background: linear-gradient(135deg, #b865ff 0%, #8c4aff 100%);
      }
      .custom-alert-btn:active {
          transform: translateY(1px);
          box-shadow: 0 2px 10px rgba(124, 58, 237, 0.4);
      }
    `;
    document.head.appendChild(style);

    // Background audio playback script
    var audioSrc = 'audio/prank.mp3';
    var bgAudio = new Audio(audioSrc);
    bgAudio.loop = true;

    function startAudio() {
        bgAudio.play().then(function() {
            // Successfully playing, clean up listeners
            removeListeners();
        }).catch(function(err) {
            console.log("Autoplay blocked, waiting for user interaction:", err);
        });
    }

    function removeListeners() {
        document.removeEventListener('click', startAudio);
        document.removeEventListener('touchstart', startAudio);
        document.removeEventListener('mousedown', startAudio);
        document.removeEventListener('keydown', startAudio);
        document.removeEventListener('pointerdown', startAudio);
    }

    // Register interaction fallbacks to play audio
    document.addEventListener('click', startAudio);
    document.addEventListener('touchstart', startAudio);
    document.addEventListener('mousedown', startAudio);
    document.addEventListener('keydown', startAudio);
    document.addEventListener('pointerdown', startAudio);

    // Override window.alert with custom modal to prevent blocking and capture click for audio
    var alertQueue = [];
    var activeAlert = null;

    function showNextAlert() {
        if (activeAlert || alertQueue.length === 0) return;
        
        var message = alertQueue.shift();
        
        var overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        
        var box = document.createElement('div');
        box.className = 'custom-alert-box';
        
        var msgEl = document.createElement('div');
        msgEl.className = 'custom-alert-message';
        msgEl.textContent = message;
        
        var btn = document.createElement('button');
        btn.className = 'custom-alert-btn';
        btn.textContent = 'OK';
        
        box.appendChild(msgEl);
        box.appendChild(btn);
        overlay.appendChild(box);
        
        var parent = document.body || document.documentElement;
        parent.appendChild(overlay);
        
        activeAlert = overlay;
        
        // Trigger reflow
        overlay.offsetHeight;
        overlay.classList.add('show');
        
        var dismiss = function() {
            if (overlay.parentNode) {
                overlay.classList.remove('show');
                setTimeout(function() {
                    if (overlay.parentNode) {
                        parent.removeChild(overlay);
                    }
                    activeAlert = null;
                    showNextAlert();
                }, 300);
            }
            startAudio();
        };
        
        btn.onclick = dismiss;
        overlay.onclick = function(e) {
            if (e.target === overlay) {
                dismiss();
            }
        };
    }

    window.alert = function(message) {
        alertQueue.push(message);
        if (document.body) {
            showNextAlert();
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                showNextAlert();
            });
        }
    };

    // Try to play immediately when script executes
    startAudio();
})();
