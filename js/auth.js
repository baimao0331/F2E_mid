import { auth } from './firebase-init.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    reload,
    sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';
import { firestore } from './firebase-init.js';
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,doc, setDoc
} from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

const messageBox = document.getElementById("messagebox");


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email); // 返回 true 或 false
}

// 檢查是否有任一輸入為空
function hasEmptyField(...fields) {
    return fields.some(field => !field || field.trim() === "");
}

// 會員系統功能
export async function registerUser(email, password, username) {
    try {
        // 檢查是否有空白
        if (hasEmptyField(email, password, username)) {
            document.getElementById('messagebox').classList.remove("correct");
            document.getElementById('messagebox').classList.add("error");
            messageBox.innerText = "所有欄位都是必填的，請確認輸入完整";
            return; // 停止註冊流程
        }

        // 檢查電子郵件格式
        if (!isValidEmail(email)) {
            document.getElementById('messagebox').classList.remove("correct");
            document.getElementById('messagebox').classList.add("error");
            messageBox.innerText = "請輸入有效的電子郵件地址";
            return; // 停止註冊流程
        }

        // 檢查密碼長度
        if (password.length < 6) {
            console.log("密碼太短");
            document.getElementById('messagebox').classList.remove("correct");
            document.getElementById('messagebox').classList.add("error");
            messageBox.innerText = "密碼必須至少 6 個字符";
            return; // 停止註冊流程
        }

        // 檢查使用者名稱長度
        if (username.length > 16) {
            document.getElementById('messagebox').classList.remove("correct");
            document.getElementById('messagebox').classList.add("error");
            messageBox.innerText = "使用者名稱不得超過 16 個字符";
            return; // 停止註冊流程
        }
        // 註冊用戶
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 更新使用者名稱
        await updateProfile(user, { username });
        console.log("使用者名稱已設置：", username);

        // 將用戶資料存入 Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            nickname: username,
            liked: [],
            createdAt: new Date(),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log("用戶註冊並存入 Firestore 成功：", user);
        document.getElementById('messagebox').classList.remove("error");
        document.getElementById('messagebox').classList.add("correct");
        messageBox.innerText = `註冊成功，即將回到上一頁`;
        setTimeout(() => {
            history.back(); // 返回上一頁
        }, 3000); // 3000毫秒 = 3秒
    } catch (error) {
        console.error(error.message);
        document.getElementById('messagebox').classList.remove("correct");
        document.getElementById('messagebox').classList.add("error");
        messageBox.innerText = getErrorMessage(error);
    };
}

export async function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log("登錄成功：", userCredential.user);
            document.getElementById('messagebox').classList.remove("error");
            document.getElementById('messagebox').classList.add("correct");
            messageBox.innerText = `登入成功，即將回到上一頁`;
            setTimeout(() => {
                history.back(); // 返回上一頁
            }, 3000);
        })
        .catch((error) => {
            document.getElementById('messagebox').classList.remove("correct");
            document.getElementById('messagebox').classList.add("error");
            messageBox.innerText = getErrorMessage(error);
        });
}

export function logoutUser() {
    signOut(auth)
        .then(() => {
            console.log("用戶已登出");
        })
        .catch((error) => {
            console.error("登出失敗：", error.message);
            messageBox.innerText = getErrorMessage(error);
        });
}

export function resetpassword(email) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Password reset email sent!");
            document.getElementById('messagebox').classList.remove("error");
            document.getElementById('messagebox').classList.add("correct");
            messageBox.innerText = `已寄送重設密碼的信件，請查看你的信箱`;
        })
        .catch((error) => {
            document.getElementById('messagebox').classList.remove("correct");
            document.getElementById('messagebox').classList.add("error");
            // 檢查電子郵件格式
            if (!isValidEmail(email)) {
                document.getElementById('messagebox').classList.remove("correct");
                document.getElementById('messagebox').classList.add("error");
                messageBox.innerText = "請輸入有效的電子郵件地址";
                return; // 停止註冊流程
            }
            // ..
        });
}

// 錯誤消息處理
function getErrorMessage(error) {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return '該電子郵件地址已被使用。請嘗試其他電子郵件地址！';
        case 'auth/user-not-found':
            return '用戶未找到。請檢查電子郵件地址或註冊新帳號！';
        case 'auth/wrong-password':
            return '密碼錯誤。請檢查並重新輸入！';
        case 'auth/missing-password':
            return '密碼為空。請檢查並重新輸入！';
        case 'auth/invalid-credential':
            return '錯誤的信箱或密碼。請檢查並重新輸入！'
        case 'auth/invalid-email':
            return '請輸入有效的電子郵件地址'
        default:
            return '發生未知錯誤：' + error.message;
    }
}
