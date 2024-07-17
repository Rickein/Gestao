const { format } = require('date-fns');
const { Timestamp } = require('firebase/firestore');

function formatDate(timestamp) {
    const date = timestamp.toDate();
    return format(date, 'dd/MM/yyyy');
}

function formatDateHR(timestamp) {
    const date = timestamp.toDate();
    return format(date, 'dd/MM/yyyy HH:mm');
}

function stringToTimestamp(dateString) {
    const [day, month, year, hours, minutes] = dateString.split(/[/ :]/).map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);
    return Timestamp.fromDate(date);
}

function parseDateString(dateString) {
    var [datePart, timePart] = dateString.split(' ');
    var [day, month, year] = datePart.split('/');
    var [hours, minutes] = timePart.split(':');
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
}


module.exports = { formatDate,formatDateHR,stringToTimestamp,parseDateString};