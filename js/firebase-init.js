// firebase-init.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';


// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyBZuylEBuTmQbprt-t087etIgtIhPESqgc",
  authDomain: "yoisei-4d2dd.firebaseapp.com",
  databaseURL: "https://yoisei-4d2dd-default-rtdb.firebaseio.com",
  projectId: "yoisei-4d2dd",
  storageBucket: "yoisei-4d2dd.firebasestorage.app",
  messagingSenderId: "765961474782",
  appId: "1:765961474782:web:bc5390344f542f59fda84f"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

console.log("Firebase 初始化成功", app);;

// 更新選單的函數
async function updateMenu(user) {
  const acmenu = document.getElementById('account_option');
  const hamberger = document.getElementById('hamberger-link');
  const ham_ac = document.getElementById('account-option');

  // 如果頁面中沒有選單，則跳過更新
  if (!acmenu) return;

  // 清空舊的登入/登出選項
  const dynamicItems = document.querySelectorAll('.dynamic-item');
  dynamicItems.forEach(item => item.remove());

  if (user) {
      // 從 Firestore 獲取用戶資料
      try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
              const userData = userDoc.data();
              const userLi_ac = document.createElement('li');
              userLi_ac.className = 'dynamic-item';
              userLi_ac.textContent = `歡迎 ${userData.nickname || '用戶'}`;
              
              const likeLi_ac = document.createElement('li');
              likeLi_ac.className = 'dynamic-item';
              likeLi_ac.innerHTML = `<a href="liked.html">喜歡的歌曲</a>`;

              const logoutLi_ac = document.createElement('li');
              logoutLi_ac.className = 'dynamic-item';
              logoutLi_ac.innerHTML = `<a href="#" id="logoutButton">登出</a>`;

              const userLi_ham = document.createElement('li');
              userLi_ham.className = 'dynamic-item';
              userLi_ham.textContent = `歡迎 ${userData.nickname || '用戶'}`;
              
              const likeLi_ham = document.createElement('li');
              likeLi_ham.className = 'dynamic-item';
              likeLi_ham.innerHTML = `<a href="liked.html">喜歡的歌曲</a>`;

              const logoutLi_ham = document.createElement('li');
              logoutLi_ham.className = 'dynamic-item';
              logoutLi_ham.innerHTML = `<a href="#" id="logoutButton">登出</a>`;

              ham_ac.appendChild(userLi_ham);
              ham_ac.appendChild(likeLi_ham);
              ham_ac.appendChild(logoutLi_ham);
              acmenu.appendChild(userLi_ac);
              acmenu.appendChild(likeLi_ac);
              acmenu.appendChild(logoutLi_ac);

              const logoutButton = document.getElementById('logoutButton');
              if (logoutButton) {
                  logoutButton.addEventListener('click', (e) => {
                      e.preventDefault();
                      auth.signOut()
                          .then(() => {
                              alert("登出成功！");
                          })
                          .catch((error) => {
                              alert("登出失敗：" + error.message);
                          });
                  });
              }
          } else {
              console.error("Firestore 中未找到用戶資料");
          }
      } catch (error) {
          console.error("從 Firestore 獲取用戶資料失敗：", error.message);
      }
  } else {
      // 使用者未登入
      const loginLi_ac = document.createElement('li');
      loginLi_ac.className = 'dynamic-item';
      loginLi_ac.innerHTML = `<a href="account.html?type=login">登入</a>`;

      const registerLi_ac = document.createElement('li');
      registerLi_ac.className = 'dynamic-item';
      registerLi_ac.innerHTML = `<a href="account.html?type=register">註冊</a>`;

      const loginLi_ham = document.createElement('li');
      loginLi_ham.className = 'dynamic-item';
      loginLi_ham.innerHTML = `<a href="account.html?type=login">登入</a>`;

      const registerLi_ham = document.createElement('li');
      registerLi_ham.className = 'dynamic-item';
      registerLi_ham.innerHTML = `<a href="account.html?type=register">註冊</a>`;

      ham_ac.appendChild(loginLi_ham);
      ham_ac.appendChild(registerLi_ham);
      acmenu.appendChild(loginLi_ac);
      acmenu.appendChild(registerLi_ac);
  }
}

// 監聽登入狀態變化
onAuthStateChanged(auth, (user) => {
  updateMenu(user);
});


export { auth, firestore };
