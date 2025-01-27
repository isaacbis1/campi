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
let currentUser = null;
const adminUsername = "admin";
const adminPassword = "passwordAdmin";

/* Hardcoded static users con password fisse per 200 utenti */
const staticUsers = {
  "admin": "passwordAdmin",
  "user001": "jcne",
  "user002": "hoyw",
  "user003": "xqal",
  "user004": "ekvn",
  "user005": "msyo",
  "user006": "zfil",
  "user007": "rbte",
  "user008": "pwxa",
  "user009": "nkcv",
  "user010": "gdmu",
  "user011": "lxqp",
  "user012": "tefz",
  "user013": "vukn",
  "user014": "ywqc",
  "user015": "joax",
  "user016": "heml",
  "user017": "dpuz",
  "user018": "scnv",
  "user019": "ytak",
  "user020": "fgxr",
  "user021": "qvlm",
  "user022": "unyt",
  "user023": "bzio",
  "user024": "wpkd",
  "user025": "oyfj",
  "user026": "mevl",
  "user027": "akpf",
  "user028": "cznx",
  "user029": "bluo",
  "user030": "xhvt",
  "user031": "jcrw",
  "user032": "pkaz",
  "user033": "twne",
  "user034": "dqmh",
  "user035": "vsjo",
  "user036": "nzfk",
  "user037": "grya",
  "user038": "ojbw",
  "user039": "lmqd",
  "user040": "ykvr",
  "user041": "cnhx",
  "user042": "fqzm",
  "user043": "vlpu",
  "user044": "eznf",
  "user045": "tjya",
  "user046": "owrb",
  "user047": "mnqd",
  "user048": "kzwp",
  "user049": "prfv",
  "user050": "hxla",
  "user051": "dyuk",
  "user052": "bzcn",
  "user053": "lxem",
  "user054": "vqwd",
  "user055": "ajok",
  "user056": "pcmn",
  "user057": "nzhl",
  "user058": "tfkr",
  "user059": "kmyv",
  "user060": "owfz",
  "user061": "rljq",
  "user062": "vewu",
  "user063": "ytai",
  "user064": "qlkr",
  "user065": "xpdn",
  "user066": "mvzu",
  "user067": "ojwr",
  "user068": "teln",
  "user069": "fqzy",
  "user070": "blmc",
  "user071": "hrtk",
  "user072": "dngv",
  "user073": "paum",
  "user074": "wvkc",
  "user075": "xroa",
  "user076": "jlwn",
  "user077": "eykv",
  "user078": "czpj",
  "user079": "oltd",
  "user080": "urfb",
  "user081": "nvce",
  "user082": "jxow",
  "user083": "bqyn",
  "user084": "zmpa",
  "user085": "wfuz",
  "user086": "oejd",
  "user087": "hvri",
  "user088": "plnc",
  "user089": "dtwr",
  "user090": "qvjm",
  "user091": "zcyu",
  "user092": "frbl",
  "user093": "ektm",
  "user094": "wvpx",
  "user095": "ytlm",
  "user096": "oqfi",
  "user097": "vjwb",
  "user098": "akxe",
  "user099": "lmvt",
  "user100": "czqo",
  "user101": "ewnh",
  "user102": "obml",
  "user103": "pxkt",
  "user104": "vujr",
  "user105": "ydlf",
  "user106": "hnvz",
  "user107": "ekow",
  "user108": "wrfp",
  "user109": "xqtn",
  "user110": "ovmu",
  "user111": "jaly",
  "user112": "pcnz",
  "user113": "fwzr",
  "user114": "gtox",
  "user115": "dhqb",
  "user116": "rmvl",
  "user117": "kyuo",
  "user118": "epcd",
  "user119": "ojkf",
  "user120": "alnr",
  "user121": "tzvq",
  "user122": "fjwk",
  "user123": "xqoa",
  "user124": "dzrm",
  "user125": "wlfp",
  "user126": "vknc",
  "user127": "bzqh",
  "user128": "amol",
  "user129": "fvrj",
  "user130": "kdzx",
  "user131": "njcv",
  "user132": "xyal",
  "user133": "tpdz",
  "user134": "rfwb",
  "user135": "vlio",
  "user136": "ekqu",
  "user137": "jyzf",
  "user138": "woan",
  "user139": "lvpk",
  "user140": "ufcz",
  "user141": "mdhx",
  "user142": "ybrn",
  "user143": "qtoi",
  "user144": "kpva",
  "user145": "ofzx",
  "user146": "ajqw",
  "user147": "tnyr",
  "user148": "wlpc",
  "user149": "zfxb",
  "user150": "hcrj",
  "user151": "dbto",
  "user152": "nzrl",
  "user153": "wtvy",
  "user154": "clmo",
  "user155": "pvew",
  "user156": "ofqn",
  "user157": "xdlj",
  "user158": "bzvr",
  "user159": "jufq",
  "user160": "womn",
  "user161": "hqzl",
  "user162": "eytn",
  "user163": "rwkx",
  "user164": "vlpu",
  "user165": "dtno",
  "user166": "azmf",
  "user167": "cwrx",
  "user168": "ynol",
  "user169": "pjku",
  "user170": "hfxr",
  "user171": "ymzd",
  "user172": "qvtk",
  "user173": "owrf",
  "user174": "elpn",
  "user175": "tdmz",
  "user176": "jbvo",
  "user177": "kfwr",
  "user178": "plqm",
  "user179": "xzno",
  "user180": "uvlw",
  "user181": "djyx",
  "user182": "cfpz",
  "user183": "mqvi",
  "user184": "rwtn",
  "user185": "kpzl",
  "user186": "fqad",
  "user187": "lyvo",
  "user188": "hpxc",
  "user189": "wnzt",
  "user190": "ojfq",
  "user191": "zmva",
  "user192": "drky",
  "user193": "wlcp",
  "user194": "bntz",
  "user195": "ovjr",
  "user196": "fqzx",
  "user197": "nxom",
  "user198": "pklc",
  "user199": "xvqw",
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

  // Controlla Firestore
  db.collection("users").doc(username).get()
    .then(doc => {
      if (doc.exists) {
        // Utente su Firestore
        const data = doc.data();
        if (data.disabled) {
          showNotification("Questo utente è disabilitato.");
          return;
        }
        if (data.password === password) {
          authenticateUser(username, data.role);
        } else {
          showNotification("Credenziali errate!");
        }
      } else {
        // Non c'è su Firestore, controlla se è in staticUsers
        if (staticUsers[username] && staticUsers[username] === password) {
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
  window.currentUser = null;
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
  if (role === 'admin' || window.currentUser === adminUsername) {
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
      db.collection("users").doc(window.currentUser).get().then(docSnap => {
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
        if (reservations[field][today][slot] === window.currentUser) {
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
      if (bookedBy === window.currentUser) {
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
  db.collection("users").doc(window.currentUser).get().then(docSnap => {
    const role = docSnap.exists ? docSnap.data().role : "user";

    if (role !== "admin" && userHasBookingToday()) {
      showNotification('Hai già effettuato una prenotazione per oggi.');
      return;
    }

    if (reservations[fieldName][today][slot]) {
      showNotification('Questo slot è già prenotato.');
      return;
    }

    saveReservationToFirestore(fieldName, today, slot, window.currentUser, role)
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
  if (bookedBy === window.currentUser) {
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

