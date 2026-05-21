<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Our Story - Page by Page</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0f172a;
            --card-bg: rgba(30, 41, 59, 0.7);
            --primary-accent: #f43f5e;
            --secondary-accent: #8b5cf6;
            --text-main: #f8fafc;
            --text-muted: #cbd5e1;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-color);
            background-image:
                radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
                radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%),
                radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%);
            background-attachment: fixed;
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            /* Prevent scrolling during transition */
        }

        .slider-container {
            position: relative;
            width: 100%;
            max-width: 900px;
            height: 80vh;
            max-height: 700px;
            perspective: 1000px;
        }

        .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            visibility: hidden;
            transform: scale(0.95) translateY(20px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 3rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        }

        .slide.active {
            opacity: 1;
            visibility: visible;
            transform: scale(1) translateY(0);
            z-index: 10;
        }

        .slide.exiting {
            transform: scale(1.05) translateY(-20px);
            opacity: 0;
            z-index: 5;
        }

        .slide.entering-back {
            transform: scale(0.95) translateY(-20px);
        }

        .slide.exiting-back {
            transform: scale(1.05) translateY(20px);
            opacity: 0;
        }

        h1 {
            font-size: 3.5rem;
            font-weight: 800;
            background: linear-gradient(to right, var(--primary-accent), var(--secondary-accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }

        h2 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--primary-accent);
        }

        p {
            font-size: 1.25rem;
            color: var(--text-muted);
            max-width: 600px;
            line-height: 1.8;
            margin-bottom: 2rem;
        }

        .photo-container {
            width: 100%;
            max-width: 400px;
            height: 300px;
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
            border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .photo-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .slide.active .photo-container img {
            animation: slowZoom 10s infinite alternate;
        }

        @keyframes slowZoom {
            from {
                transform: scale(1);
            }

            to {
                transform: scale(1.1);
            }
        }

        .controls {
            position: absolute;
            bottom: 2rem;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 1rem;
            z-index: 20;
        }

        button {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: var(--text-main);
            font-family: inherit;
            font-size: 1rem;
            padding: 0.75rem 2rem;
            border-radius: 999px;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        button:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            border-color: var(--primary-accent);
        }

        button:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .progress-dots {
            display: flex;
            gap: 0.5rem;
            position: absolute;
            bottom: -3rem;
            left: 50%;
            transform: translateX(-50%);
        }

        .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .dot.active {
            background: var(--primary-accent);
            transform: scale(1.3);
        }
    </style>
</head>

<body>

    <div class="slider-container">

        <!-- Slide 1: Welcome -->
        <div class="slide active" id="slide-0">
            <h1>Modified SetUp For CI/CD</h1>
            <p>Welcome to a little page dedicated to us. <br> Click next to flip through our memories.</p>
        </div>

        <!-- Slide 2: The Beginning -->
        <div class="slide" id="slide-1">
            <div class="photo-container">
                <!-- Replace src with your actual image URL -->
                <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800"
                    alt="How we met">
            </div>
            <h2>Chapter 1: The Beginning</h2>
            <p>This is where our story began. A simple hello that turned into endless conversations. I remember this day
                like it was yesterday.</p>
        </div>

        <!-- Slide 3: Adventures -->
        <div class="slide" id="slide-2">
            <div class="photo-container">
                <!-- Replace src with your actual image URL -->
                <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
                    alt="Our adventures">
            </div>
            <h2>Chapter 2: Our Adventures</h2>
            <p>From late-night food runs to spontaneous trips. Every moment spent exploring the world together has been
                nothing short of magical.</p>
        </div>

        <!-- Slide 4: Present -->
        <div class="slide" id="slide-3">
            <div class="photo-container">
                <!-- Replace src with your actual image URL -->
                <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800"
                    alt="Us today">
            </div>
            <h2>Chapter 3: Here and Now</h2>
            <p>You are my best friend, my biggest supporter, and my favorite person. I can't wait to see what the future
                holds for us.</p>
        </div>

        <div class="controls">
            <button id="prevBtn" onclick="changeSlide(-1)" disabled>
                <span>&larr;</span> Previous
            </button>
            <button id="nextBtn" onclick="changeSlide(1)">
                Next <span>&rarr;</span>
            </button>
        </div>

        <div class="progress-dots" id="dotsContainer">
            <!-- Dots generated by JS -->
        </div>

    </div>

    <script>
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dotsContainer = document.getElementById('dotsContainer');

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.onclick = () => goToSlide(index);
            dotsContainer.appendChild(dot);
        });
        const dots = document.querySelectorAll('.dot');

        function updateControls() {
            prevBtn.disabled = currentSlide === 0;

            if (currentSlide === slides.length - 1) {
                nextBtn.innerHTML = 'Finish <span style="color:var(--primary-accent)">❤️</span>';
            } else {
                nextBtn.innerHTML = 'Next <span>&rarr;</span>';
            }
        }

        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function changeSlide(direction) {
            const nextIndex = currentSlide + direction;
            if (nextIndex >= 0 && nextIndex < slides.length) {
                goToSlide(nextIndex, direction > 0);
            } else if (nextIndex === slides.length) {
                // If they click finish on last slide, maybe just loop back or show an alert
                goToSlide(0, false);
            }
        }

        function goToSlide(index, isForward = true) {
            if (index === currentSlide) return;

            const current = slides[currentSlide];
            const next = slides[index];

            // Determine direction if clicked via dots
            if (index > currentSlide) isForward = true;
            if (index < currentSlide) isForward = false;

            // Reset classes
            slides.forEach(s => s.className = 'slide');

            if (isForward) {
                current.classList.add('exiting');
                next.classList.add('active');
            } else {
                current.classList.add('exiting-back');
                next.classList.add('entering-back');
                // Small timeout to allow the initial transform to apply before transitioning to active
                setTimeout(() => {
                    next.classList.add('active');
                    next.classList.remove('entering-back');
                }, 10);
            }

            currentSlide = index;
            updateControls();
            updateDots();
        }
    </script>
</body>

</html>
