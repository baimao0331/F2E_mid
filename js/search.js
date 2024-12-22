// 解析 URL 參數
const urlParams = new URLSearchParams(window.location.search);
const searchType = urlParams.get('type'); // "title" 或 "artist"
const query = normalizeString(urlParams.get('query') || ''); // 使用 normalizeString 處理用戶輸入

const header = document.getElementById('result-header');
const result = document.getElementById('search-results');
const title_btn = document.getElementById('title-btn');
const artist_btn = document.getElementById('artist-btn');

let searchResults_title = [];
let searchResults_artist = [];
let searchResults = [];

if(query != ""){
    header.classList.add("active");
    result.classList.add("active");
}

function normalizeString(str) {
    return katakanaToHiragana(str)
        .toLowerCase()
        .replace(/\s+/g, '') // 移除所有空白字符
        .replace(/[^\p{L}\p{N}]/gu, ''); // 移除所有非字母和數字的字符
}

function katakanaToHiragana(str) {
    return str.replace(/[\u30a1-\u30f6]/g, function (match) {
        return String.fromCharCode(match.charCodeAt(0) - 0x60);
    });
}

// 加載 JSON 數據並篩選結果
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        searchResults_title = data.filter(song => normalizeString(song.title).includes(query));
        searchResults_artist = data.filter(song => normalizeString(song.artist).includes(query));
        // 初始化顯示結果
        searchResults_title.sort((a, b) => b.ViewsGrow - a.ViewsGrow);
        searchResults_artist.sort((a, b) => b.ViewsGrow - a.ViewsGrow);
        if(searchResults_title.length > searchResults_artist.length || searchResults_title.length===1){
            title_btn.classList.add("active");
            searchResults = searchResults_title;
        }else if(searchResults_title.length < searchResults_artist.length || searchResults_artist.length===1){
            artist_btn.classList.add("active");
            searchResults = searchResults_artist;
        }
        artist_btn.innerHTML = `藝人名匹配結果 (${searchResults_artist.length})`;
        title_btn.innerHTML = `歌名匹配結果 (${searchResults_title.length})`;
        displayResults(searchResults);
    })
    .catch(error => console.error('無法載入 JSON:', error));

// 根據排序選項顯示結果
document.getElementById('sort-order').addEventListener('change', function () {
    const sortOrder = this.value;
    sortResult(searchResults, sortOrder);
});

function sortResult(results, sortorder){
    if (sortorder === 'newest') {
        // 按發行日期從新到舊排序
        results.sort((a, b) => new Date(b.release) - new Date(a.release));
    } else if (sortorder === 'oldest') {
        // 按發行日期從舊到新排序
        results.sort((a, b) => new Date(a.release) - new Date(b.release));
    } else if (sortorder === 'popularity') {
        // 按觀看成長從低到高排序
        results.sort((a, b) => b.ViewsGrow - a.ViewsGrow);
    }
    displayResults(results);
}

// 顯示篩選後的結果
function displayResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // 清空之前的內容
    // 頁面加載時，按人氣（ViewsGrow）從高到低排序
    if (results.length > 0) {
        results.forEach(song => {
            const songElement = document.createElement('div');
            songElement.className = "search-item";
            songElement.innerHTML = `
                                <a href="lyric.html?songId=${song.id}" class="song-img">
                                    <img src="${song.img}" alt="${song.title} 封面圖">
                                </a>
                                <div class="song-info">
                                    <p>${song.album}</p>
                                    <a href="lyric.html?songId=${song.id}" class="song-name"><h2>${song.title}</h2></a>
                                    <a href="search.html?type=song&query=${song.artist}"><p>${song.artist}</p>
                                </div>
                                <a href="lyric.html?songId=${song.id}" class="link-item">看歌詞</a>
                            `;
            resultsContainer.appendChild(songElement);
        });
    } else {
        resultsContainer.innerHTML = `
                        <div id="noresult">
                        <p>沒有找到相關結果&macr;&#92;_(ツ)_/&macr;</p>
                        </div>
                        `;
    }
}


title_btn.addEventListener('click', function () {
    searchResults = searchResults_title;
    displayResults(searchResults);
    title_btn.classList.add("active");
    artist_btn.classList.remove("active");
});
artist_btn.addEventListener('click', function () {
    searchResults = searchResults_artist;
    displayResults(searchResults);
    artist_btn.classList.add("active");
    title_btn.classList.remove("active");
});

