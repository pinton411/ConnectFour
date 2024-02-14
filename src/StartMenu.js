import React, { useState } from 'react';
import './App.css';

function StartMenu({ onStart }) {
    const [rows, setRows] = useState(6);
    const [cols, setCols] = useState(7);
    const [step, setStep] = useState(1);
    const [opponent, setOpponent] = useState('');
    const [playerColor, setPlayerColor] = useState('');
    const [opponentColor, setOpponentColor] = useState('');
    const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];

    const handleSelectOpponent = (type) => {
        setOpponent(type);
        setStep(4);
    };

    const handleSelectPlayerColor = (color) => {
        setPlayerColor(color);
        if (opponent === 'computer') {
            const remainingColors = colors.filter(c => c !== color);
            const randomColorIndex = Math.floor(Math.random() * remainingColors.length);
            setOpponentColor(remainingColors[randomColorIndex]);
            setStep(5);
        } else {
            setStep(4);
        }
    };

    const handleSelectOpponentColor = (color) => {
        setOpponentColor(color);
        setStep(5);
    };

    const handleSubmit = () => {
        onStart(rows, cols, opponent, playerColor, opponentColor);
    };

    switch (step) {
        case 1:
            return (
                <div>
                    <h1>Welcome to Connect Four!</h1>
                    <p>
                        Connect Four is a two-player connection game in which the players first choose a color and then take turns dropping colored discs from the top into a seven-column, six-row vertically suspended grid. The pieces fall straight down, occupying the next available space within the column. The objective of the game is to be the first to form a horizontal, vertical, or diagonal line of four of one's own discs. Connect Four is a solved game. The first player can always win by playing the right moves.
                    </p>
                    <button onClick={() => setStep(2)}>Next</button>
                </div>
            );
        case 2:
            return (
                <div>
                    <p>Choose a board size:</p>
                    <p>Classic board</p>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <button
                            type="button"
                            onClick={() => {
                                setRows(6);
                                setCols(7);
                                setStep(3);
                            }}
                            style={{ marginTop: '10px' }}>
                            Use Classic Board (6x7)
                        </button>
                        <p>Custom board</p>
                        <div className="custom-option">
                            <label htmlFor="rows">Rows:</label>
                            <select value={rows} onChange={(e) => setRows(+e.target.value)}>
                                {[...Array(7).keys()].map(n => (
                                    <option key={n + 6} value={n + 6}>{n + 6}</option>
                                ))}
                            </select>
                        </div>
                        <div className="custom-option">
                            <label htmlFor="cols">Columns:</label>
                            <select value={cols} onChange={(e) => setCols(+e.target.value)}>
                                {[...Array(7).keys()].map(n => (
                                    <option key={n + 7} value={n + 7}>{n + 7}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={() => setStep(3)}>Next</button>
                    </form>
                </div>
            );
        case 3:
            return (
                <div>
                    <p>Choose your opponent:</p>
                    <button onClick={() => handleSelectOpponent('player')}>Another Player</button>
                    <br/>
                    <button onClick={() => handleSelectOpponent('computer')}>Computer</button>
                </div>
            );
        case 4:
            const selectingFor = playerColor ? 'Player 2' : 'Player 1';
            const availableColors = playerColor ? colors.filter(c => c !== playerColor) : colors;
            return (
                <div>
                    <p>{`${selectingFor}, choose your token color:`}</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {availableColors.map((color) => (
                            <div key={color} className="color-square" onClick={() => playerColor ? handleSelectOpponentColor(color) : handleSelectPlayerColor(color)} style={{ backgroundColor: color.toLowerCase() }}></div>
                        ))}
                    </div>
                </div>
            );
        case 5:
            return (
                <div>
                    <p>Board size: {rows} rows by {cols} columns</p>
                    <p>Opponent: {opponent === 'player' ? 'Human' : 'Computer'}</p>
                    <p>Your color: {playerColor}</p>
                    <p>Opponent's color: {opponentColor}</p>
                    <button onClick={handleSubmit}>Start Game</button>
                </div>
            );
        default:
            return setStep(1);
    }
}

export default StartMenu;
