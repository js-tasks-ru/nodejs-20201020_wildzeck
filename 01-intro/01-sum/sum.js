function isNumber(item) {
    return typeof item === 'number';
}

function sum(a, b) {
    for (arg of arguments) {
        if (!isNumber(arg)) throw new TypeError();
    }

    return a + b;
}

module.exports = sum;
