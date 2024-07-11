import React from 'react';
import GitHubContributions from './GitHubContributions'; // Adjusted import path
import './App.css';

const App = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>GitHub Contributions Visualization</h1>
                <GitHubContributions username="torvalds" />
            </header>
        </div>
    );
};

export default App;
