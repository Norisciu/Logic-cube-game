export const randomFromList  =  list => {
    let randomIdx  = Math.floor(Math.random() * list.length);
    return list[randomIdx];
}

export let randomBetween  = (low  , high) => {
    if (low > high) { return randomBetween(high , low)}
    let difference  = high - low;
    let result = low + Math.floor(Math.random() *  (difference + 1));
    return result;
}

export const clamp  = (low , value , high) => {
    if (value < low) { return low; }
    if (value > high) { return high; }

    return value;
}