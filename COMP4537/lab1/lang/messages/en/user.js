const ID_STRINGS = [
    ["titleMessage", "Lab 1: JSON, Object Constructor, localStorage"],
    ["studentName", "Marcy Ordinario"],
    ["writerButton", "writer.html"],
    ["readerButton", "reader.html"],
    ["backButton", "Back"],
    ["addButton", "Add"],
    ["savedAt", "Saved at: "],
    ["updatedAt", "Updated at: "],
]

const CLASS_STRINGS = [
    ["removeButton", "Remove"]
]

class StringManager {
    static loadIdStrings() {
        ID_STRINGS.forEach(str => {
            const elem = document.getElementById(str[0]);
            if(elem !== null) {
                elem.innerText = str[1];
            }
        })
    }

    static loadClassStrings() {
        CLASS_STRINGS.forEach(str => {
            const elemsCollection = document.getElementsByClassName(str[0]);
            const elemsArray = Array.from(elemsCollection);
            if(elemsArray !== null && elemsArray.length !== 0) {
                elemsArray.forEach(elem => {elem.innerText = str[1];})
            }
        })
    }
}

StringManager.loadIdStrings();
StringManager.loadClassStrings();