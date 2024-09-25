const fs = require('fs');

// Function to convert a string in a given base to an integer
function convertBaseToInt(value, base) {
    return parseInt(value, base);
}

// Function to read the JSON input from the file
function readInput(filename) {
    const input = JSON.parse(fs.readFileSync(filename, 'utf-8'));
    
    const n = input.keys.n;
    const k = input.keys.k;
    let points = [];

    for (let key in input) {
        if (key !== 'keys') {
            const x = parseInt(key, 10);
            const base = parseInt(input[key].base, 10);
            const y = convertBaseToInt(input[key].value, base);
            points.push({ x, y });
        }
    }

    return { n, k, points };
}

// Function to evaluate the Lagrange polynomial at a given x
function lagrangeEvaluate(points, x) {
    const k = points.length;
    let b = 0, c = 0;

    for (let j = 0; j < k; j++) {
        const { x: xsj, y: ysj } = points[j];
        
        if (x === xsj) return ysj; // Return the value if x matches an x in the points

        let a = 1;
        for (let i = 0; i < k; i++) {
            if (i !== j) {
                a *= (x - points[i].x) / (xsj - points[i].x);
            }
        }

        b += a * ysj;
        c += a;
    }

    return b / c;
}

// Function to calculate the constant term of the polynomial
function getConstantTerm(points) {
    return lagrangeEvaluate(points, 0); // The constant term is f(0)
}

// Main execution
const { n, k, points } = readInput('testcase.json');

// Find the constant term c
const constantTerm = getConstantTerm(points);
console.log(`Constant term (c) = ${constantTerm}`);


