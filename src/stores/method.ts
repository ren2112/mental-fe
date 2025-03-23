export function isEmpty(obj: any): boolean {
    if (typeof obj === "string") {
        return obj.length === 0
    } else if (obj instanceof Array) {
        return obj.length === 0
    } else if (obj instanceof Set) {
        return obj.size === 0
    } else if (obj === null) {
        return true
    } else if (obj === undefined) {
        return true
    } else {
        return false
    }
}