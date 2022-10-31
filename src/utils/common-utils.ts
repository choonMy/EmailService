function isUndefinedOrNullOrEmpty(v: any) {
    if (isUndefinedOrNull(v)) {
        return true;
    }
    if ("string" === typeof (v)) {
        if (0 >= v.length) {
            return true;
        }
    }
    else if (Array.isArray(v)) {
        if (0 >= v.length) {
            return true;
        }
    }
    else if ("object" === typeof (v)) {
        if (0 >= Object.keys(v).length) {
            return true;
        }
    }
    return false;
}

function isUndefinedOrNull(v: any) {
    return (undefined === v || null === v || ("number" === typeof v && isNaN(v)));
}

export { isUndefinedOrNullOrEmpty, isUndefinedOrNull }