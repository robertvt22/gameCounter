import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAPcJUedwE-MDIPbUK2Jk8NWPxZzQS8yOY",
    authDomain: "gamecounterfinal.firebaseapp.com",
    projectId: "gamecounterfinal",
    storageBucket: "gamecounterfinal.firebasestorage.app",
    messagingSenderId: "898630359247",
    appId: "1:898630359247:web:a2b1951677e7e7b061ffba",
    measurementId: "G-2SCZW8M16P",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.querySelector(".login-form-content").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Login form submitted");

    const userInput = document.querySelector("#usr1");
    const passwordInput = document.querySelector("#psw1");
    const errorMessageDiv = document.querySelector(".error-nessage-popup");
    const loginValue = userInput ? userInput.value : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!loginValue || !password) {
        errorMessageDiv.textContent = "Te rugăm să completezi toate câmpurile.";
        errorMessageDiv.style.display = "block";
        return;
    }

    try {
        let email = loginValue;

        // Verifică dacă loginValue este un email folosind o expresie regulată simplă
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(loginValue)) {
            // Dacă nu este email, presupunem că este username și căutăm în Firestore
            const usersQuery = query(collection(db, "users"), where("username", "==", loginValue));
            const querySnapshot = await getDocs(usersQuery);

            if (querySnapshot.empty) {
                errorMessageDiv.textContent = "Nu există utilizator cu acest username.";
                errorMessageDiv.style.display = "block";
                return;
            }

            // Obține email-ul din primul document găsit
            email = querySnapshot.docs[0].data().email;
        }

        // Autentificare cu email și parolă
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        errorMessageDiv.style.display = "none";
        alert("Logare reușită!"); // Înlocuiește cu notificare UI în viitor
        window.location.href = `welcome.html?email=${encodeURIComponent(user.email)}`;
    } catch (error) {
        console.error("Eroare la logare:", error.code, error.message);
        let errorMessage;
        switch (error.code) {
            case "auth/wrong-password":
                errorMessage = "Parolă incorectă. Încearcă din nou.";
                break;
            case "auth/user-not-found":
                errorMessage = "Nu există utilizator cu acest email.";
                break;
            case "auth/invalid-email":
                errorMessage = "Format email invalid.";
                break;
            case "auth/invalid-credential":
                errorMessage = "Credențiale invalide. Verifică emailul/username-ul și parola.";
                break;
            default:
                errorMessage = "Eroare: " + error.message;
        }
        errorMessageDiv.textContent = errorMessage;
        errorMessageDiv.style.display = "block";
    }
});

const popup = document.querySelector("#popup1");
const openPopup = document.querySelectorAll(".btnPopup");
const closePopup = document.querySelector("#btnClose1");

openPopup.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        popup.classList.add("show");
    });
});

popup.addEventListener("click", (event) => {
    if (event.target === popup) {
        popup.classList.remove("show");
    }
});

closePopup.addEventListener("click", (event) => {
    event.preventDefault();
    popup.classList.remove("show");
});
