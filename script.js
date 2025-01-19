/***********************
 *  INSERISCI QUI I TUOI DATI DI CONFIGURAZIONE FIREBASE
 ************************/
// Puoi ottenerli da Firebase Console > Project settings > "Config"
const firebaseConfig = {
  apiKey: "AIzaSyBivERuJvrO947t2Idv8DM3gZyfuqEQahw",
  authDomain: "campi-414b4.firebaseapp.com",
  projectId: "campi-414b4",
  storageBucket: "campi-414b4.firebasestorage.app",
  messagingSenderId: "985324700492",
  appId: "1:985324700492:web:b8cb569e83bb2e24ed85e9",
  measurementId: "G-3W0ZKB4S5Q"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);
// Inizializza Firestore
const db = firebase.firestore();

/*****************************************/

// Variabile globale per l'utente attualmente loggato
let currentUser = null;

// Lista utenti con credenziali prestabilite (username: password).
// Esempio con alcuni utenti + admin:
const users = {
  "user001": "aih2tSOF",
  "user002": "wc8iu2vc",
  "user003": "MH0UD4AB",
  // ... Aggiungi gli altri come vuoi ...
  "user250": "1hts1ouR",
  "admin": "passwordAdmin" // Lo usiamo per "admin"
};

// Slot di 45 minuti, a partire dalle 11:00 fino alle 20:45
const timeSlots = [
  "11:00", "11:45",
  "12:30", "13:15",
  "14:00", "14:45",
  "15:30", "16:15",
  "17:00", "17:45",
  "18:30", "19:15",
  "20:00", "20:45"
];

// Mappa che useremo in memoria (per aggiornare la UI)
// Esempio:
// reservations["Volley1"]["2025-01-20"]["11:00"] = "user001"
let reservations = {
  "Volley1": {},
  "Volley2": {},
  "Basket/Calcio": {},
  "Ping-pong": {}
};

/*******************************************************
 *  Funzioni di Utility
 ******************************************************/

// Restituisce la data odierna in formato YYYY-MM-DD
function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // mesi da 0 a 11
  let dd = today.getDate();

  if (mm < 10) mm = '0' + mm;
  if (dd < 10) dd = '0' + dd;

  return `${yyyy}-${mm}-${dd}`;
}

/*******************************************************
 *  Funzioni di Login/Logout
 ******************************************************/

function login(type) {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Inserisci username e password.');
    return;
  }

  // Verifica credenziali
  if (users[username] && users[username] === password) {
    currentUser = username;
    document.getElementById('login-area').style.display = 'none';
    document.getElementById('app-area').style.display = 'flex';

    toggleAdminSection();
    // Recupera prenotazioni attuali da Firestore
    loadReservationsFromFirestore();
  } else {
    alert('Credenziali errate!');
  }
}

function logout() {
  currentUser = null;
  document.getElementById('login-area').style.display = 'flex';
  document.getElementById('app-area').style.display = 'none';
}

// Se l'utente è admin, mostra la sezione admin
function toggleAdminSection() {
  if (currentUser === 'admin') {
    document.getElementById('admin-area').style.display = 'block';
  } else {
    document.getElementById('admin-area').style.display = 'none';
  }
}

/*******************************************************
 *  Funzioni per Gestione Prenotazioni su Firestore
 ******************************************************/

// Carica da Firestore tutte le prenotazioni di OGGI (e le mette in "reservations")
function loadReservationsFromFirestore() {
  const today = getTodayDate();

  // Svuota la struttura locale
  reservations = {
    "Volley1": {},
    "Volley2": {},
    "Basket/Calcio": {},
    "Ping-pong": {}
  };

  // Esegui una query su "reservations" dove il campo "date" == today
  // In Firestore v9 si usa: db.collection("reservations") e .where()
  db.collection("reservations")
    .where("date", "==", today)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const fieldName = data.field;
        const time = data.time;
        const user = data.user;

        // Se la struttura non esiste, creala
        if (!reservations[fieldName][today]) {
          reservations[fieldName][today] = {};
        }
        // Salva l'utente che ha prenotato
        reservations[fieldName][today][time] = user;
      });
      // Dopo aver caricato tutti i dati, aggiorna l'interfaccia
      populateAllFields();
      populateAdminTable();
      // Imposta un listener in tempo reale (opzionale)
      listenRealtimeForToday();
    })
    .catch((err) => {
      console.error("Errore caricamento prenotazioni:", err);
    });
}

// Attiva listener in tempo reale su Firestore (opzionale)
function listenRealtimeForToday() {
  const today = getTodayDate();

  db.collection("reservations")
    .where("date", "==", today)
    // .orderBy("time") // volendo, puoi ordinare
    .onSnapshot((snapshot) => {
      // Ogni volta che c'è un cambiamento su Firestore
      // ricostruiamo le prenotazioni locali e aggiorniamo l'interfaccia
      reservations = {
        "Volley1": {},
        "Volley2": {},
        "Basket/Calcio": {},
        "Ping-pong": {}
      };
      snapshot.forEach((doc) => {
        const data = doc.data();
        const fieldName = data.field;
        const time = data.time;
        const user = data.user;

        if (!reservations[fieldName][today]) {
          reservations[fieldName][today] = {};
        }
        reservations[fieldName][today][time] = user;
      });
      // Aggiorna la UI
      populateAllFields();
      populateAdminTable();
    });
}

// Funzione per salvare su Firestore una prenotazione
// docID = campo-data-orario (opzionale) o usiamo add() che genera ID casuale
function saveReservationToFirestore(fieldName, date, time, user) {
  // id personalizzato (campo_data_ora_user) - non obbligatorio
  const docId = `${fieldName}_${date}_${time}_${user}`;
  return db.collection("reservations").doc(docId).set({
    field: fieldName,
    date: date,
    time: time,
    user: user
  });
}

// Funzione per cancellare una prenotazione (admin o utente proprietario)
function deleteReservationFromFirestore(fieldName, date, time, user) {
  const docId = `${fieldName}_${date}_${time}_${user}`;
  return db.collection("reservations").doc(docId).delete();
}

/*******************************************************
 *  Funzioni di Business Logic (prenotazione, cancellazione)
 ******************************************************/

// Verifica se l'utente ha già prenotato oggi
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

// Prenota uno slot
function prenotaSlot(fieldName, slot) {
  const today = getTodayDate();
  if (userHasBookingToday() && currentUser !== 'admin') {
    alert('Hai già effettuato una prenotazione per oggi (max 45 minuti).');
    return;
  }

  // Controlla se lo slot è già prenotato
  if (reservations[fieldName][today] && reservations[fieldName][today][slot]) {
    alert('Questo slot è già prenotato.');
    return;
  }

  // Salva su Firestore
  saveReservationToFirestore(fieldName, today, slot, currentUser)
    .then(() => {
      alert(`Prenotazione effettuata: ${fieldName} alle ${slot}`);
    })
    .catch((err) => {
      console.error("Errore durante la prenotazione:", err);
    });
}

// Cancella la propria prenotazione (o se admin, cancella quella di chiunque)
function cancellaPrenotazioneUtente(fieldName, slot) {
  const today = getTodayDate();
  const bookedBy = reservations[fieldName][today][slot];

  if (bookedBy === currentUser || currentUser === 'admin') {
    deleteReservationFromFirestore(fieldName, today, slot, bookedBy)
      .then(() => {
        alert(`Prenotazione annullata: ${fieldName} alle ${slot}`);
      })
      .catch((err) => {
        console.error("Errore durante la cancellazione:", err);
      });
  } else {
    alert('Non puoi cancellare la prenotazione di un altro utente.');
  }
}

/*******************************************************
 *  Funzioni di UI (riempimento campi, tabella admin)
 ******************************************************/

// Popola i 4 campi
function populateAllFields() {
  populateFieldSlots("Volley1");
  populateFieldSlots("Volley2");
  populateFieldSlots("Basket/Calcio");
  populateFieldSlots("Ping-pong");
}

// Popola gli slot di un singolo campo
function populateFieldSlots(fieldName) {
  const today = getTodayDate();
  const containerId = `slots-${fieldName}`;
  const container = document.getElementById(containerId);

  // Se non ci sono prenotazioni per oggi, creala vuota
  if (!reservations[fieldName][today]) {
    reservations[fieldName][today] = {};
  }

  container.innerHTML = ''; // Svuota prima di ripopolare

  timeSlots.forEach(slot => {
    const slotDiv = document.createElement('div');
    slotDiv.classList.add('slot');

    const bookedBy = reservations[fieldName][today][slot];

    if (bookedBy) {
      // Slot prenotato
      if (bookedBy === currentUser) {
        // Prenotazione dell'utente corrente
        slotDiv.classList.add('my-booking');
        slotDiv.textContent = `${slot} - Prenotato da Me`;
        slotDiv.onclick = () => cancellaPrenotazioneUtente(fieldName, slot);
      } else {
        // Prenotazione di un altro utente
        slotDiv.classList.add('unavailable');
        slotDiv.textContent = `${slot} - Prenotato da ${bookedBy}`;
      }
    } else {
      // Slot libero
      slotDiv.classList.add('available');
      slotDiv.textContent = `${slot} - Disponibile`;
      slotDiv.onclick = () => prenotaSlot(fieldName, slot);
    }

    container.appendChild(slotDiv);
  });
}

// Popola la tabella Admin
function populateAdminTable() {
  const adminTableBody = document.getElementById('admin-table');
  if (!adminTableBody) return; // Se non esiste, esci

  adminTableBody.innerHTML = '';

  // Cicla su tutti i campi
  for (const field in reservations) {
    const today = getTodayDate();
    if (reservations[field][today]) {
      for (const timeSlot in reservations[field][today]) {
        const userWhoBooked = reservations[field][today][timeSlot];
        const tr = document.createElement('tr');

        const tdCampo = document.createElement('td');
        tdCampo.textContent = field;
        tr.appendChild(tdCampo);

        const tdData = document.createElement('td');
        tdData.textContent = today;
        tr.appendChild(tdData);

        const tdOrario = document.createElement('td');
        tdOrario.textContent = timeSlot;
        tr.appendChild(tdOrario);

        const tdUtente = document.createElement('td');
        tdUtente.textContent = userWhoBooked;
        tr.appendChild(tdUtente);

        const tdAzioni = document.createElement('td');
        const btnAnnulla = document.createElement('button');
        btnAnnulla.textContent = 'Annulla';
        btnAnnulla.classList.add('cancel-btn');
        btnAnnulla.onclick = () => {
          // Admin può cancellare qualsiasi prenotazione
          if (currentUser === 'admin') {
            deleteReservationFromFirestore(field, today, timeSlot, userWhoBooked);
          } else {
            alert('Solo l\'admin può cancellare la prenotazione di un altro utente.');
          }
        };
        tdAzioni.appendChild(btnAnnulla);
        tr.appendChild(tdAzioni);

        adminTableBody.appendChild(tr);
      }
    }
  }
}
