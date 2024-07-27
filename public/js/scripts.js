document.addEventListener("DOMContentLoaded", function() {
    const introScreen = document.getElementById('intro-screen');
    const enterButton = document.getElementById('enter-button');
    const audioElement = document.getElementById('background-music');
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const descriptionElement = document.getElementById("description");
    const descriptionText = descriptionElement.innerText;
    let index = 0;
    const speed = 100; // Typing speed in milliseconds

    const glowPresets = ['glow-color-1', 'glow-color-2', 'glow-color-3', 'glow-color-4'];
    let currentPresetIndex = 0;

    const navbar = document.getElementById('navbar');
    const body = document.body;

    function typeWriter() {
        if (index < descriptionText.length) {
            descriptionElement.innerHTML = descriptionText.substring(0, index + 1) + '<span class="caret">|</span>';
            index++;
            setTimeout(typeWriter, speed);
        } else {
            descriptionElement.innerHTML = descriptionText; // Remove caret after typing
        }
    }

    function updateGlowColor() {
        document.body.classList.remove(...glowPresets);
        document.body.classList.add(glowPresets[currentPresetIndex]);
        currentPresetIndex = (currentPresetIndex + 1) % glowPresets.length;
    }

    function toggleNavbar() {
        if (navbar.classList.contains('show')) {
            navbar.classList.remove('show');
            body.classList.remove('blur-effect');
        } else {
            navbar.classList.add('show');
            body.classList.add('blur-effect');
        }
    }

    // Replace with your actual audio URLs
    const songs = [
        "https://kuuichi.xyz/files/1230319937155760131/r1wx5702md0y.mp3",
    ];

    let currentSong = 0;
    audioElement.src = songs[currentSong];
    audioElement.pause(); // Ensure audio is initially paused

    audioElement.addEventListener('ended', () => {      
        currentSong++;
        if (currentSong >= songs.length) {
            currentSong = 0; 
        }
        
        audioElement.src = songs[currentSong];
        audioElement.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    });

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

    introScreen.addEventListener('click', () => {
        introScreen.style.display = 'none'; // Hide the intro screen
        typeWriter(); // Start typewriter effect
        incrementViewCount(); // Increment view count
        audioElement.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    });

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

    // Create particles that follow the cursor
    const particleCount = 8; // Increased number of particles
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('cursor-particle');
        document.body.appendChild(particle);
        particles.push(particle);
    }

    document.addEventListener('mousemove', (event) => {
        particles.forEach((particle, index) => {
            setTimeout(() => {
                const { clientX: x, clientY: y } = event;
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.opacity = '0.75';
                particle.style.transform = `translate(-50%, -50%) scale(1)`;
                particle.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            }, index * 30); // Stagger particles slightly
        });
    });

    document.addEventListener('mouseleave', () => {
        particles.forEach(particle => {
            particle.style.opacity = '0'; // Hide particles when cursor leaves the page
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            event.preventDefault(); // Prevent default tab behavior
            updateGlowColor(); // Change glow color on Tab key
        }

        if (event.key === 'f' || event.key === 'F') {
            toggleNavbar(); // Toggle navbar on 'F' key
        }
    });
});
