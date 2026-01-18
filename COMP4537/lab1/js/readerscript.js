class Note {
    static idCounter = 0;

    constructor() {
        this.id = Note.idCounter++;
        [this.textElem, this.noteDiv] = this.initializeHTMLElements();
    }

    initializeHTMLElements() {
        const textAreaElem = document.createElement("textarea");
        const noteDiv = document.createElement("div");

        textAreaElem.rows = 5;
        textAreaElem.cols = 30;

        textAreaElem.readOnly = true;
        noteDiv.id = "div" + this.id;
        noteDiv.classList += "noteDiv";
        
        noteDiv.appendChild(textAreaElem);

        document.getElementById("buttonArea").appendChild(noteDiv);

        return [textAreaElem, noteDiv];
    }
}

class NoteManager {
    static noteArray = [];

    static initializeNotes() {
        document.getElementById("buttonArea").innerHTML = "";

        // Get notes from local storage
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

        const timestamp = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        })

        document.getElementById("timestamp").innerText = timestamp;
    }

    static addNote(value) {
        const note = new Note();
        // If there is an argument, set the textarea's text to that argument
        note.textElem.value = (value !== undefined) ? value : "";
        this.noteArray.push(note);
        StringManager.loadClassStrings();
    }
}

document.getElementById("backButton").addEventListener("click", function() {
    window.location.replace('/lab1/')
})

NoteManager.initializeNotes();
StringManager.loadClassStrings();

setInterval(function() {NoteManager.initializeNotes()}, 2000);