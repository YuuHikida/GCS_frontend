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

            const data = await response.json();
            
            if (!data.success && data.error === "レポジトリがありません。最低1つでもレポジトリを作成して当サイトを利用してください") {
                return { error: true, message: data.error };
            }

            setGitHubData(data);
            const currentTime = new Date();
            setLastFetchTime(currentTime);
            sessionStorage.setItem('githubData', JSON.stringify(data));
            sessionStorage.setItem('lastFetchTime', currentTime.toISOString());
            return { error: false, data };
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
            return { error: true, message: error.message };
        }
    };

    return (
        <GitHubDataContext.Provider value={{ githubData, fetchGitHubData, lastFetchTime }}>
            {children}
        </GitHubDataContext.Provider>
    );
};