import React, { useState } from 'react';
import './App.css';
import chickenImage from './assets/chicken.jpg';
import zombieImage from './assets/zombie.jpg';


const chicken_image = chickenImage;
const zombie_image = zombieImage;

function boardGenerate() {
    const images = Array(18).fill({ type: 'chicken', img: chicken_image })
        .concat(Array(18).fill({ type: 'zombie', img: zombie_image }));

    for (let i = images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [images[i], images[j]] = [images[j], images[i]];
    }
    return images;
}

function App() {
    const [images, setImages] = useState(boardGenerate());
    const [revealed, setRevealed] = useState(Array(36).fill(false));
    const [player, setPlayer] = useState('chicken');
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState('');
    const [scores, setScores] = useState({ chicken: 0, zombie: 0 });

    const chickenLeft = images.filter((tile, i) => tile.type === 'chicken' && !revealed[i]).length;
    const zombieLeft = images.filter((tile, i) => tile.type === 'zombie' && !revealed[i]).length;

    function handleTileClick(click) {
        if (gameOver || revealed[click]) return;

        if (images[click].type === player) {
            const updatedRevealed = [...revealed];
            updatedRevealed[click] = true;
            setRevealed(updatedRevealed);

            if (player === 'chicken' && chickenLeft === 1) {
                setGameOver(true);
                setWinner('Chicken Player');
                setScores(prev => ({ ...prev, chicken: prev.chicken + 1 }));
            } else if (player === 'zombie' && zombieLeft === 1) {
                setGameOver(true);
                setWinner('Zombie Player');
                setScores(prev => ({ ...prev, zombie: prev.zombie + 1 }));
            } else {
                setPlayer(player === 'chicken' ? 'zombie' : 'chicken');
            }
        } else {
            setGameOver(true);

            const winPlayer = player === 'chicken' ? 'Zombie Player' : 'Chicken Player';
            setWinner(winPlayer);
            setScores(prev =>
                player === 'chicken'
                ? { ...prev, zombie: prev.zombie + 1 }
                : { ...prev, chicken: prev.chicken + 1 }
            );
        }
    }

    function handleRestart() {
        setImages(boardGenerate());
        setRevealed(Array(36).fill(false));
        setGameOver(false);
        setWinner('');
        setPlayer('chicken');
    }

    return (
        <div className="container">
            <h1>
                <span className="chicken-header">Chicken </span>
                <span className="zombie-header">Jockey (Chicken vs. Zombie) Game</span>
            </h1>
            <div>
                <b>Score:</b> 
                <span> Chicken: {scores.chicken}</span>
                <span> |</span>
                <span> Zombie: {scores.zombie}</span>
            </div>
        <p>
            Two players: <b>Chicken</b> and <b>Banana</b>.<br />
            {gameOver
            ? <span className='winner'>{winner} wins!</span>
            : <>Current turn: <b>{player.charAt(0).toUpperCase() + player.slice(1)} Player</b></>
            }
        </p>
        <div className='grid'>
            {images.map((tile, idx) => (
            <button
                key={idx}
                className="square"
                style={{
                    width: 60,
                    height: 60,
                    background: revealed[idx] ? '#f0f0f0' : '#ddd',
                    border: '2px solid #000000',
                    cursor: gameOver || revealed[idx] ? 'not-allowed' : 'pointer',
                    padding: 0,
                }}
                onClick={() => handleTileClick(idx)}
                disabled={gameOver || revealed[idx]}
            >
                {revealed[idx] ? (
                <img src={tile.img} alt={tile.type} style={{ width: '90%', height: '90%' }} />
                ) : (
                <span style={{ fontSize: 18 }}>{idx + 1}</span>
                )}
            </button>
            ))}
        </div>
        <button className = 'restart' onClick={handleRestart}>Restart Game</button>
        </div>
    );
}

export default App;