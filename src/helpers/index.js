import { Buffer } from "buffer";

const isNonEmptyString = str => {
    const valid_string = isValidString(str);
    return (valid_string && str !== '' && str.length > 0);
}

const isValidString = str => { return typeof (str) === 'string' }

const isNumeric = str => {
    if (!isValidString(str)) return false // we only process strings!
    // could also coerce to string: str = ""+str
    return !isNaN(str) && !isNaN(parseFloat(str))
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');
}

function convertToDate(dateString) {
    //  Convert a "dd/MM/yyyy" string into a Date object        
    if (isValidString(dateString)) {
        const d = dateString.split("/");
        const dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
        return dat;
    } 
    return new Date(dateString)
}

const isTokenExpired = token => {
    try {
        const { exp: expires } = getPayload(token);

        return Date.now() >= expires * 1000
    } catch (err) {
        console.error(err)
        return true
    }
}

const getPayload = token => {
    try {
        const [, payload] = token.split('.');
        return JSON.parse(Buffer.from(payload, 'base64').toString('ascii'));
    } catch (err) {
        console.error(err)
    }
}

export {
    formatDate,
    convertToDate,
    isNonEmptyString,
    isNumeric,
    isValidString,
    isTokenExpired
}