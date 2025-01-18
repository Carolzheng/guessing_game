// JavaScript logic for the guessing game

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/cleaned_lyrics.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Lyrics data loaded:', data); // Log the loaded data
            setupEventListeners(data);
            startGame(data);
        });

    function setupEventListeners(data) {
        const submitButton = document.getElementById('submit-button');
        const resetButton = document.getElementById('reset-button');
        const showButton = document.getElementById('show-button');
        const titleSubmitButton = document.getElementById('title-submit-button');

        submitButton.addEventListener('click', checkGuess);
        resetButton.addEventListener('click', () => resetGame(data));
        showButton.addEventListener('click', showAllCharacters);
        titleSubmitButton.addEventListener('click', checkTitleGuess);
    }

    let song, lyrics, maskedLyrics, guessedCharacters, wrongGuesses, guessCount;
    const displayArea = document.getElementById('display-area');
    const inputField = document.getElementById('guess-input');
    const titleGuessInput = document.getElementById('title-guess-input');
    const guessCounter = document.getElementById('guess-counter');
    const wrongGuessesDisplay = document.getElementById('wrong-guesses');
    const winMessage = document.getElementById('win-message');

    function startGame(data) {
        song = data[Math.floor(Math.random() * data.length)];
        console.log(`Starting game with song: ${song.name}`); // Print the title name in the console
        lyrics = song.lyric.slice(0, 20).join('\n'); // Limit to the first 30 lines and combine into a single string with new lines
        maskedLyrics = lyrics.replace(/[\u4e00-\u9fa5]/g, '■'); // Mask the Chinese characters
        guessedCharacters = [];
        wrongGuesses = [];
        guessCount = 0;
        winMessage.textContent = ''; // Clear the win message
        updateDisplay();
    }

    function updateDisplay() {
        displayArea.innerHTML = maskedLyrics.split('').join(' ').replace(/ /g, '&nbsp;').replace(/\n/g, '<br>'); // Preserve line breaks and spaces
        guessCounter.textContent = `Guesses: ${guessCount}`;
        wrongGuessesDisplay.textContent = `Wrong guesses: ${wrongGuesses.join(', ')}`;
    }

    function checkGuess() {
        const guess = inputField.value.trim();
        inputField.value = '';

        if (guess && !guessedCharacters.includes(guess)) {
            guessCount++;
            if (lyrics.includes(guess)) {
                guessedCharacters.push(guess);
                maskedLyrics = revealCharacters(lyrics, maskedLyrics, guess);
            } else {
                wrongGuesses.push(guess);
            }
            updateDisplay();
        }
    }

    function revealCharacters(lyrics, maskedLyrics, guess) {
        let newMaskedLyrics = '';
        for (let i = 0; i < lyrics.length; i++) {
            if (lyrics[i] === guess) {
                newMaskedLyrics += guess;
            } else {
                newMaskedLyrics += maskedLyrics[i];
            }
        }
        return newMaskedLyrics;
    }

    function showAllCharacters() {
        maskedLyrics = lyrics; // Reveal all characters
        winMessage.textContent = `The song title is: ${song.name}`; // Show the song title
        updateDisplay();
    }

    function checkTitleGuess() {
        const titleGuess = titleGuessInput.value.trim();
        if (titleGuess === song.name) {
            winMessage.textContent = 'Congratulations! You guessed the correct song title!';
        } else {
            winMessage.textContent = 'Sorry, that is not correct. Try again!';
        }
    }

    function resetGame(data) {
        startGame(data);
    }
});