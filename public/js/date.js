module.exports = function() {
    const today = new Date();
    let n = today.getDay();

    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'   
    }

    day = today.toLocaleDateString('en-UK', options);
    return day;
}