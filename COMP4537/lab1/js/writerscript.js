class Note {
    static idCounter = 0;

    constructor() {
        this.id = Note.idCounter++;
        [this.textElem, this.buttonElem, this.noteDiv] = this.initializeHTMLElements();
    }

    initializeHTMLElements() {
        const textAreaElem = document.createElement("textarea");
        const buttonElem = document.createElement("button");
        const noteDiv = document.createElement("div");

        buttonElem.id = this.id;
        noteDiv.id = "div" + this.id;

        textAreaElem.rows = 5;
        textAreaElem.cols = 30;

        buttonElem.classList += "removeButton";
        noteDiv.classList += "noteDiv";
        
        textAreaElem.onchange = function() {NoteManager.updateLocalStorage()};

        noteDiv.appendChild(textAreaElem);
        noteDiv.appendChild(buttonElem);

        document.getElementById("buttonArea").appendChild(noteDiv);
        buttonElem.onclick = function() {NoteManager.deleteNode(this.id)};

        return [textAreaElem, buttonElem, noteDiv];
    }
}

class NoteManager {
    static noteArray = [];

    static initializeNotes() {
        const noteJson = JSON.parse(localStorage.getItem("noteJson"));

        // If notes exist, load them
        if(noteJson !== null) {
            for(let i = 0; i < noteJson.length; i++) {
                this.addNote(noteJson[i].value);
            }
        // Else, load three dummy notes
        } else {
            for(let i = 0; i < 3; i++)
            {
                this.addNote();
            }
        }
    }

    static addNote(value) {
        const note = new Note();
        // If there is an argument, set the textarea's text to that argument
        note.textElem.value = (value !== undefined) ? value : "";

        this.noteArray.push(note);
        StringManager.loadClassStrings();
        this.updateLocalStorage();
    }

    static deleteNode(id) {
        const div = document.getElementById("div" + id);
        document.getElementById("buttonArea").removeChild(div);

        // Locate index of note to remove, given ID
        // (If parseInt() returns NaN, returns -1)
        const noteIndexToRemove = this.noteArray.findIndex(note => note.id === parseInt(id))

        if(noteIndexToRemove !== -1) {
            this.noteArray.splice(noteIndexToRemove, 1);
        }

        this.updateLocalStorage();
    }

    static updateLocalStorage() {
        // Notes stored as Json
        let noteArrayJson = {
            "length": this.noteArray.length
        }
        
        for(let i = 0; i < this.noteArray.length; i++) {
            // Only store ID and value -
            // those are the only necessary properties
            let noteJson = {
                "id": this.noteArray[i].id,
                "value": this.noteArray[i].textElem.value
            }
            noteArrayJson[i] = noteJson;
        }

        localStorage.setItem("noteJson", JSON.stringify(noteArrayJson));

        // Also update timestamp -
        // timestamp to be updated whenever local storage updated
        this.updateTimestamp();
    }

    static updateTimestamp() {
        const timestamp = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        })
        
        document.getElementById("timestamp").innerText = timestamp;
    }
    
}

document.getElementById("backButton").addEventListener("click", function() {
    window.location.replace('/COMP4537/lab1/');
})

document.getElementById("addButton").addEventListener("click", function() {
    NoteManager.addNote();
})


NoteManager.initializeNotes();
StringManager.loadClassStrings();