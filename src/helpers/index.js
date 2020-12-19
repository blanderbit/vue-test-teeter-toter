
/**
 *
 * get random number
 *
 */


export const getRandomNumber = (max, min = 0) =>  Math.round(Math.random() * (max - min) + min);


/**
 *
 * get available width by count shapes
 * this is a stabilizer for a random weight, made so that large weights do not appear immediately,
 * and do not end the game when it starts
 *
 */

const defaultLevel = 4;

const levelObject = (check, value) => ({ check, value });

const weightLevel = [
    (shapesCount) => levelObject(shapesCount <= 3, 5) ,
    (shapesCount) => levelObject(shapesCount <= 4, 6) ,
    (shapesCount) => levelObject(shapesCount <= 6, 7) ,
    (shapesCount) => levelObject(shapesCount <= 8, 9) ,
    (shapesCount) => levelObject(shapesCount <= 10, 5) ,
    (shapesCount) => levelObject(shapesCount >= 11, 10) ,
];


export function availableWeight(shapesCount = 0) {
    const data = [...weightLevel]
        .find((func) => func(shapesCount).check)();

    return data ? data.value : defaultLevel
}


/**
 *
 * clear All timeout by object
 *
 */

export const clearTimeouts = (object) => {
    Object
        .values(object)
        .forEach(item => clearTimeout(item))
};


/**
 *
 * create UUID
 *
 */
function dec2hex(dec) {
    return dec
        .toString(16)
        .padStart(2, '0');
}

function generateSimpleUUID() {
    return Math
        .random()
        .toString(36)
        .substr(2, 5);
}


export function generateUUID(len) {
    if (!window.crypto) {
        return generateSimpleUUID();
    }

    const arr = new Uint8Array((len || 40) / 2);

    return Array
        .from(window.crypto.getRandomValues(arr), dec2hex)
        .join('');
}
