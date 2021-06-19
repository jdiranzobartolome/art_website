
// Compose and pipe functions
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

const pipe= (...fns) => fns.reduceRight((f, g) => (...args) => f(g(...args)))