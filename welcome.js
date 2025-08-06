import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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

const btnLogout = document.querySelector("#btnLogout1");

if (btnLogout) {
    btnLogout.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Butonul de logout a fost apăsat");

        signOut(auth)
            .then(() => {
                alert("Deconectare realizată cu succes!");
                window.location.href = "index.html";
            })
            .catch((error) => {
                console.error("Eroare la deconectare:", error);
                alert(`Eroare: ${error.message}`);
            });
    });
} else {
    console.error("Elementul cu ID-ul #btnLogout1 nu a fost găsit.");
}

const btnPlus = document.querySelector("#btnPlus1");
const btnMinus = document.querySelector("#btnMinus1");
const btnSaveCurentScore = document.querySelector("#btnCurentScore1");
const btnSaveTotalScore = document.querySelector("#btnTotalScore1");
const displayCurentScore = document.querySelector("#curentScoreDisplay1");
const displayTotalScore = document.querySelector("#totalScoreDisplay1");

let curentScore = 0;
let totalScore = 0;
displayCurentScore.textContent = curentScore;
displayTotalScore.textContent = totalScore;

btnPlus.addEventListener("click", () => {
    curentScore++;
    displayCurentScore.textContent = curentScore;
});

btnMinus.addEventListener("click", () => {
    curentScore--;
    displayCurentScore.textContent = curentScore;
});

btnSaveCurentScore.addEventListener("click", () => {
    totalScore += curentScore;
    displayTotalScore.textContent = totalScore;
    curentScore = 0;
    displayCurentScore.textContent = curentScore;
});

if (btnSaveTotalScore) {
    btnSaveTotalScore.addEventListener("click", async (event) => {
        event.preventDefault();
        console.log("Butonul btntotalScore a fost apăsat");

        if (!auth.currentUser) {
            console.error("Niciun utilizator logat.");
            alert("Trebuie să fii logat pentru a salva scorul.");
            window.location.href = "index.html";
            return;
        }

        try {
            const user = auth.currentUser;
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                console.error("Documentul utilizatorului nu există.");
                alert("Eroare: Utilizatorul nu a fost găsit.");
                return;
            }

            const username = userDoc.data().username || "User";
            const email = user.email;
            const existingTotalScore = userDoc.data().totalScore ?? 0; // Obține scorul existent sau 0
            const newTotalScore = existingTotalScore + totalScore; // Adună scorul curent la cel existent

            // Salvează scorul sesiunii curente într-o colecție 'scores'
            await addDoc(collection(db, "scores"), {
                uid: user.uid,
                email: email,
                username: username,
                score: totalScore, // Salvează scorul sesiunii curente
                timestamp: new Date(),
            });

            // Actualizează scorul total în documentul utilizatorului
            await setDoc(userDocRef, { totalScore: newTotalScore }, { merge: true });

            console.log("Scorul a fost salvat cu succes:", newTotalScore);
            alert("Scor salvat cu succes!");

            // Actualizează variabila locală și afișajul
            totalScore = newTotalScore;
            displayTotalScore.textContent = totalScore;
        } catch (error) {
            console.error("Eroare la salvarea scorului:", error);
            alert(`Eroare la salvarea scorului: ${error.message}`);
        }
    });
} else {
    console.error("Elementul cu ID-ul #btntotalScore nu a fost găsit.");
}
