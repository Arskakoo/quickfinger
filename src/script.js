document.addEventListener('DOMContentLoaded', function () {
    // Select all keys with the class 'key'
    const keys = document.querySelectorAll('.key');
    let currentRedKey;
    let gameStartTime;
    let gameTimer;
    let redKeyDuration = 0;
    let score = 0;
    let regularKeyPressCount = 0;

    // Function to get a random key and apply styles based on whether
    function getRandomKey() {
        const randomIndex = Math.floor(Math.random() * keys.length);
        const key = keys[randomIndex];
            key.style.backgroundColor = '#FF6961';
            key.dataset.isGolden = false;
        return key;
    }

    // Function to format time in minutes:seconds.milliseconds format
    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const remainingMilliseconds = milliseconds % 100;

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(remainingMilliseconds).padStart(2, '0')}`;
    }

    let initialDelay = 200; // Set the initial delay for red key appearance

    // Function to handle the fading of the red key
    function fadeRedKey() {
        if (currentRedKey) {
            currentRedKey.style.backgroundColor = '';
            currentRedKey.style.color = ''; // Reset text color
        }
    
        setTimeout(() => {
            currentRedKey = getRandomKey();
            currentRedKey.style.backgroundColor = '#000000';
            currentRedKey.style.color = '#FFFFFF'; // Set text color to white
            redKeyDuration = 0;
    
            // Reduce the delay for the next red key appearance
            initialDelay *= 0.95; // You can adjust the multiplier for the desired speed increase
        }, initialDelay);
    }
    

    // Function to display a game over alert
    function showGameOverAlert(startTime) {
        const endTime = new Date().getTime();
        const gameTime = endTime - startTime;
        const formattedTime = formatTime(gameTime);
        const message = `Game is over. Duration: ${formattedTime}. Score: ${score}`;
        alert(message);

        // Save the score to localStorage
        const highScores = JSON.parse(localStorage.getItem('fastfingerhighScores')) || [];
        highScores.push(score);
        highScores.sort((a, b) => b - a); // Sort scores in descending order
        localStorage.setItem('fastfingerhighScores', JSON.stringify(highScores));

        // Display the top 5 scores
        displayTopScores();

        // Refresh the page when the alert is clicked
        window.location.reload();
    }

    // Function to update the elapsed time on the page
    function updateElapsedTime() {
        if (gameStartTime) {
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - gameStartTime;
            const formattedElapsedTime = formatTime(elapsedTime);
            document.getElementById('elapsedTime').innerText = `${formattedElapsedTime} `;
        }
    }

    // Function to check if the game has ended
    function checkGameEnd() {
        updateElapsedTime();

        if (redKeyDuration >= 1400) {
            clearInterval(gameTimer);
            showGameOverAlert(gameStartTime);
        }
    }
    

    // Function to display the top 5 scores on the page
    function displayTopScores() {
        const topScoresElement = document.getElementById('topScores');
        topScoresElement.innerHTML = '<h2>Top 5 points</h2>';

        const fastfingerhighScores = JSON.parse(localStorage.getItem('fastfingerhighScores')) || [];
        const topScores = fastfingerhighScores.slice(0, 5);

        if (topScores.length > 0) {
            const ul = document.createElement('ul');
            topScores.forEach((score, index) => {
                const li = document.createElement('li');
                li.textContent = `${index + 1}. ${score} points`;
                ul.appendChild(li);
            });
            topScoresElement.appendChild(ul);
        } else {
            topScoresElement.innerHTML += '<p>Play the game to get points!</p>';
        }
    }


    // Event listener for keydown events
    document.addEventListener('keydown', function (event) {
        const pressedKey = event.key.toLowerCase();

        // Start the game if it hasn't started yet
        if (!gameStartTime) {
            currentRedKey = getRandomKey();
            fadeRedKey();
            gameStartTime = new Date().getTime();
            gameTimer = setInterval(() => {
                redKeyDuration += 10;
                checkGameEnd();
            }, 10);

            regularKeyPressCount = 0; // Reset regularKeyPressCount when the game starts
        }

        // Handle the pressed key
        if (pressedKey === currentRedKey.dataset.key) {
            const points = currentRedKey.dataset.isGolden ? 200 : 150; // Adjust points for the golden key
            fadeRedKey();
            score += points;
            document.getElementById('score').innerText = `Points: ${score} `;
            regularKeyPressCount++; // Increment regularKeyPressCount on each regular key press
        }
    });

    // Display the top 5 scores when the page loads
    displayTopScores();
});
