const fs = require('fs');

// Function to decode the base-encoded values
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Function to perform Gaussian elimination to solve the system of equations
function gaussianElimination(matrix) {
    const n = matrix.length;

    // Forward elimination
    for (let i = 0; i < n; i++) {
        // Pivoting
        for (let j = i + 1; j < n; j++) {
            if (matrix[j][i] > matrix[i][i]) {
                [matrix[i], matrix[j]] = [matrix[j], matrix[i]]; // Swap rows
            }
        }

        // Make the current row's leading coefficient 1
        const divisor = matrix[i][i];
        for (let j = 0; j <= n; j++) {
            matrix[i][j] /= divisor;
        }

        // Eliminate column entries below the current row
        for (let j = i + 1; j < n; j++) {
            const factor = matrix[j][i];
            for (let k = 0; k <= n; k++) {
                matrix[j][k] -= factor * matrix[i][k];
            }
        }
    }

    // Back substitution
    const coefficients = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        coefficients[i] = matrix[i][n]; // Get the solution from the last column
        for (let j = i + 1; j < n; j++) {
            coefficients[i] -= matrix[i][j] * coefficients[j];
        }
    }

    return coefficients;
}

// Read and parse the JSON input
const input = JSON.parse(fs.readFileSync('testcase.json'));

// Extract the number of roots (n) and required roots (k)
const n = input.keys.n;
const k = input.keys.k;

// Prepare the points array (x, y) after decoding y-values
let points = [];
for (const key in input) {
    if (key === 'keys') continue;

    const x = parseInt(key, 10);
    const base = parseInt(input[key].base, 10);
    const value = input[key].value;
    const y = decodeValue(value, base);
    points.push([x, y]);
}

// Ensure we have at least k points
if (points.length >= k) {
    const matrix = Array.from({ length: k }, () => new Array(k + 1).fill(0));

    // Fill the Vandermonde matrix
    for (let i = 0; i < k; i++) {
        for (let j = 0; j < k; j++) {
            matrix[i][j] = Math.pow(points[i][0], j); // x^j
        }
        matrix[i][k] = points[i][1]; // y value
    }

    // Perform Gaussian elimination to solve the matrix
    const coefficients = gaussianElimination(matrix);

    // The constant term c will be the first coefficient
    console.log(`The constant term c is: ${coefficients[0]}`);
} else {
    console.error(`Insufficient points: required ${k}, but only ${points.length} provided.`);
}
