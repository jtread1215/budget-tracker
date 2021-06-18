const indexedDB = window.indexedDB || 
window.mozindexedDB || 
window.webkitIndexedDB || 
window.msIndexedDB || 
window.shimIdexedDB;

let db;
const request = indexedDB.open("budget", 1)
request.onupgradeneeded = ({target}) => {
    let db = target.result;
    db.createObjectStore("pending", {autoIncrement: true})
}

request.onsuccess = ({target}) => {
    db = target.result;
    if(navigator.online){
        checkDatabase();
    }
}

request.onerror = function(event) {
    console.log("Sorry your lost!" + event.target.errorCode)
}

function saveRecord(record) {
    let transaction = db.transaction(["pending"], "readWrite")
    let store = transaction.objectStore("pending")
    store.add(record)
}

function checkDatabase() {
    let transaction = db.transaction(["pending"], "readwrite");
    let store = transaction.objectStore("pending");
    let getAll = store.getAll();
    getAll.onsuccess = function() {
        if(getAll.result.length > 0) {
            fetch("/api/transation/bulk", {
                method: "POST",
                body: JSON.stringify/(getAll.result),
                headers:
                {
                    Accept: "application/json, text/plain, */*", "Content-Type": "application/json"
                }
            })
            .then(response => {
                return response.json();
            })
            .then(() => {
                let transaction = db.transaction(["pending"], "readwrite");
                let store = transaction.objectStore("pending");
                store.clear();
            });
        }
    };
}

window.addEventListener("online", checkDatabase);

