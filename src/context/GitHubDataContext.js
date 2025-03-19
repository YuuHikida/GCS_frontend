// src/context/GitHubDataContext.js
import React, { createContext, useState } from 'react';

export const GitHubDataContext = createContext();

export const GitHubDataProvider = ({ children }) => {
    const [githubData, setGitHubData] = useState(() => {
        const savedData = sessionStorage.getItem('githubData');
        return savedData ? JSON.parse(savedData) : null;
    });

    const [lastFetchTime, setLastFetchTime] = useState(() => {
        const savedTime = sessionStorage.getItem('lastFetchTime');
        return savedTime ? new Date(savedTime) : null;
    });

    const fetchGitHubData = async (user, convertDay) => {
        try {
            const idToken = await user.getIdToken();
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/github/userDate?clientTimeStamp=${encodeURIComponent(convertDay)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setGitHubData(data);
            const currentTime = new Date();
            setLastFetchTime(currentTime);
            sessionStorage.setItem('githubData', JSON.stringify(data));
            sessionStorage.setItem('lastFetchTime', currentTime.toISOString());
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
        }
    };

    return (
        <GitHubDataContext.Provider value={{ githubData, fetchGitHubData, lastFetchTime }}>
            {children}
        </GitHubDataContext.Provider>
    );
};