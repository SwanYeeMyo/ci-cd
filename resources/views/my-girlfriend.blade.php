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
            --card-bg: rgba(30, 41, 59, 0.9);
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
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }

        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            max-width: 900px;
            height: 75vh;
            margin: 0 auto;
        }

        .flip-book {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
            display: none; 
        }
        
        .flip-book.st-ready {
            display: block;
        }

        .page {
            background-color: #fdfbf7;
            color: #333;
            box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
            overflow: hidden;
        }

        .page::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('https://www.transparenttextures.com/patterns/cream-paper.png');
            opacity: 0.3;
            pointer-events: none;
        }

        .page-content {
            padding: 2rem;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            z-index: 2;
        }

        .page-cover {
            background: linear-gradient(135deg, var(--card-bg), #0f172a);
            color: var(--text-main);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .page-cover::after {
            display: none;
        }

        .page-cover h1 {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(to right, var(--primary-accent), var(--secondary-accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }

        h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--primary-accent);
        }

        p {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 1rem;
            color: #555;
        }

        .page-cover p {
            color: var(--text-muted);
        }

        .photo-container {
            width: 100%;
            height: 220px;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 1.5rem;
            box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
            position: relative;
        }

        .photo-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .page-number {
            position: absolute;
            bottom: 1rem;
            font-size: 0.9rem;
            color: #999;
            font-weight: bold;
            width: 100%;
            text-align: center;
            left: 0;
        }

        .controls {
            margin-top: 2rem;
            display: flex;
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
        }

        button:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            border-color: var(--primary-accent);
        }
    </style>
</head>

<body>

    <div class="container">
        <div class="flip-book" id="book">
            <!-- 1. Cover Page -->
            <div class="page page-cover front-cover" data-density="hard">
                <div class="page-content">
                    <h1>Our Story</h1>
                    <p>Welcome to a little page dedicated to us.<br><br>Flip to begin our journey.</p>
                </div>
            </div>

            <!-- 2. Inside Cover -->
            <div class="page">
                <div class="page-content">
                    <p><i>"Every love story is beautiful, but ours is my favorite."</i></p>
                    <div class="page-number">1</div>
                </div>
            </div>

            <!-- 3. Page 2 -->
            <div class="page">
                <div class="page-content">
                    <div class="photo-container">
                        <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800" alt="How we met">
                    </div>
                    <h2>The Beginning</h2>
                    <p>This is where our story began. A simple hello that turned into endless conversations. I remember this day like it was yesterday.</p>
                    <div class="page-number">2</div>
                </div>
            </div>

            <!-- 4. Page 3 -->
            <div class="page">
                <div class="page-content">
                    <div class="photo-container">
                        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800" alt="Our adventures">
                    </div>
                    <h2>Our Adventures</h2>
                    <p>From late-night food runs to spontaneous trips. Every moment spent exploring the world together has been nothing short of magical.</p>
                    <div class="page-number">3</div>
                </div>
            </div>

            <!-- 5 to 14. 10 Dummy pages -->
            @for ($i = 1; $i <= 10; $i++)
            <div class="page">
                <div class="page-content">
                    <div class="photo-container">
                        <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800&sig={{ $i }}" alt="Dummy Image {{ $i }}">
                    </div>
                    <h2>Chapter {{ $i + 2 }}</h2>
                    <p>This is memory #{{ $i }} of our wonderful journey together. Our bond continues to grow stronger with each passing day. Here's to more adventures.</p>
                    <div class="page-number">{{ $i + 3 }}</div>
                </div>
            </div>
            @endfor

            <!-- 15. Here and Now -->
            <div class="page">
                <div class="page-content">
                    <h2>Here and Now</h2>
                    <p>You are my best friend, my biggest supporter, and my favorite person. I can't wait to see what the future holds for us.</p>
                    <div class="page-number">14</div>
                </div>
            </div>
            
            <!-- 16. Dedication -->
            <div class="page">
                <div class="page-content">
                    <p>Thank you for everything.</p>
                    <div class="page-number">15</div>
                </div>
            </div>

            <!-- 17. Back Cover Inside -->
            <div class="page">
                <div class="page-content">
                    <p>To be continued...</p>
                    <div class="page-number">16</div>
                </div>
            </div>

            <!-- 18. Back Cover -->
            <div class="page page-cover back-cover" data-density="hard">
                <div class="page-content">
                    <h1>The End</h1>
                </div>
            </div>
        </div>
    </div>

    <div class="controls">
        <button id="prevBtn">
            &larr; Previous
        </button>
        <button id="nextBtn">
            Next &rarr;
        </button>
    </div>

    <!-- StPageFlip Script -->
    <script src="https://cdn.jsdelivr.net/npm/page-flip/dist/js/page-flip.browser.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const pageFlip = new St.PageFlip(document.getElementById('book'), {
                width: 400,     // base page width
                height: 600,    // base page height
                size: 'stretch',
                minWidth: 300,
                maxWidth: 450,
                minHeight: 400,
                maxHeight: 650,
                showCover: true,
                mobileScrollSupport: true,
                maxShadowOpacity: 0.5
            });

            pageFlip.loadFromHTML(document.querySelectorAll('.page'));

            document.getElementById('prevBtn').addEventListener('click', () => {
                pageFlip.flipPrev();
            });

            document.getElementById('nextBtn').addEventListener('click', () => {
                pageFlip.flipNext();
            });
            
            // Initializing class to show book only when ready to avoid flashing unstyled content
            document.getElementById('book').classList.add('st-ready');
        });
    </script>
</body>

</html>
