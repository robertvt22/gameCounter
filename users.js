import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const username = userDoc.data().username || "User";
                document.getElementById("id-login").textContent = `${username}`;
            } else {
                console.error("Documentul utilizatorului nu există în Firestore.");
                document.getElementById("id-login").textContent = `Bun venit, @User!`;
            }
        } catch (error) {
            console.error("Eroare la obținerea username-ului:", error);
            document.getElementById("id-login").textContent = `Bun venit, @User!`;
        }
    } else {
        window.location.href = "index.html";
    }
});

async function loadUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const list = document.getElementById("user-content1");

        if (!list) {
            console.error("Elementul cu ID-ul 'user-content1' nu a fost găsit.");
            return;
        }

        list.innerHTML = ""; // Golește containerul

        querySnapshot.forEach((doc) => {
            const username = doc.data().username || "Fără username";
            const totalScore = doc.data().totalScore ?? 0; // Folosește 0 dacă totalScore nu există

            const userContent = document.createElement("div");
            userContent.classList.add("user-item");

            const userp = document.createElement("p");
            userp.textContent = `${username}:`;

            const totalScoreP = document.createElement("p");
            totalScoreP.textContent = `${totalScore}`;

            userContent.appendChild(userp);
            userContent.appendChild(totalScoreP);
            list.appendChild(userContent);
        });

        if (querySnapshot.empty) {
            const userContent = document.createElement("div");
            userContent.textContent = "Nu există utilizatori.";
            list.appendChild(userContent);
        }
    } catch (error) {
        console.error("Eroare la încărcarea listei de utilizatori:", error);
        const errorDiv = document.getElementById("error");
        if (errorDiv) {
            errorDiv.textContent = `Eroare la încărcare: ${error.message}`;
        }
    }
}

loadUsers();
