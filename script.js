document.addEventListener('DOMContentLoaded', () => {

    // --- DATA ---
    // Define all challenges here. Easy to add more.
    const challenges = [
        {
            id: 1,
            title: "Hidden in Plain Sight",
            category: "Steganography",
            points: 100,
            difficulty: "Easy",
            description: `
                <p>Welcome to the world of steganography, the art of hiding messages in plain sight.</p>
                <p class="mt-2">We've intercepted an image file from a target, but it seems too... normal. We suspect there's a hidden message inside.</p>
                <p class="mt-2">Your mission is to analyze the image and extract the hidden flag.</p>
                <p class="mt-4 text-green-400"><strong>Hint:</strong> Sometimes, data is hidden at the very end of a file. A simple text or hex editor might reveal more than you think. Or maybe a tool like 'steghide' could be useful, perhaps with an empty password?</p>
            `,
            files: [
                { name: "secret-image.jpg", url: "https://i.imgur.com/8sA8a7d.jpeg" } // A sample image. For a real challenge, you'd embed data in this.
            ],
            flag: "aegis{d4t4_h1d1ng_m45t3r}",
            solved: false
        },
        {
            id: 2,
            title: "Ancient Cipher",
            category: "Cryptography",
            points: 150,
            difficulty: "Easy",
            description: "Placeholder for a cryptography challenge. Maybe a Caesar cipher or a substitution cipher.",
            files: [],
            flag: "aegis{placeholder_crypto_1}",
            solved: false
        },
        {
            id: 3,
            title: "Web Woes",
            category: "Web Exploitation",
            points: 200,
            difficulty: "Medium",
            description: "Placeholder for a web challenge. Could involve inspecting page source, checking cookies, or basic JS analysis.",
            files: [],
            flag: "aegis{placeholder_web_1}",
            solved: false
        },
        {
            id: 4,
            title: "Rotten Cipher",
            category: "Cryptography",
            points: 250,
            difficulty: "Medium",
            description: "Placeholder for a more advanced cryptography challenge, like ROT13 or a simple Vigenère cipher.",
            files: [],
            flag: "aegis{placeholder_crypto_2}",
            solved: false
        },
        {
            id: 5,
            title: "Binary Blocks",
            category: "Reverse Engineering",
            points: 300,
            difficulty: "Hard",
            description: "Placeholder for a simple reversing challenge. Maybe analyzing a small binary or a piece of assembly code.",
            files: [],
            flag: "aegis{placeholder_rev_1}",
            solved: false
        },
    ];

    // --- DOM ELEMENTS ---
    const challengesGrid = document.getElementById('challenges-grid');
    const modal = document.getElementById('challenge-modal');
    const modalContent = document.getElementById('modal-content');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const submitFlagBtn = document.getElementById('submit-flag-btn');
    const flagInput = document.getElementById('flag-input');
    const flagFeedback = document.getElementById('flag-feedback');
    const userScoreEl = document.getElementById('user-score');
    
    // --- FUNCTIONS ---

    const updateScore = () => {
        const totalScore = challenges
            .filter(c => c.solved)
            .reduce((sum, c) => sum + c.points, 0);
        userScoreEl.textContent = `${totalScore} pts`;
    };

    const renderChallenges = () => {
        challengesGrid.innerHTML = ''; // Clear existing challenges
        challenges.forEach(challenge => {
            const difficultyColors = {
                'Easy': 'bg-green-500/20 text-green-400 border border-green-500/30',
                'Medium': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
                'Hard': 'bg-red-500/20 text-red-400 border border-red-500/30'
            };

            const card = document.createElement('div');
            card.className = `challenge-card rounded-lg p-6 cursor-pointer flex flex-col justify-between ${challenge.solved ? 'solved-card opacity-60' : ''}`;
            card.dataset.id = challenge.id;
            
            card.innerHTML = `
                <div>
                    <div class="flex justify-between items-start">
                        <span class="text-sm font-semibold text-gray-400">${challenge.category}</span>
                        ${challenge.solved ? '<span class="text-xs font-bold text-green-400 bg-green-900/50 px-2 py-1 rounded">SOLVED</span>' : ''}
                    </div>
                    <h3 class="text-2xl font-bold mt-2 text-white">${challenge.title}</h3>
                </div>
                <div class="flex justify-between items-center mt-6">
                    <span class="text-lg font-bold text-green-400">${challenge.points} Points</span>
                    <span class="text-xs font-bold px-3 py-1 rounded-full ${difficultyColors[challenge.difficulty]}">${challenge.difficulty}</span>
                </div>
            `;
            
            card.addEventListener('click', () => openModal(challenge.id));
            challengesGrid.appendChild(card);
        });
    };

    const openModal = (id) => {
        const challenge = challenges.find(c => c.id === id);
        if (!challenge) return;

        // Populate modal content
        modalBody.innerHTML = `
            <span class="text-sm font-semibold text-gray-400">${challenge.category}</span>
            <h2 class="text-3xl font-bold mt-1 text-white">${challenge.title}</h2>
            <div class="flex items-center space-x-4 mt-2 mb-4">
                <span class="text-lg font-bold text-green-400">${challenge.points} Points</span>
                <span class="text-sm font-bold px-3 py-1 rounded-full ${ {
                    'Easy': 'bg-green-500/20 text-green-400',
                    'Medium': 'bg-yellow-500/20 text-yellow-400',
                    'Hard': 'bg-red-500/20 text-red-400'
                }[challenge.difficulty] }">${challenge.difficulty}</span>
            </div>
            <div class="text-gray-300 space-y-2 prose">${challenge.description}</div>
            ${challenge.files.length > 0 ? `
                <div class="mt-4">
                    <h4 class="font-semibold text-white mb-2">Files:</h4>
                    ${challenge.files.map(file => `
                        <a href="${file.url}" target="_blank" rel="noopener noreferrer" class="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors">
                            Download ${file.name}
                        </a>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        // Store current challenge ID for the submit button
        submitFlagBtn.dataset.id = id;

        // Reset flag input and feedback
        flagInput.value = '';
        flagFeedback.textContent = '';
        flagFeedback.className = 'mt-3 text-sm h-5';
        flagInput.disabled = challenge.solved;
        submitFlagBtn.disabled = challenge.solved;

        if (challenge.solved) {
            flagFeedback.textContent = "You have already solved this challenge.";
            flagFeedback.classList.add('text-green-400');
            submitFlagBtn.textContent = "Solved";
        } else {
            submitFlagBtn.textContent = "Submit";
        }
        
        // Show modal with animation
        modal.classList.remove('hidden');
        setTimeout(() => modalContent.classList.remove('scale-95', 'opacity-0'), 10);
    };

    const closeModal = () => {
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    const submitFlag = () => {
        const id = parseInt(submitFlagBtn.dataset.id);
        const challenge = challenges.find(c => c.id === id);
        const submittedFlag = flagInput.value.trim();

        if (!challenge || challenge.solved) return;

        if (submittedFlag === challenge.flag) {
            flagFeedback.textContent = "Correct! Well done.";
            flagFeedback.className = 'mt-3 text-sm h-5 text-green-400';
            challenge.solved = true;
            
            setTimeout(() => {
                closeModal();
                updateScore();
                renderChallenges();
            }, 1500);
        } else {
            flagFeedback.textContent = "Incorrect flag. Please try again.";
            flagFeedback.className = 'mt-3 text-sm h-5 text-red-400';
            // Add a little shake animation for incorrect attempts
            modalContent.classList.add('animate-shake');
            setTimeout(() => modalContent.classList.remove('animate-shake'), 500);
        }
    };
    
    // Add a simple shake animation to Tailwind config (in a real project)
    // For this minimal setup, we inject it directly.
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
            animation: shake 0.5s ease-in-out;
        }
    `;
    document.head.appendChild(style);

    // --- EVENT LISTENERS ---
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    submitFlagBtn.addEventListener('click', submitFlag);
    flagInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            submitFlag();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // --- INITIALIZATION ---
    renderChallenges();
    updateScore();
});
