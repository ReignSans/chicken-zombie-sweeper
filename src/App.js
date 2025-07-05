import React, { useState } from 'react';
import './App.css';
import chickenImage from './assets/chicken.jpg';
import zombieImage from './assets/zombie.jpg';

const chicken_image = chickenImage;
const zombie_image = zombieImage;

function shuffle(array) {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function boardGenerate() {
    // 18 chickens, 18 zombies, shuffled
    const chickens = Array(18).fill({ type: 'chicken', img: chicken_image });
    const zombies = Array(18).fill({ type: 'zombie', img: zombie_image });
    return shuffle([...chickens, ...zombies]);
}

function App() {
    const [userChoice, setUserChoice] = useState(null); // 'chicken' or 'zombie'
    const [images, setImages] = useState([]);
    const [revealed, setRevealed] = useState(Array(36).fill(false));
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [foundCount, setFoundCount] = useState(0);
    const [chickenScore, setChickenScore] = useState(0);
    const [zombieScore, setZombieScore] = useState(0);

    function handleUserChoice(choice) {
        setUserChoice(choice);
        setImages(boardGenerate());
        setRevealed(Array(36).fill(false));
        setGameOver(false);
        setWin(false);
        setFoundCount(0);
    }

    function handleTileClick(idx) {
        if (gameOver || revealed[idx]) return;
        const updatedRevealed = [...revealed];
        updatedRevealed[idx] = true;
        setRevealed(updatedRevealed);

        if (images[idx].type === userChoice) {
            const newCount = foundCount + 1;
            setFoundCount(newCount);
            if (newCount === 18) {
                setGameOver(true);
                setWin(true);
                if (userChoice === 'chicken') {
                    setChickenScore(score => score + 1);
                } else {
                    setZombieScore(score => score + 1);
                }
            }
        } else {
            setGameOver(true);
            setWin(false);
            // Opponent scores when player loses
            if (userChoice === 'chicken') {
                setZombieScore(score => score + 1);
            } else {
                setChickenScore(score => score + 1);
            }
        }
    }

    function handleRestart() {
        setUserChoice(null);
        setImages([]);
        setRevealed(Array(36).fill(false));
        setGameOver(false);
        setWin(false);
        setFoundCount(0);
    }

    return (
        <div className="container">
            <h1>
                <span className="chicken-header">Chicken </span>
                <span className="zombie-header">Jockey (Chicken vs. Zombie) Game</span>
            </h1>
            <div style={{ marginBottom: 20 }}>
                <span style={{ marginRight: 30 }}>
                    <img src={chicken_image} alt="Chicken" style={{ width: 30, height: 30, verticalAlign: 'middle' }} /> 
                    <b>Chicken Score:</b> {chickenScore}
                </span>
                <span>
                    <img src={zombie_image} alt="Zombie" style={{ width: 30, height: 30, verticalAlign: 'middle' }} /> 
                    <b>Zombie Score:</b> {zombieScore}
                </span>
            </div>
            {!userChoice ? (
                <>
                    <p>Choose your side:</p>
                    <button className='button' onClick={() => handleUserChoice('chicken')}>
                        <img src={chicken_image} alt="Chicken" style={{ width: 30, height: 30 }} /> Chicken
                    </button>
                    <button className='button' onClick={() => handleUserChoice('zombie')}>
                        <img src={zombie_image} alt="Zombie" style={{ width: 30, height: 30 }} /> Zombie
                    </button>
                </>
            ) : (
                <>
                    <p>
                        You chose: <b>{userChoice.charAt(0).toUpperCase() + userChoice.slice(1)}</b>
                        <br />
                        {gameOver ? (
                            win ? <span className='winner'>You win! All {userChoice}s found!</span>
                                : <span className='loser'>You lose! You clicked a {userChoice === 'chicken' ? 'Zombie' : 'Chicken'}!</span>
                        ) : (
                            <>Your {userChoice}s found: <b>{foundCount}/18</b></>
                        )}
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
                    <button className='button' onClick={handleRestart}>Restart Game</button>
                </>
            )}
        </div>
    );
}

export default App;
