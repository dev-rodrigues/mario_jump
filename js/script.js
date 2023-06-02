const mario = document.querySelector('.mario');
const luigi = document.querySelector('.luigi');

const pipe = document.querySelector('.pipe');
const grass = document.querySelector('.grass');
const cloud = document.querySelector('.cloud');
const clouds = document.querySelector('.clouds');
const clouds2 = document.querySelector('.clouds-2');
const score = document.getElementById('score');
const gameOver = document.getElementById('game-over');
const looseMessage = document.getElementById('loose');
const btnStartGame = document.getElementById('btn-start-game');
const logoImg = document.getElementById('logo-img');
const gameOverImg = document.getElementById('game-over-img');

const url = "http://localhost:8000/jump";

const jump = () => {
    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);
}

const handleJumpLuigi = () => {
    luigi.classList.add('jump');
    setTimeout(() => {
        luigi.classList.remove('jump');
    }, 500);
}

const loopScore = setInterval(() => {

    score.innerHTML++;

}, 100);

const jumpLuigi = (pipePosition, luigiPosition) => {
    const data = {
        distance: pipePosition - 100,
        velocity: 20,
        height: 6,
        posix: luigiPosition,
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            const output = parseFloat(data.output);
            console.log(output);
            if (output > 0.5) {
                handleJumpLuigi();
            }
        });
}

const marioLoser = (pipePosition, marioPosition, cloudPosition, cloudsPosition, clouds2Position) => {
    gameOverImg.src = './images/game_over.svg';
    btnStartGame.style.visibility = 'visible';

    pipe.style.animation = 'none';
    cloud.style.animation = 'none';
    clouds.style.animation = 'none';
    clouds2.style.animation = 'none';

    pipe.style.left = `${pipePosition}px`;
    mario.style.bottom = `${marioPosition}px`;
    cloud.style.left = `${cloudPosition}px`;
    clouds.style.left = `${cloudsPosition}px`;
    clouds2.style.left = `${clouds2Position}px`;

    mario.src = './images/mario-game-over.png';

    setTimeout(() => {
        mario.classList.add('game-over');
        setInterval(() => {
            mario.style.animation = 'none';
            mario.style.bottom = `-80px`;
        }, 1500);

    }, 500);

    clearInterval(loop);
    clearInterval(loopScore);
}

const luigiLoser = (pipePosition, luigiPosition, cloudPosition, cloudsPosition, clouds2Position) => {
    alert("Você ganhou!")

    pipe.style.animation = 'none';
    cloud.style.animation = 'none';
    clouds.style.animation = 'none';
    clouds2.style.animation = 'none';

    pipe.style.left = `${pipePosition}px`;
    luigi.style.bottom = `${luigiPosition}px`;
    cloud.style.left = `${cloudPosition}px`;
    clouds.style.left = `${cloudsPosition}px`;
    clouds2.style.left = `${clouds2Position}px`;

    clearInterval(loop);
    clearInterval(loopScore);
}

const loop = setInterval(() => {

    const pipePosition = pipe.offsetLeft;
    const cloudPosition = cloud.offsetLeft;
    const cloudsPosition = clouds.offsetLeft;
    const clouds2Position = clouds2.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    const luigiPosition = +window.getComputedStyle(luigi).bottom.replace('px', '');


    jumpLuigi(pipePosition, luigiPosition);

    if (pipePosition <= 85 && pipePosition > 10 && marioPosition < 50) {
        marioLoser(pipePosition, marioPosition, cloudPosition, cloudsPosition, clouds2Position);
    }

    if (pipePosition <= 85 && pipePosition > 10 && luigiPosition < 50) {
        luigiLoser(pipePosition, luigiPosition, cloudPosition, cloudsPosition, clouds2Position);
    }

}, 10);

const startGame = () => {
    btnStartGame.style.display = 'hidden';
    location.reload();
}


document.addEventListener("keydown", function (event) {
    if (event.keyCode === 32) {
        jump()
    }
});