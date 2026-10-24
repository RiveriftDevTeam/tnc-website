/** "{name}" -> value */
export function fill(s, vars = {}) { return String(s).replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`)); }
