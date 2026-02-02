exports.NOTHING_TO_WRITE = "Nothing to write"
exports.DEFAULT_USERNAME = "User"

exports.greeting = function(nameQuery, date) {
    return `Hello ${nameQuery}. Server current date and time is ${date}.`
}

exports.successfulWrite = function(content, readfile) {
    return `Successfully wrote "${content}" to ${readfile}file.txt.`
}

exports.fileNotFound = function(file) {
    return `${file} - 404 not found`
}