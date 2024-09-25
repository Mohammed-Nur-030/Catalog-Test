/**
 * @class Lagrange polynomial interpolation.
 * The computed interpolation polynomial will be referred to as L(x).
 * @example
 * const points = [{x:0, y:0}, {x:0.5, y:0.8}, {x:1, y:1}];
 * const polynomial = new Lagrange(points);
 * console.log(polynomial.evaluate(0.1));
 */
class Lagrange {
    constructor(points) {
      const ws = (this.ws = []);
      const xs = (this.xs = []);
      const ys = (this.ys = []);
      if (points && points.length) {
        this.k = points.length;
        points.forEach(({ x, y }) => {
          xs.push(x);
          ys.push(y);
        });
        for (let w, j = 0; j < this.k; j++) {
          w = 1;
          for (let i = 0; i < this.k; i++) if (i !== j) w *= xs[j] - xs[i];
          ws[j] = 1 / w;
        }
      }
    }
  
    /**
     * Calculate L(x)
     */
    evaluate(x) {
      const { k, xs, ys, ws } = this;
      let a = 0,
        b = 0,
        c = 0;
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
  
  // Example usage
  const points = [
      { x: 1, y: 4 },
      { x: 2, y: 7 },
      { x: 3, y: 12 },
      { x: 6, y: 39 }
  ];
  
  const polynomial = new Lagrange(points);
  
  // Find the constant term c
  const constantTerm = polynomial.getConstantTerm();
  console.log(`Constant term (c) = ${constantTerm}`);
  
  // Validate polynomial at given points
  points.forEach(point => {
      const { x, y } = point;
      const yCalc = polynomial.evaluate(x);
      console.log(`f(${x}) = ${yCalc} (expected ${y})`);
  });
  
  // Test interpolation at an arbitrary point
  const testX = 4;
  console.log(`f(${testX}) = ${polynomial.evaluate(testX)}`);
  