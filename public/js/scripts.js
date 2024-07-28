document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const audioElement = document.getElementById('background-music');
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const descriptionElement = document.getElementById("description");
    const descriptionText = descriptionElement.innerText;
    const glowPresets = ['glow-color-1', 'glow-color-2', 'glow-color-3', 'glow-color-4'];
    let currentPresetIndex = 0;
    let intervalId = null;
    const beatInterval = 480; // milliseconds
    const startTimestamp = 33.5; // start toggling at 0:31
    let index = 0;
    const speed = 100; // Typing speed in milliseconds

    // Update background gradient on mouse move
    document.addEventListener('mousemove', (event) => {
        body.style.setProperty('--mouse-x', `${event.clientX}px`);
        body.style.setProperty('--mouse-y', `${event.clientY}px`);
    });

    function updateGlowColor() {
        console.log("Updating glow color..."); // Debugging line
        body.classList.remove(...glowPresets);
        body.classList.add(glowPresets[currentPresetIndex]);
        const newAccentColor = getComputedStyle(body).getPropertyValue(`--${glowPresets[currentPresetIndex]}`);
        body.style.setProperty('--accent', newAccentColor.trim());
        currentPresetIndex = (currentPresetIndex + 1) % glowPresets.length;
    }

    function startAutomaticGlowColorChange() {
        if (intervalId) clearInterval(intervalId); // Clear any existing intervals
        intervalId = setInterval(updateGlowColor, beatInterval);
        console.log("Started automatic glow color change."); // Debugging line
    }

    function handleAudioTimeUpdate() {
        const currentTime = audioElement.currentTime;
        console.log(`Audio current time: ${currentTime}`); // Debugging line
        if (currentTime >= startTimestamp && !intervalId) {
            startAutomaticGlowColorChange();
            console.log(`Automatic color change should start now at ${currentTime}`); // Debugging line
        }
    }

    function toggleNavbar() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.toggle('show');
            body.classList.toggle('blur-effect');
        }
    }

    function initializeEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                event.preventDefault();
                updateGlowColor();
            } else if (event.key.toLowerCase() === 'f') {
                toggleNavbar();
            }
        });

        document.addEventListener('click', (event) => {
            createRipple(event.clientX, event.clientY);
        });

        audioElement.addEventListener('timeupdate', handleAudioTimeUpdate);

        playButton.addEventListener('click', () => {
            audioElement.pause();
            playButton.style.display = 'none';
            pauseButton.style.display = 'block';
        });

        pauseButton.addEventListener('click', () => {
            audioElement.play().catch(error => {
                console.error("Error playing audio:", error);
            });
            playButton.style.display = 'block';
            pauseButton.style.display = 'none';
        });

        const introScreen = document.getElementById('intro-screen');
        introScreen.addEventListener('click', () => {
            introScreen.style.display = 'none';
            typeWriter();
            incrementViewCount();
            audioElement.play().catch(error => {
                console.error("Error playing audio:", error);
            });
        });
    }

    function typeWriter() {
        if (index < descriptionText.length) {
            descriptionElement.innerHTML = descriptionText.substring(0, index + 1) + '<span class="caret">|</span>';
            index++;
            setTimeout(typeWriter, speed);
        } else {
            descriptionElement.innerHTML = descriptionText; // Remove caret after typing
        }
    }

    function incrementViewCount() {
        fetch('/view-counter', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                document.getElementById('view-count').innerText = data.count;
            })
            .catch(error => {
                console.error("Error updating view count:", error);
            });
    }

    function createRipple(x, y) {
        // Function to create ripple effect (implementation not provided in the question)
    }

    // Initialize audio and other elements (play/pause, description typing, etc.)
    audioElement.src = "https://kuuichi.xyz/files/1230319937155760131/r1wx5702md0y.mp3";
    audioElement.pause();

    audioElement.addEventListener('ended', () => {
        audioElement.src = "https://kuuichi.xyz/files/1230319937155760131/r1wx5702md0y.mp3";
        audioElement.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    });

    initializeEventListeners();
});

