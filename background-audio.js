(function() {
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

    // Try to play immediately when script executes
    startAudio();
})();
