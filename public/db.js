const indexedDB = window.indexedDB || window.mozindexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIdexedDB;
let db;
const request = indexedDB.open("budget", 1)
request.onupgradeneeded = ({target}) => {
    let db = target.result;
    db.createObjectStore("pending", {autoIncrement: true})
}

request.onsuccess = ({target}) => {
    let db = target.result;
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

