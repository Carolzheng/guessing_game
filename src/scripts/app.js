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
            const song = data[Math.floor(Math.random() * data.length)];
            const lyrics = song.lyric.join(''); // Combine the lyrics into a single string
            let maskedLyrics = lyrics.replace(/[\u4e00-\u9fa5]/g, '■'); // Mask the Chinese characters
            let guessedCharacters = [];
            let wrongGuesses = [];
            let guessCount = 0;

            const displayArea = document.getElementById('display-area');
            const inputField = document.getElementById('guess-input');
            const submitButton = document.getElementById('submit-button');
            const resetButton = document.getElementById('reset-button');
            const guessCounter = document.getElementById('guess-counter');
            const wrongGuessesDisplay = document.getElementById('wrong-guesses');

            function updateDisplay() {
                displayArea.textContent = maskedLyrics.split('').join(' ');
                guessCounter.textContent = `Guesses: ${guessCount}`;
                wrongGuessesDisplay.textContent = `Wrong guesses: ${wrongGuesses.join(', ')}`;
            }

            function checkGuess() {
                const guess = inputField.value;
                inputField.value = '';

                if (guess && !guessedCharacters.includes(guess)) {
                    guessedCharacters.push(guess);
                    guessCount++;
                    let newMaskedLyrics = '';
                    let isCorrectGuess = false;

                    for (let char of lyrics) {
                        if (guessedCharacters.includes(char)) {
                            newMaskedLyrics += char;
                            if (char === guess) {
                                isCorrectGuess = true;
                            }
                        } else if (/[\u4e00-\u9fa5]/.test(char)) {
                            newMaskedLyrics += '■';
                        } else {
                            newMaskedLyrics += char;
                        }
                    }

                    if (!isCorrectGuess) {
                        wrongGuesses.push(guess);
                    }

                    maskedLyrics = newMaskedLyrics;
                    updateDisplay();

                    if (!maskedLyrics.includes('■')) {
                        alert('Congratulations! You guessed the lyrics!');
                    }
                }
            }

            function resetGame() {
                guessedCharacters = [];
                wrongGuesses = [];
                guessCount = 0;
                maskedLyrics = lyrics.replace(/[\u4e00-\u9fa5]/g, '■');
                updateDisplay();
            }

            submitButton.addEventListener('click', checkGuess);
            resetButton.addEventListener('click', resetGame);
            updateDisplay();
        })
        .catch(error => console.error('Error loading lyrics:', error));
});