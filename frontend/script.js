let gameState = {
    username: '',
    password: '',
    goodreasons: '',
    badreasons: '',
    passwordBreached: false,
    score: 0,
    attempt: 0,
};

// window.addEventListener('beforeunload', (event) => {
//     event.preventDefault();
//     const confirmationMessage = 'Êtes-vous sûr de vouloir partir ? Vos progrès pourraient être perdus.';
//     return confirmationMessage;
// });

// Phase 1: Splash Page with Leaderboard
function showSplashPage() {
    document.getElementById('game-container').innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 class="text-4xl font-bold mb-6">Bienvenue</h1>
            <h1 class="text-4xl font-bold mb-6">Au Jeu de Mot de Passe!</h1>

            
            <div class="bg-white border rounded-lg shadow-lg p-4 mb-6 w-11/12 max-w-md h-1/2 overflow-auto">
                <h2 class="text-4xl font-bold mb-4 text-center">Classement</h2>
                <ul class="space-y-2 max-h-64 min-h-64 overflow-y-auto" id="leaderboard">
                    <!-- Placeholder for leaderboard content -->
                </ul>
            </div>

            <button id="start-button" class="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition" onclick="startGame()">
                Commencer le Jeu
            </button>
        </div>
    `;

    fetchLeaderboard();
}

function fetchLeaderboard() {
    // Fetch leaderboard from /api/board
    fetch('/api/board')
        .then(response => response.json())
        .then(data => {
            let leaderboardHtml = '';
            data.forEach(entry => {
                leaderboardHtml += `<li>${entry.user}: ${entry.score}</li>`;
            });

            if (leaderboardHtml == '') {
                leaderboardHtml += `<li class="text-center">Aucun participant pour le moment.</li>`;
                leaderboardHtml += `<li class="text-center">Soyez le premier à jouer !</li>`;
            }

            document.getElementById('leaderboard').innerHTML = leaderboardHtml;
        });
}

function startGame() {
    showPasswordResetPage();
}

// Phase 2: Fake Password Reset
function showPasswordResetPage() {
    document.getElementById('game-container').innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 class="text-2xl font-semibold mb-4">Réinitialiser votre mot de passe</h2>
            <p class="mb-4 text-center">
                Imaginez que vous devez créer un nouveau mot de passe pour votre compte professionnel fictif.
            </p>
            <p class="mb-4 text-center">
                Sélectionnez un mot de passe que vous jugez à la fois sécurisé et facile à retenir.
            </p>
        <input type="password" id="password" placeholder="Entrez votre nouveau mot de passe" class="border rounded-lg p-2 mb-4 w-64" />
        <button class="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition" onclick="submitPassword()">
            Valider mon mot de passe
        </button>
    </div>
    `;

    showInstructions();
}

function showInstructions() {
    document.body.innerHTML += `
        <div id="instructions" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="rounded-lg bg-white p-8 shadow-2xl max-w-2xl w-full">
                <h2 class="text-lg font-bold">À propos du jeu</h2>

                <p class="mt-2 text-sm text-gray-500">
                    <p>Ce défi vise à évaluer votre capacité à créer des mots de passe sécurisés. Voici comment ça fonctionne :</p>
                    <ol class="list-decimal list-inside mt-2">
                        <li>On vous demandera de réinitialiser votre mot de passe pour un compte fictif.</li>
                        <li>Créez un mot de passe que vous estimez à la fois sécurisé et facile à retenir.</li>
                        <li>Vous gagnerez des points en fonction de la sécurité de votre mot de passe.</li>
                        <li>N'oubliez pas : vous devez pouvoir vous souvenir de ce mot de passe !</li>
                    </ol>
                </p>


                <div class="mt-4 flex gap-2">
                    <button type="button" class="rounded bg-green-50 px-4 py-2 text-sm font-medium text-green-600" onclick="closeInstructions()">
                        C'est bon!
                    </button>
                </div>
            </div>
        </div>
    `;
}

function closeInstructions() {
    const popup = document.getElementById("instructions");
    if (popup) {
        popup.remove();
    }
}

function submitPassword() {
    const password = document.getElementById('password').value;

    if (password.trim() === "") {
        showBlockingAlert("Erreur de Connexion", "Veuillez entrer un mot de passe valide avant de continuer.")
        return;
    }

    gameState.password = password;

    showMemoryCheckPopup()
}

function showBlockingAlert(title, message) {
    document.body.innerHTML += `
    <div id="alert" class="fixed top-0 left-0 right-0 flex items-center justify-center z-50 p-4">
        <div role="alert" class="rounded border-s-4 border-red-500 bg-red-50 p-4 w-full max-w-md">
            <div class="flex items-center gap-2 text-red-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                    <path
                        fill-rule="evenodd"
                        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        clip-rule="evenodd"
                    />
                </svg>

                <strong class="block font-medium">${title}</strong>
            </div>

            <p class="mt-2 text-sm text-red-700">
                ${message}
            </p>
        </div>
    </div>
    `;

    setTimeout(() => {
        const alertElement = document.getElementById("alert");
        if (alertElement) {
            alertElement.remove();
        }
    }, 5000); // 5000 milliseconds = 5 seconds
}


function showMemoryCheckPopup() {
    document.body.innerHTML += `
        <div id="memory-check" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="rounded-lg bg-white p-8 shadow-2xl max-w-2xl w-full">
                <h2 class="text-lg font-bold">Êtes-vous sûr de pouvoir vous en rappeler ?</h2>

                <p class="mt-2 text-sm text-gray-500">
                    Cela semble assez complexe. Assurez-vous de choisir un mot de passe que vous pourrez mémoriser facilement pour éviter d'être bloqué lors de votre prochaine connexion.
                </p>

                <div class="mt-4 flex gap-2">
                    <button type="button" class="rounded bg-green-50 px-4 py-2 text-sm font-medium text-green-600" onclick="nextMemoryCheckPopup()">
                    Suivant
                    </button>

                    <button type="button" class="rounded bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600" onclick="closeMemoryCheckPopup()">
                    Rester
                    </button>
                </div>
            </div>
        </div>
    `;
}

function nextMemoryCheckPopup() {
    closeMemoryCheckPopup();
    showFunFactPage();
}

function closeMemoryCheckPopup() {
    const popup = document.getElementById("memory-check");
    if (popup) {
        popup.remove();
    }
}

// Phase 3: Text Box with Paragraph
function showFunFactPage() {
    // Fetch the content of the fun fact JSON file
    fetch('./resources/funfact.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('game-container').innerHTML = `
                <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <h2 class="text-2xl font-semibold mb-4">${data.title}</h2>
                    <p class="text-center mb-4 max-w-lg mx-auto">
                        ${data.content}
                    </p>
                    <img src="${data.image}" alt="Fun Fact" class="mx-auto mb-4 w-64 h-auto">
                    <button class="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition" onclick="showLoginPage()">
                        Suivant
                    </button>
                </div>
            `;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


// Phase 4: Fake Login Page
function showLoginPage() {
    document.getElementById('game-container').innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 class="text-2xl font-semibold mb-4">Connexion à votre compte</h2>
            <p class="mb-4 text-center">
                Maintenant, essayez de vous connecter en utilisant le mot de passe que vous venez de créer.
            </p>
            <p class="mb-4 text-center">
                Pour le classement, veuillez utiliser votre adresse e-mail comme nom d'utilisateur.
            </p>

            <input type="text" id="username" placeholder="Nom d'utilisateur" class="border rounded-lg p-2 mb-2 w-64" />
            <input type="password" id="login-password" placeholder="Mot de passe" class="border rounded-lg p-2 mb-4 w-64" />
            <button class="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition" onclick="submitLogin()">
                Se connecter
            </button>
        </div>
    `;
}

async function submitLogin() {
    const username = document.getElementById('username').value;
    const loginPassword = document.getElementById('login-password').value;
    const maxUsernameLength = 110;

    if (username.trim() === "") {
        showBlockingAlert("Erreur de Connexion", "Veuillez entrer un nom d'utilisateur avant de continuer.")
        return;
    }

    if (username.length > maxUsernameLength) {
        showBlockingAlert("Erreur de Connexion", `Le nom d'utilisateur ne doit pas dépasser ${maxUsernameLength} caractères.`);
        return; // Exit the function if the username is too long
    }


    if (loginPassword.trim() === "") {
        showBlockingAlert("Erreur de Connexion", "Veuillez entrer un mot de passe valide avant de continuer.")
        return;
    }

    if (gameState.attempt >= 1 && loginPassword !== gameState.password) {
        gameState.username = username;
        const result = await scorePassword(loginPassword, false);
        gameState.score = result.score;
        gameState.goodreasons = result.goodreasons;
        gameState.badreasons = result.badreasons;
        alert("L'authentification a échoué, vous avez utilisé les deux tentatives !");
        showScorePage();
        return;
    }

    if (loginPassword === gameState.password) {
        gameState.username = username;
        const result = await scorePassword(loginPassword, true);
        gameState.score = result.score;
        gameState.goodreasons = result.goodreasons;
        gameState.badreasons = result.badreasons;
        gameState.passwordBreached = result.passwordBreached;
        showScorePage();
    } else {
        gameState.attempt++;
        alert('Mot de passe incorrect. Réessayez !');
    }
}

async function scorePassword(password, rememberedPassword) {
    let score = 0;
    const goodreasons = [];  // Array to hold reasons for the score
    const badreasons = [];  // Array to hold reasons for the score
    let passwordBreached = false;

    // Length check (the longer the better)
    if (password.length >= 12) {
        score += 20 * password.length;  // Multiply by length to differentiate more
        goodreasons.push('La longueur du mot de passe est suffisante (≥ 12 caractères).');
    } else {
        badreasons.push('La longueur du mot de passe est insuffisante (< 12 caractères).');
    }

    if (password.length >= 16) {
        score += 30;  // Bonus for extra length
        goodreasons.push('Bonus pour la longueur supplémentaire (≥ 16 caractères).');
    }

    // Check for uppercase, lowercase, numbers, and special characters
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>-_ ]/.test(password);

    if (hasUpperCase) {
        score += 15 * (Math.random() + 1);
        goodreasons.push('Contient des lettres majuscules.');
    } else {
        badreasons.push('Absence de lettres majuscules.');
    }

    if (hasLowerCase) {
        score += 15 * (Math.random() + 1);
        goodreasons.push('Contient des lettres minuscules.');
    } else {
        badreasons.push('Absence de lettres minuscules.');
    }

    if (hasNumbers) {
        score += 15 * (Math.random() + 1);
        goodreasons.push('Contient des chiffres.');
    } else {
        badreasons.push('Absence de chiffres.');
    }

    if (hasSpecialChars) {
        score += 15 * (Math.random() + 1);
        goodreasons.push('Contient des caractères spéciaux.');
    } else {
        badreasons.push('Absence de caractères spéciaux.');
    }

    // Penalize for common patterns or repetition
    const patterns = /(.)\1\1/;  // Same character repeated 3+ times
    if (!patterns.test(password)) {
        score += 10;  // No repeating characters
        goodreasons.push('Pas de caractères répétés.');
    } else {
        score -= 10;  // Penalize if patterns exist
        badreasons.push('Contient des caractères répétés.');
    }

    // Check entropy (variation in character types)
    const uniqueChars = new Set(password).size;

    // Check the number of unique characters and adjust the score and reasons accordingly
    if (uniqueChars >= 10) {
        score += 15 * uniqueChars; // Higher unique characters = higher score
        goodreasons.push(`Caractères uniques: ${uniqueChars}. Grande variété !`);
    } else {
        score += 5 * uniqueChars; // Lower score for fewer unique characters
        badreasons.push(`Caractères uniques: ${uniqueChars}. Essayez d'utiliser plus de caractères différents.`);
    }

    // Check if the password has been breached
    const breachPenalty = await checkBreach(password);
    if (breachPenalty) {
        score = Math.min(score, 50); // Deduct a significant penalty for breached passwords
        badreasons.push('Le mot de passe a été compromis et n\'est pas sûr.');
        passwordBreached = true;
    }
    else {
        goodreasons.push('Le mot de passe n\'a pas été compromis et est sûr.');
    }

    // Emphasize memory factor
    if (rememberedPassword) {
        score += 10;
        goodreasons.push('L\'utilisateur se souvient du mot de passe.');
    } else {
        score = Math.min(score, 100);  // Large penalty if they won't remember
        badreasons.push('L\'utilisateur ne se souvient pas du mot de passe, ce qui entraîne une pénalité.');
    }

    // Round score
    score = Math.ceil(score)

    // Return a JSON object with score and reasons
    return {
        score: score,
        goodreasons: goodreasons,
        badreasons: badreasons,
        passwordBreached: passwordBreached
    };
}

async function checkBreach(password) {
    // Hash the password using SHA-1
    const hash = CryptoJS.SHA1(password).toString();

    // Extract prefix and postfix
    const prefix = hash.substring(0, 5);
    const postfix = hash.substring(5);

    // Send the prefix to a URL with a CORS proxy
    const url = '/api/breach/' + prefix; // Replace with your URL
    let response;

    try {
        response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Network response was not ok.');

        const responseText = await response.text();

        // Check if the postfix exists in the response list
        const list = responseText
            .trim() // Remove any leading or trailing whitespace
            .split('\r\n') // Split the string into lines
            .map(line => line.split(':')[0]); // Extract the first part of each line

        const postfixExists = list.includes(postfix.toUpperCase());


        return postfixExists;

    } catch (error) {
        console.error('Error:', error);
    }
}

// Phase 5: Score Page
function showScorePage() {
    document.getElementById('game-container').innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 class="text-4xl font-bold mb-4">Votre Score : ${gameState.score}</h1>
            <h2 class="text-xl font-semibold mb-2">Analyse de votre mot de passe :</h2>
            <ul class="list-disc list-inside mb-4">
                ${gameState.goodreasons.map(goodreasons => `<li class="text-green-600 text-xl text-base/loose">${goodreasons}</li>`).join('')}

                ${gameState.badreasons.map(badreasons => `<li class="text-red-600 text-xl text-base/loose font-bold">${badreasons}</li>`).join('')}
            </ul>
            <button onclick="finishGame()" class="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition">
                Terminer le défi
            </button>
        </div>
    `;

    if (gameState.passwordBreached) {
        showBreachPasswordMessage();
    }

    // Send score to API
    fetch('/api/board/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: gameState.username,
            score: gameState.score,
        }),
    });
}

function showBreachPasswordMessage() {
    document.body.innerHTML += `
    <div id="breach" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="rounded-lg bg-white p-8 shadow-2xl max-w-2xl w-full">
            <h2 class="text-lg font-bold">Attention ! Votre mot de passe a été compromis</h2>

            <p class="mt-2 text-sm text-gray-500">
                Il a été signalé que votre mot de passe a été exposé lors d'une violation de données. 
                Utiliser un mot de passe compromis peut entraîner un accès non autorisé à votre compte et à vos informations personnelles.
            </p>

            <p class="mt-2 text-sm text-gray-500">
                Nous vous recommandons de ne pas utiliser ce mot de passe et d'utiliser un mot de passe unique et complexe pour chaque compte.
            </p>

            <div class="mt-4 flex gap-2">
                <button type="button" class="rounded bg-red-50 px-4 py-2 text-sm font-medium text-red-600" onclick="closeBreachPasswordMessage()">
                    D'accord
                </button>
            </div>
        </div>
    </div>
`;
}

function closeBreachPasswordMessage() {
    const popup = document.getElementById("breach");
    if (popup) {
        popup.remove();
    }
}

function finishGame() {
    gameState = { username: '', password: '', badreasons: '', goodreasons: '', score: 0, attempt: 0 };
    showSplashPage();
}

// Initialize the game
showSplashPage();
