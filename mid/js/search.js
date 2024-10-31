                // 解析 URL 參數
                const urlParams = new URLSearchParams(window.location.search);
                const searchType = urlParams.get('type'); // "title" 或 "artist"
                const query = urlParams.get('query').toLowerCase().trim(); // 忽略大小寫和空白

                let searchResults = [];

                function normalizeString(str) {
                    return katakanaToHiragana(str)      // 將片假名轉換為平假名
                        .toLowerCase()                  // 忽略大小寫
                        .trim()                         // 去除首尾空格
                        .replace(/[^\p{L}\p{N}\s.]/gu, '') // 移除除字母、數字、空白字符和點號外的其他字符
                        .replace(/\./g, ' ');           // 將點號替換為空格
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
                        if (searchType === 'song') {
                            // 搜索歌名，忽略大小寫和空白字符
                            searchResults = data.filter(song => normalizeString(song.title).includes(query));
                        } else if (searchType === 'artist') {
                            // 搜索藝人，忽略大小寫和空白字符
                            searchResults = data.filter(song => normalizeString(song.artist).includes(query));
                        }
                        // 初始化顯示結果
                        displayResults(searchResults);
                    })
                    .catch(error => console.error('無法載入 JSON:', error));

                // 根據排序選項顯示結果
                document.getElementById('sort-order').addEventListener('change', function () {
                    const sortOrder = this.value;
                    if (sortOrder === 'newest') {
                        // 按發行日期從新到舊排序s
                        searchResults.sort((a, b) => new Date(b.release) - new Date(a.release));
                    } else {
                        // 按發行日期從舊到新排序
                        searchResults.sort((a, b) => new Date(a.release) - new Date(b.release));
                    }
                    displayResults(searchResults);
                });

                // 顯示篩選後的結果
                function displayResults(results) {
                    const resultsContainer = document.getElementById('search-results');
                    resultsContainer.innerHTML = ''; // 清空之前的內容

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
                                    <p>${song.artist}</p>
                                </div>
                                <a href="lyric.html?songId=${song.id}" class="link-item">看歌詞</a>
                            `;
                            resultsContainer.appendChild(songElement);
                        });
                    } else {
                        resultsContainer.innerHTML = '沒有找到相關結果';
                    }
                }