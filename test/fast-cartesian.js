"use strict";
(() => {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = void 0;
    /**
     * Bundled by jsDelivr using Rollup v2.74.1 and Terser v5.15.1.
     * Original file: /npm/fast-cartesian@7.6.0/build/src/main.js
     *
     * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
     */
    const r = r => {
            if (!Array.isArray(r)) throw new TypeError(`Argument must be an array: ${r}`);
        },
        e = ({
                 length: r
             }) => {
            if (r >= n) throw new TypeError(`Too many arrays (${r}): please use the 'big-cartesian' library instead of 'fast-cartesian'`);
        },
        n = 100,
        a = r => {
            const e = r.reduce(t, 1);
            if (e >= o) {
                const r = Number.isFinite(e) ? ` (${e.toExponential(0)})` : "";
                throw new TypeError(`Too many combinations${r}: please use the 'big-cartesian' library instead of 'fast-cartesian'`);
            }
        },
        t = (r, e) => r * e.length,
        o = 2 ** 32,
        s = n => {
            (n => {
                if (!Array.isArray(n)) throw new TypeError("Argument must be an array of arrays");
                n.forEach(r), e(n), a(n);
            })(n);
            const t = [];
            if (0 === n.length) return t;
            return i(n.length)(n, t), t;
        },
        i = r => {
            const e = u[r];
            if (void 0 !== e) return e;
            const n = y(r);
            return u[r] = n, n;
        },
        u = {},
        y = r => {
            const e = Array.from({
                    length: r
                }, c),
                n = e.map(r => `for (const value${r} of arrays[${r}]) {`).join("\n"),
                a = e.map(r => `value${r}`).join(", "),
                t = "}\n".repeat(r);
            return new Function("arrays", "result", `${n}\nresult.push([${a}])\n${t}`);
        },
        c = (r, e) => String(e);
    exports.default = s;
})()
