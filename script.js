// --- Element References ---
const container = document.querySelector('.container');
const passwordInput = document.getElementById('passwordInput');
const feedbackDiv = document.getElementById('feedback');
const generateButton = document.getElementById('generateButton');
const prophecyButton = document.getElementById('prophecyButton');
const jokeButton = document.getElementById('jokeButton');
const auraButton = document.getElementById('auraButton');
const moodIndicator = document.getElementById('moodIndicator');
const auraDisplay = document.getElementById('auraDisplay');
const languageSelector = document.getElementById('languageSelector');
let judgmentTimeout;
let currentLanguage = 'en';

// --- NEW: Translations Database ---
const translations = {
    en: {
        title: "The Oracle of Nonsense",
        subtitle: "Where your password is never good enough.",
        inputPlaceholder: "Enter password to be judged...",
        awaitingJudgement: "Awaiting judgement...",
        calibrating: "Calibrating nonsense...",
        moodPrefix: "The Oracle is feeling: ",
        generateButton: "Generate",
        prophecyButton: "Prophecy",
        jokeButton: "Cosmic Joke",
        auraButton: "Read Aura",
        moods: {
            sassy: "Sassy",
            poetic: "Poetic",
            sleepy: "Sleepy",
            confused: "Confused"
        },
        judgments: {
            sassy: ["Oh, honey, no.", "Did you even try?", "Bless your heart.", "Groundbreaking. Truly."],
            poetic: ["A thought as fleeting as a whisper...", "Like a lone cloud in a vast sky.", "An echo in a canyon."],
            sleepy: ["Zzz... huh? Oh, right. It's... fine.", "I'm too tired for this mediocrity.", "Wake me when it's interesting."],
            confused: ["Does... not... compute.", "I think you broke it. Or I did.", "Error 404: Logic not found."]
        },
        prophecyParts: {
            adjectives: ["The weeping", "A silent", "The forgotten"],
            nouns: ["star", "moon", "river"],
            verbs: ["shall unlock", "will consume", "dances with"],
            outcomes: ["the seventh seal.", "a forgotten truth.", "the heart of winter."]
        },
        cosmicJokes: ["Why did the sun go to school? To get brighter!", "How do you organize a space party? You planet!", "Why don't scientists trust atoms? They make up everything!"],
        aura: {
            prefix: "Your aura is a blend of",
            suffix: "and forgotten starlight.",
            adjectives: ["Cosmic", "Ephemeral", "Starlight"],
            nouns: ["Lilac", "Turquoise", "Glimmer"]
        }
    },
    ml: {
        title: "വിവേകശൂന്യതയുടെ വെളിച്ചപ്പാട്",
        subtitle: "നിങ്ങളുടെ പാസ്‌വേഡ് ഒരിക്കലും മികച്ചതല്ല.",
        inputPlaceholder: "വിമർശനത്തിനായി പാസ്‌വേഡ് നൽകുക...",
        awaitingJudgement: "വിമർശനത്തിനായി കാത്തിരിക്കുന്നു...",
        calibrating: "അസംബന്ധം ക്രമീകരിക്കുന്നു...",
        moodPrefix: "വെളിച്ചപ്പാടിന് തോന്നുന്നു: ",
        generateButton: "സൃഷ്ടിക്കുക",
        prophecyButton: "പ്രവചനം",
        jokeButton: "പ്രപഞ്ച തമാശ",
        auraButton: "പ്രഭാവലയം വായിക്കുക",
        moods: {
            sassy: "അഹങ്കാരി",
            poetic: "കാവ്യാത്മകം",
            sleepy: "ഉറക്കം",
            confused: "ആശയക്കുഴപ്പം"
        },
        judgments: {
            sassy: ["ഓ, വേണ്ട. വെറുതെ വേണ്ട.", "ഒന്ന് ശ്രമിച്ചോ?", "നിങ്ങളുടെ ഹൃദയം അനുഗ്രഹിക്കപ്പെടട്ടെ."],
            poetic: ["ശൂന്യതയിലെ മന്ത്രം പോലെ ഒരു ചിന്ത.", "വിശാലമായ ആകാശത്തിലെ ഒറ്റ മേഘം പോലെ.", "ഒരു കൊടുങ്കാറ്റിനെതിരെ ഒരു മെഴുകുതിരി."],
            sleepy: ["ഉറങ്ങുന്നു... എന്താ? കുഴപ്പമില്ല.", "ഈ നിലവാരമില്ലായ്മക്ക് ഞാൻ വളരെ ക്ഷീണിതനാണ്.", "രസമുള്ളപ്പോൾ എന്നെ ഉണർത്തുക."],
            confused: ["കണക്കുകൂട്ടുന്നില്ല...", "നിങ്ങളിത് തകർത്തുവെന്ന് തോന്നുന്നു.", "തെറ്റ് 404: യുക്തി കണ്ടെത്തിയില്ല."]
        },
        prophecyParts: {
            adjectives: ["കരയുന്ന", "നിശബ്ദമായ", "മറന്നുപോയ"],
            nouns: ["നക്ഷത്രം", "ചന്ദ്രൻ", "നദി"],
            verbs: ["തുറക്കും", "വിഴുങ്ങും", "നൃത്തം ചെയ്യുന്നു"],
            outcomes: ["ഏഴാമത്തെ മുദ്ര.", "മറന്ന സത്യം.", "തണുപ്പുകാലത്തിന്റെ ഹൃദയം."]
        },
        cosmicJokes: ["സൂര്യൻ എന്തിനാണ് സ്കൂളിൽ പോയത്? കൂടുതൽ പ്രകാശിക്കാൻ!", "ഒരു ബഹിരാകാശ പാർട്ടി എങ്ങനെ സംഘടിപ്പിക്കാം? നിങ്ങൾ ഗ്രഹിക്കുക!", "ശാസ്ത്രജ്ഞർ ആറ്റങ്ങളെ വിശ്വസിക്കാത്തത് എന്തുകൊണ്ട്? കാരണം അവ എല്ലാം ഉണ്ടാക്കുന്നു!"],
        aura: {
            prefix: "നിങ്ങളുടെ പ്രഭാവലയം ഒരു മിശ്രിതമാണ്",
            suffix: "കൂടാതെ മറന്നുപോയ നക്ഷത്രവെളിച്ചവും.",
            adjectives: ["പ്രപഞ്ച", "ക്ഷണികമായ", "നക്ഷത്രവെളിച്ചം"],
            nouns: ["ലൈലാക്ക്", "ടർക്കോയ്സ്", "തിളക്കം"]
        }
    }
};
let currentMood = 'sassy';

// --- Functions ---

function typeWriter(element, text) {
    element.innerHTML = ""; let i = 0; const speed = 50;
    function type() { if (i < text.length) { element.innerHTML += text.charAt(i); i++; setTimeout(type, speed); } }
    type();
}

function triggerScreenShake() {
    document.body.style.animation = 'violent-shake 0.3s linear';
    setTimeout(() => { document.body.style.animation = ''; }, 300);
}

function playNonsenseSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = ['sine', 'square', 'sawtooth', 'triangle'][Math.floor(Math.random() * 4)];
    oscillator.frequency.setValueAtTime(Math.random() * 800 + 200, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
}

function changeMood() {
    const moods = Object.keys(translations[currentLanguage].moods);
    currentMood = moods[Math.floor(Math.random() * moods.length)];
    const moodText = translations[currentLanguage].moods[currentMood];
    moodIndicator.textContent = `${translations[currentLanguage].moodPrefix}${moodText}`;
}

// NEW: Set Language Function
function setLanguage(lang) {
    currentLanguage = lang;
    const t = translations[lang];
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (el.tagName === 'INPUT') {
            el.placeholder = t[key];
        } else {
            el.textContent = t[key];
        }
    });
    // Reset feedback text to the new language's default
    feedbackDiv.innerHTML = `<p>${t.awaitingJudgement}</p>`;
    changeMood(); // Update mood text in new language
}

// --- Event Listeners ---

languageSelector.addEventListener('change', (e) => {
    setLanguage(e.target.value);
});

passwordInput.addEventListener('input', () => {
    const text = passwordInput.value.toLowerCase();
    clearTimeout(judgmentTimeout);
    auraDisplay.innerHTML = "";
    if (text.length === 0) {
        feedbackDiv.innerHTML = `<p>${translations[currentLanguage].awaitingJudgement}</p>`;
        feedbackDiv.className = 'feedback';
        return;
    }
    feedbackDiv.innerHTML = `<p>${translations[currentLanguage].calibrating}</p>`;
    feedbackDiv.className = 'feedback feedback-neutral';
    judgmentTimeout = setTimeout(() => {
        const moodJudgments = translations[currentLanguage].judgments[currentMood];
        const judgment = moodJudgments[Math.floor(Math.random() * moodJudgments.length)];
        feedbackDiv.className = `feedback feedback-${currentMood}`;
        typeWriter(feedbackDiv, judgment);
        triggerScreenShake();
    }, 1200);
});

generateButton.addEventListener('click', () => {
    playNonsenseSound(); // Moved sound to start of action
    const action = Math.floor(Math.random() * 5); // Simplified actions
    switch (action) {
        case 0: passwordInput.value = ''; break;
        case 1: 
            generateButton.disabled = true;
            const originalText = generateButton.textContent;
            generateButton.textContent = "Nope.";
            setTimeout(() => { generateButton.disabled = false; generateButton.textContent = originalText; }, 3000);
            break;
        case 2: document.body.style.filter = 'invert(1)'; setTimeout(() => { document.body.style.filter = ''; }, 500); break;
        case 3: document.body.style.filter = 'blur(5px)'; setTimeout(() => { document.body.style.filter = ''; }, 2000); break;
        case 4: document.body.style.userSelect = 'none'; setTimeout(() => { document.body.style.userSelect = 'auto'; }, 3000); break;
    }
    passwordInput.dispatchEvent(new Event('input'));
});

prophecyButton.addEventListener('click', () => {
    const parts = translations[currentLanguage].prophecyParts;
    const adj = parts.adjectives[Math.floor(Math.random() * parts.adjectives.length)];
    const noun = parts.nouns[Math.floor(Math.random() * parts.nouns.length)];
    const verb = parts.verbs[Math.floor(Math.random() * parts.verbs.length)];
    const outcome = parts.outcomes[Math.floor(Math.random() * parts.outcomes.length)];
    const prophecy = `${adj} ${noun} ${verb} ${outcome}`;
    feedbackDiv.className = 'feedback feedback-prophecy';
    typeWriter(feedbackDiv, prophecy);
    playNonsenseSound();
    auraDisplay.innerHTML = "";
});

jokeButton.addEventListener('click', () => {
    const jokes = translations[currentLanguage].cosmicJokes;
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    feedbackDiv.className = 'feedback feedback-joke';
    typeWriter(feedbackDiv, joke);
    playNonsenseSound();
    auraDisplay.innerHTML = "";
});

auraButton.addEventListener('click', () => {
    auraDisplay.innerHTML = "";
    const numColors = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < numColors; i++) {
        const swatch = document.createElement('div');
        swatch.className = 'aura-swatch';
        swatch.style.background = `hsl(${Math.random() * 360}, 70%, 70%)`;
        auraDisplay.appendChild(swatch);
    }
    const t = translations[currentLanguage].aura;
    const adj = t.adjectives[Math.floor(Math.random() * t.adjectives.length)];
    const noun = t.nouns[Math.floor(Math.random() * t.nouns.length)];
    const auraName = `${t.prefix} ${adj} ${noun} ${t.suffix}`;
    feedbackDiv.className = 'feedback feedback-aura';
    typeWriter(feedbackDiv, auraName);
    playNonsenseSound();
});


// --- Interactive 3D Tilt Effect ---
document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const halfW = innerWidth / 2;
    const halfH = innerHeight / 2;
    const rotX = ((clientY - halfH) / halfH) * -8;
    const rotY = ((clientX - halfW) / halfW) * 8;
    container.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
});

document.addEventListener('mouseleave', () => {
    container.style.transform = `rotateX(0deg) rotateY(0deg)`;
});

// --- Initial Setup ---
setLanguage('en'); // Set default language on load
