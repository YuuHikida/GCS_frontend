import React from 'react';
import './About.css';
import { FaGithub, FaBell, FaCode, FaChartLine } from 'react-icons/fa';

function About() {
    return (
        <div className="about-container">
            {/* ヒーローセクション */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1>GCS（Github Contribute System）とは</h1>
                    <p className="hero-description">
                        継続的な成長をサポートする、あなたの開発習慣づけパートナー
                    </p>
                </div>
            </div>

            {/* メイン説明セクション */}
            <div className="main-section">
                <div className="feature-grid">
                    <div className="feature-card">
                        <FaGithub className="feature-icon" />
                        <h3>Githubと連携</h3>
                        <p>あなたのGithubアカウントと連携し、日々のコントリビューションを自動で追跡します。</p>
                    </div>

                    <div className="feature-card">
                        <FaBell className="feature-icon" />
                        <h3>スマートな通知</h3>
                        <p>設定した時間にコミットがない場合、登録されたメールアドレスに優しくリマインドを送信します。</p>
                    </div>

                    <div className="feature-card">
                        <FaCode className="feature-icon" />
                        <h3>習慣形成をサポート</h3>
                        <p>毎日のコーディング習慣を形成し、プログラミングスキルの継続的な向上を支援します。</p>
                    </div>

                    <div className="feature-card">
                        <FaChartLine className="feature-icon" />
                        <h3>成長の可視化</h3>
                        <p>あなたの継続的な努力を可視化し、モチベーション維持をサポートします。</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default About; 