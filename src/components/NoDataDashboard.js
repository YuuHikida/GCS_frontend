import React from 'react';
import './NoDataDashboard.css';

function NoDataDashboard() {
    return (
        <div className="no-data-container">
            <h1>データが見つかりません</h1>
            <div className="error-message">
                <p>レポジトリがありません。</p>
                <p>最低1つでもレポジトリを作成して当サイトを利用してください。</p>
            </div>
            <a 
                href="https://github.com/new" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="create-repo-button"
            >
                GitHubでレポジトリを作成する
            </a>
        </div>
    );
}

export default NoDataDashboard; 