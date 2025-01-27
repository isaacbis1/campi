/***********************
 *  CONFIGURAZIONE FIREBASE
 ************************/
const firebaseConfig = {
  apiKey: "AIzaSyBivERuJvrO947t2Idv8DM3gZyfuqEQahw",
  authDomain: "campi-414b4.firebaseapp.com",
  projectId: "campi-414b4",
  storageBucket: "campi-414b4.firebasestorage.app",
  messagingSenderId: "985324700492",
  appId: "1:985324700492:web:b8cb569e83bb2e24ed85e9",
  measurementId: "G-3W0ZKB4S5Q"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/*****************************************/

/* Variabili Globali */
let currentUser = null; // Usiamo SEMPRE questa variabile
const adminUsername = "admin";
const adminPassword = "passwordAdmin";

/* Hardcoded static users con password fisse per 200 utenti */
const staticUsers = {
  "admin": "passwordAdmin",
  "user001": "jcne",
  "user002": "hoyw",
  // ... [omessi per brevità] ...
  "user200": "drmf"
};

const timeSlots = [
  "11:00", "11:45",
  "12:30", "13:15",
  "14:00", "14:45",
  "15:30", "16:15",
  "17:00", "17:45",
  "18:30", "19:15",
  "20:00", "20:45"
];

let reservations = {
  "Volley1": {},
  "Volley2": {},
  "BasketCalcio": {},
  "Ping-pong": {}
};

/*******************************************************
 *  FUNZIONI UTILITY E DI LOGIN
 ******************************************************/

// Ottiene la data odierna nel formato YYYY-MM-DD
function getTodayDate() {
  const today = new Date();
  let yyyy = today.getFullYear();
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Mostra una notifica personalizzata
function showNotification(message) {
  const container = document.getElementById('notification-container');
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = message;
  container.appendChild(notification);

  // Rimuove la notifica dopo 3 secondi
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Funzione di login
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    showNotification('Inserisci username e password.');
    return;
  }

  // Controlla su Firestore se esiste l'utente
  db.collection("users").doc(username).get()
    .then(doc => {
      if (doc.exists) {
        // Utente presente in Firestore
        const data = doc.data();
        if (data.disabled) {
          showNotification("Questo utente è disabilitato.");
          return;
        }
        // Controllo password
        if (data.password === password) {
          authenticateUser(username, data.role);
        } else {
          showNotification("Credenziali errate!");
        }
      } else {
        // Utente non esiste su Firestore, controlliamo staticUsers
        if (staticUsers[username] && staticUsers[username] === password) {
          // Creiamo doc su Firestore
          const role = (username === adminUsername) ? "admin" : "user";
          db.collection("users").doc(username).set({
            disabled: false,
            role: role,
            password: password
          }).then(() => {
            authenticateUser(username, role);
          }).catch(err => {
            console.error(err);
            showNotification("Errore durante la creazione dell'utente.");
          });
        } else {
          showNotification("Credenziali errate!");
        }
      }
    })
    .catch(err => {
      console.error(err);
      showNotification("Errore durante il login.");
    });
}

// Autentica l'utente (admin o user)
function authenticateUser(username, role) {
  // Impostiamo la variabile globale di sessione
  currentUser = username;

  toggleSections(true);
  toggleAdminSection(role);
  loadReservationsFromFirestore();
  populateCredentialsTable();
  checkAndResetAfterTen();
  showNotification(`Benvenuto, ${username}!`);
}

// Funzione di logout
function logout() {
  currentUser = null; // annulliamo la variabile globale
  toggleSections(false);
  showNotification("Sei uscito con successo.");
}

// Mostra o nasconde le sezioni principali
function toggleSections(isLoggedIn) {
  document.getElementById('login-area').style.display = isLoggedIn ? 'none' : 'flex';
  document.getElementById('app-area').style.display = isLoggedIn ? 'flex' : 'none';
}

// Mostra o nasconde la sezione admin
function toggleAdminSection(role) {
  const adminSection = document.getElementById('admin-area');
  // Se role è "admin" o l'username è "admin", mostra l'area admin
  if (role === 'admin' || currentUser === adminUsername) {
    adminSection.style.display = 'block';
  } else {
    adminSection.style.display = 'none';
  }
}

/*******************************************************
 *  FUNZIONI PER IL RESET GIORNALIERO AL PRIMO ACCESSO DOPO LE 9:59
 ******************************************************/

function checkAndResetAfterTen() {
  const lastResetDate = localStorage.getItem('lastResetDate');
  const today = getTodayDate();
  const now = new Date();
  // Resetta se non è già stato fatto oggi e sono passate le 10:00
  if (lastResetDate !== today && now.getHours() >= 10) {
    resetAllReservations();
    localStorage.setItem('lastResetDate', today);
  }
}

function resetAllReservations() {
  const today = getTodayDate();
  db.collection("reservations")
    .where("date", "==", today)
    .get()
    .then(snapshot => {
      const batch = db.batch();
      const userIdsToExclude = [];

      // Recupera tutti gli utenti admin
      return db.collection("users").where("role", "==", "admin").get()
        .then(adminSnapshot => {
          adminSnapshot.forEach(doc => {
            userIdsToExclude.push(doc.id);
          });
          snapshot.forEach(doc => {
            const data = doc.data();
            if (!userIdsToExclude.includes(data.user)) {
              batch.delete(doc.ref);
            }
          });
          return batch.commit();
        });
    })
    .then(() => {
      showNotification("Prenotazioni resettate per il nuovo giorno (tranne admin).");
      loadReservationsFromFirestore();
    })
    .catch(err => {
      console.error("Errore durante il reset delle prenotazioni:", err);
      showNotification("Errore durante il reset delle prenotazioni.");
    });
}

/*******************************************************
 *  FUNZIONI FIRESTORE
 ******************************************************/

function loadReservationsFromFirestore() {
  const today = getTodayDate();
  reservations = {
    "Volley1": {},
    "Volley2": {},
    "BasketCalcio": {},
    "Ping-pong": {}
  };

  db.collection("reservations")
    .where("date", "==", today)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const fieldName = data.field;
        const time = data.time;
        const user = data.user;
        if (!reservations[fieldName]) {
          reservations[fieldName] = {};
        }
        if (!reservations[fieldName][today]) {
          reservations[fieldName][today] = {};
        }
        reservations[fieldName][today][time] = user;
      });
      populateAllFields();
      listenRealtimeForToday();
    })
    .catch((err) => {
      console.error("Errore caricamento prenotazioni:", err);
      showNotification("Errore caricamento prenotazioni.");
    });
}

function listenRealtimeForToday() {
  const today = getTodayDate();
  db.collection("reservations")
    .where("date", "==", today)
    .onSnapshot((snapshot) => {
      reservations = {
        "Volley1": {},
        "Volley2": {},
        "BasketCalcio": {},
        "Ping-pong": {}
      };
      snapshot.forEach((doc) => {
        const data = doc.data();
        const fieldName = data.field;
        const time = data.time;
        const user = data.user;

        if (!reservations[fieldName]) {
          reservations[fieldName] = {};
        }
        if (!reservations[fieldName][today]) {
          reservations[fieldName][today] = {};
        }
        reservations[fieldName][today][time] = user;
      });
      populateAllFields();
      populateAdminTable();

      // Se l'utente è admin, ricarichiamo la tabella credenziali
      // (in base al doc di currentUser)
      db.collection("users").doc(currentUser).get().then(docSnap => {
        if (docSnap.exists && docSnap.data().role === "admin") {
          populateCredentialsTable();
        }
      });
    });
}

function saveReservationToFirestore(fieldName, date, time, user, role) {
  const docId = `${fieldName}_${date}_${time}_${user}`;
  return db.collection("reservations").doc(docId).set({
    field: fieldName,
    date: date,
    time: time,
    user: user,
    role: role
  });
}

function deleteReservationFromFirestore(fieldName, date, time, user) {
  const docId = `${fieldName}_${date}_${time}_${user}`;
  return db.collection("reservations").doc(docId).delete();
}

/*******************************************************
 *  FUNZIONI DI GESTIONE PRENOTAZIONI E UI
 ******************************************************/

function userHasBookingToday() {
  const today = getTodayDate();
  for (let field in reservations) {
    if (reservations[field][today]) {
      for (let slot in reservations[field][today]) {
        if (reservations[field][today][slot] === currentUser) {
          return true;
        }
      }
    }
  }
  return false;
}

function populateAllFields() {
  ["Volley1", "Volley2", "BasketCalcio", "Ping-pong"].forEach(field => {
    populateFieldSlots(field);
  });
}

function populateFieldSlots(fieldName) {
  const today = getTodayDate();
  const container = document.getElementById(`slots-${fieldName}`);
  if (!reservations[fieldName][today]) {
    reservations[fieldName][today] = {};
  }

  container.innerHTML = '';

  timeSlots.forEach(slot => {
    const slotDiv = document.createElement('div');
    slotDiv.classList.add('slot');

    const bookedBy = reservations[fieldName][today][slot];

    if (bookedBy) {
      if (bookedBy === currentUser) {
        slotDiv.classList.add('my-booking');
        slotDiv.textContent = `${slot} - Prenotato da Te`;
        slotDiv.onclick = () => cancellaPrenotazioneUtente(fieldName, slot);
      } else {
        slotDiv.classList.add('unavailable');
        slotDiv.textContent = `${slot} - Prenotato`;
      }
    } else {
      slotDiv.classList.add('available');
      slotDiv.textContent = `${slot} - Disponibile`;
      slotDiv.onclick = () => prenotaSlot(fieldName, slot);
    }

    container.appendChild(slotDiv);
  });
}

function prenotaSlot(fieldName, slot) {
  const today = getTodayDate();

  // Recupera il ruolo dal documento Firestore
  db.collection("users").doc(currentUser).get().then(docSnap => {
    const role = docSnap.exists ? docSnap.data().role : "user";

    // Se NON sei admin, puoi avere solo 1 prenotazione al giorno
    if (role !== "admin" && userHasBookingToday()) {
      showNotification('Hai già effettuato una prenotazione per oggi.');
      return;
    }

    // Controlliamo se lo slot è già prenotato
    if (reservations[fieldName][today][slot]) {
      showNotification('Questo slot è già prenotato.');
      return;
    }

    // Tutto ok, salviamo la prenotazione
    saveReservationToFirestore(fieldName, today, slot, currentUser, role)
      .then(() => {
        showNotification(`Prenotazione effettuata: ${fieldName} alle ${slot}`);
      })
      .catch((err) => {
        console.error("Errore durante la prenotazione:", err);
        showNotification("Errore durante la prenotazione.");
      });
  });
}

function cancellaPrenotazioneUtente(fieldName, slot) {
  const today = getTodayDate();
  const bookedBy = reservations[fieldName][today][slot];
  if (bookedBy === currentUser) {
    deleteReservationFromFirestore(fieldName, today, slot, bookedBy)
      .then(() => {
        showNotification(`La tua prenotazione per ${fieldName} alle ${slot} è stata annullata.`);
      })
      .catch((err) => {
        console.error("Errore durante la cancellazione:", err);
        showNotification("Errore durante la cancellazione.");
      });
  } else {
    showNotification('Non puoi cancellare la prenotazione di un altro utente.');
  }
}

/*******************************************************
 *  FUNZIONI ADMINISTRATIVE
 ******************************************************/

function populateAdminTable() {
  const today = getTodayDate();
  const tbody = document.getElementById('admin-table');
  tbody.innerHTML = '';

  for (let field in reservations) {
    if (reservations[field][today]) {
      for (let time in reservations[field][today]) {
        const user = reservations[field][today][time];
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${field}</td>
          <td>${today}</td>
          <td>${time}</td>
          <td>${user}</td>
          <td>
            <button class="cancel-btn" onclick="deleteAdminReservation('${field}','${today}','${time}','${user}')">
              <i class="fas fa-trash-alt"></i> Elimina
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      }
    }
  }
}

function deleteAdminReservation(fieldName, date, time, user) {
  deleteReservationFromFirestore(fieldName, date, time, user)
    .then(() => {
      showNotification(`La prenotazione per ${fieldName} alle ${time} dell'utente ${user} è stata cancellata.`);
    })
    .catch((err) => {
      console.error('Errore durante la cancellazione:', err);
      showNotification("Errore durante la cancellazione della prenotazione.");
    });
}

/*******************************************************
 *  FUNZIONI PER LA GESTIONE DELLE CREDENZIALI E STATUS UTENTI
 ******************************************************/

function populateCredentialsTable() {
  const tbody = document.getElementById('credentials-table');
  tbody.innerHTML = '';

  db.collection("users").get().then(snapshot => {
    snapshot.forEach(doc => {
      let data = doc.data();
      let username = doc.id;
      const password = data.password || "N/D";

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${username}</td>
        <td>${password}</td>
        <td>${data.disabled ? 'Disabilitato' : 'Attivo'}</td>
        <td>
          <button onclick="toggleUserStatus('${username}', ${data.disabled})">
            <i class="fas ${data.disabled ? 'fa-toggle-off' : 'fa-toggle-on'}"></i> 
            ${data.disabled ? 'Attiva' : 'Disattiva'}
          </button>
          &nbsp;|&nbsp;
          <button onclick="editUserPassword('${username}')">
            <i class="fas fa-edit"></i> Cambia Password
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }).catch(err => console.error(err));
}

function toggleUserStatus(username, currentDisabled) {
  let newStatus = !currentDisabled;
  db.collection("users").doc(username).update({
    disabled: newStatus
  }).then(() => {
    populateCredentialsTable();
    showNotification(`Utente ${username} ${newStatus ? 'disabilitato' : 'attivato'} con successo.`);
  }).catch(err => {
    console.error(err);
    showNotification("Errore durante l'aggiornamento dello stato dell'utente.");
  });
}

function editUserPassword(username) {
  const newPass = prompt(`Inserisci la nuova password per ${username}:`);
  if (!newPass) {
    showNotification("Nessuna password inserita.");
    return;
  }

  db.collection("users").doc(username).update({
    password: newPass
  })
  .then(() => {
    showNotification(`Password di ${username} aggiornata con successo.`);
    populateCredentialsTable();
  })
  .catch(err => {
    console.error(err);
    showNotification("Errore durante l'aggiornamento della password.");
  });
}

// Crea tutti i 200 utenti in Firestore (opzionale)
function createAllStaticUsers() {
  const batch = db.batch();
  Object.keys(staticUsers).forEach(u => {
    const role = (u === "admin") ? "admin" : "user";
    const ref = db.collection("users").doc(u);
    batch.set(ref, {
      disabled: false,
      role: role,
      password: staticUsers[u]
    });
  });

  return batch.commit()
    .then(() => {
      console.log("Tutti i 200 utenti creati su Firestore");
      showNotification("Tutti i 200 utenti sono stati creati su Firestore!");
    })
    .catch(err => {
      console.error(err);
      showNotification("Errore durante la creazione dei 200 utenti.");
    });
}

function handleCreateAllUsers() {
  // Verifica se l'utente corrente è admin
  if (!currentUser) {
    showNotification("Devi essere loggato come admin per creare gli utenti!");
    return;
  }

  // Controlliamo su Firestore se `currentUser` ha role=admin
  db.collection("users").doc(currentUser).get()
    .then(doc => {
      if (doc.exists && doc.data().role === "admin") {
        // Se è admin, creiamo tutti gli utenti
        createAllStaticUsers();
      } else {
        showNotification("Non hai i permessi per creare tutti gli utenti!");
      }
    })
    .catch(err => {
      console.error(err);
      showNotification("Errore di verifica ruolo admin.");
    });
}
