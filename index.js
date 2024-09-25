const fs = require('fs');

// Function to convert a string in a given base to an integer
function convertBaseToInt(value, base) {
    return parseInt(value, base);
}

// Function to generate the polynomial string
function generatePolynomialString(coefficients) {
    let polynomial = '';
    const degree = coefficients.length - 1;

    for (let i = 0; i <= degree; i++) {
        const coef = coefficients[i];
        const power = degree - i;

        if (coef !== 0) {
            if (polynomial.length > 0 && coef > 0) {
                polynomial += ' + ';
            } else if (coef < 0) {
                polynomial += ' - ';
            }

            const absCoef = Math.abs(coef);
            if (absCoef !== 1 || power === 0) {
                polynomial += absCoef;
            }

            if (power > 0) {
                polynomial += 'x';
                if (power > 1) {
                    polynomial += '^' + power;
                }
            }
        }
    }

    return polynomial;
}

// Read the JSON input from the file
const input = JSON.parse(fs.readFileSync('testcase.json', 'utf-8'));

// Extract n and k
const n = input.keys.n;
const k = input.keys.k;

// Extract the roots and decode Y values
let points = [];
for (let key in input) {
    if (key !== 'keys') {
        const x = parseInt(key, 10);
        const base = parseInt(input[key].base, 10);
        const y = convertBaseToInt(input[key].value, base);
        points.push({ x, y });
    }
}

/**
 * @class Lagrange polynomial interpolation.
 */
class Lagrange {
    constructor(points) {
        this.ws = [];
        this.xs = [];
        this.ys = [];
        if (points && points.length) {
            this.k = points.length;
            points.forEach(({ x, y }) => {
                this.xs.push(x);
                this.ys.push(y);
            });
            for (let w, j = 0; j < this.k; j++) {
                w = 1;
                for (let i = 0; i < this.k; i++) if (i !== j) w *= this.xs[j] - this.xs[i];
                this.ws[j] = 1 / w;
            }
        }
    }

    /**
     * Calculate L(x)
     */
    evaluate(x) {
        const { k, xs, ys, ws } = this;
        let a = 0, b = 0, c = 0;
        for (let j = 0; j < k; j++) {
            if (x === xs[j]) return ys[j];
            a = ws[j] / (x - xs[j]);
            b += a * ys[j];
            c += a;
        }
        return b / c;
    }

    /**
     * Calculate the constant term (c) of the polynomial
     */
    getConstantTerm() {
        return this.evaluate(0); // The constant term is f(0)
    }
}

// Create a new instance of Lagrange polynomial with the points
const polynomial = new Lagrange(points);

// Find the constant term c
const constantTerm = polynomial.getConstantTerm();
console.log(`Constant term (c) = ${constantTerm}`);

// Validate polynomial at given points
points.forEach(point => {
    const { x, y } = point;
    const yCalc = polynomial.evaluate(x);
    // console.log(`f(${x}) = ${yCalc} (expected ${y})`);
});

// Test interpolation at an arbitrary point
const testX = 4; // Change this value for different test points
// console.log(`f(${testX}) = ${polynomial.evaluate(testX)}`);
