// 解析 URL 參數以獲取歌曲 ID
const urlParams = new URLSearchParams(window.location.search);
const songId = parseInt(urlParams.get('songId'));
let sync = false;
let player;
let song;
if (songId == 92) {
    window.location.href = 'storm.html';
}

// 根據 ID 載入歌曲資料
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        song = data.find(s => s.id === songId);
        if (song) {
            document.getElementById('release-date').textContent = song.release;
            document.getElementById('album').textContent = song.album;
            document.getElementById('song-title').textContent = song.title;
            document.getElementById('song-artist').textContent = song.artist;
            document.getElementById('song-img').src = song.img;

            const lyricContainer = document.getElementById('lyric-container');
            const japaneseLyrics = song.lyrics.japanese;
            const chineseLyrics = song.lyrics.chinese;
            const lyricTimes = song.lyrics.time; // 獲取歌詞時間戳

            lyricContainer.innerHTML = '';

            for (let i = 0; i < japaneseLyrics.length; i++) {
                const japaneseLine = japaneseLyrics[i];
                const chineseLine = chineseLyrics[i];
                let lyricTime;

                const lyricLine = document.createElement('div');
                lyricLine.classList.add('lyric-line');
                lyricLine.id = `lyric-${i}`;
                if (lyricTimes != null) {
                    sync = true;
                    lyricTime = song.lyrics.time[i]; // 獲取當前行的時間戳
                    lyricLine.dataset.time = lyricTime; // 將單一的時間戳分配到 data-time
                }

                if (i === 0) {
                    lyricLine.classList.add('first-line');
                }
                if (i === japaneseLyrics.length - 1) {
                    lyricLine.classList.add('last-line');
                }
                const rubyParsedLine = japaneseLine.replace(/{(.*?)\|(.*?)}/g, '<ruby>$1<rt>$2</rt></ruby>');

                lyricLine.innerHTML = `
                    <p>${rubyParsedLine}</p>
                    <p>${chineseLine}</p>
                `;
                lyricContainer.appendChild(lyricLine);
            }
            console.log("使用 IFrame API 創建 YouTube 播放器");
            // 使用 IFrame API 創建 YouTube 播放器
            player = new YT.Player('video-container', {
                videoId: song.ytid, // 使用 JSON 中的 youtubeId
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
            // 顯示同一位藝術家的隨機五首歌曲
            displayRelatedSongs(song.artist, data);
        } else {
            console.error('找不到歌曲');
            lyricContainer.innerHTML = '<p>找不到該歌曲</p>';
        }
    })
    .catch(error => {
        console.error('無法載入 JSON:', error)
    });

// 顯示同一位藝術家的隨機五首歌曲
function displayRelatedSongs(artist, data) {
    const relatedSongsContainer = document.getElementById('related-songs-container');
    relatedSongsContainer.innerHTML = '';

    // 篩選出同一位歌手的歌曲，排除當前歌曲
    let relatedSongs = data.filter(song => song.artist === artist && song.id !== songId);

    // 如果相關歌曲不足五首，顯示所有可用的歌曲
    if (relatedSongs.length === 0) {
        relatedSongsContainer.innerHTML = '<p>尚沒有更多該歌手的歌曲。</p>';
        return;
    }

    // 隨機打亂歌曲陣列順序
    relatedSongs = shuffleArray(relatedSongs);

    const songsToDisplay = relatedSongs.slice(0, 9);

    songsToDisplay.forEach(song => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <a href="lyric.html?songId=${song.id}">
                <img src="${song.img}" alt="${song.title} 封面圖">
                <div class="card-info">
                    <h4>${song.title}</h4>
                </div>
            </a>
        `;
        relatedSongsContainer.appendChild(card);
    });
}

// 隨機打亂陣列的函數
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // ES6 解構賦值交換
    }
    return array;
}

function onPlayerReady(event) {
    // 可以在這裡控制播放器，比如自動播放
    // event.target.playVideo();
    console.log('YouTube IFrame API 已載入完成');
    if (sync) {
        setInterval(updateLyrics, 500); // 每 500ms 更新一次歌詞
    }
}

let playing = false;

function onPlayerStateChange(event) {
    const lyricLines = document.querySelectorAll('.lyric-line'); // 在函數內重新選擇元素
    if (event.data === YT.PlayerState.PAUSED) {
        playing = false;
        lyricLines.forEach(line => line.classList.remove('highlight')); // 移除所有高亮
    } else if (event.data === YT.PlayerState.PLAYING) {
        // 繼續執行歌詞同步
        playing = true;
        updateLyrics();
    }
}

// 更新歌詞滾動同步
function updateLyrics() {
    console.log("執行歌詞同步");
    const currentTime = Math.floor(player.getCurrentTime()); // 獲取當前播放時間
    const lyricLines = document.querySelectorAll('.lyric-line');
    const scrollBox = document.getElementById('scroll-box'); // 獲取右側的歌詞滾動區塊
    const currentLyrics = document.getElementById('dynamic-lyric-box'); // 新的歌詞顯示區塊
    console.log(currentTime);
    // 找到對應的歌詞行
    currentIndex = Array.from(lyricLines).findIndex((line, i) => {
        const time = parseFloat(line.dataset.time);
        const nextTime = parseFloat(lyricLines[i + 1]?.dataset.time || Infinity); // 使用 i 找到下一行時間
        return currentTime >= time && currentTime < nextTime;
    });

    console.log("當前高亮索引:", currentIndex);
    // 如果找到對應的歌詞行，滾動並高亮
    if (currentIndex !== -1 && playing === true) {
        lyricLines.forEach((line, index) => {
            // 高亮當前歌詞行，移除其他行的高亮
            if (index === currentIndex) {
                line.classList.add('highlight');
            } else {
                line.classList.remove('highlight');
            }
        });

        const currentLine = document.getElementById(`lyric-${currentIndex}`);
        // 如果找到對應的歌詞行，滾動並高亮
        if (currentIndex !== -1) {
            lyricLines.forEach((line, index) => {
                line.classList.toggle('highlight', index === currentIndex);
            });

            const currentLine = document.getElementById(`lyric-${currentIndex}`);
            // 僅滾動 scroll-box 中的歌詞行
            scrollBox.scrollTo({
                top: currentLine.offsetTop - scrollBox.offsetHeight / 2, // 滾動到中心位置
                behavior: 'smooth', // 平滑滾動
            });
            if (sync) {
                // 更新新的歌詞區塊
                const japaneseText = song.lyrics.japanese[currentIndex] || '';
                const chineseText = song.lyrics.chinese[currentIndex] || '';
                currentLyrics.innerHTML = `
                    <p>${japaneseText}</p>
                    <p>${chineseText}</p>
                `;
            }else{
                currentLyricsBox.innerHTML = "這歌的歌詞尚未同步";
            }
        }
    }
}

function checkPlayerState() {

}
