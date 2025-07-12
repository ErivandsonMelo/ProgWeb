// src/views/helpers/helpers.ts
import Handlebars from 'handlebars';

// Add equality helper for comparisons in Handlebars templates
export function eq(this: any, arg1: any, arg2: any, options: Handlebars.HelperOptions) {
    return arg1 == arg2;
}

// Helper for technologies (Task 8)
export function listNodejsTechnologies(technologies: any[], options: Handlebars.HelperOptions) {
    let result = '<ul>';
    technologies.forEach(tech => {
        if (tech.poweredByNodejs) {
            result += `<li>${tech.name} - ${tech.type}</li>`;
        }
    });
    result += '</ul>';
    return new Handlebars.SafeString(result);
}

// NOVO HELPER: sum - para somar números no template Handlebars
export function sum(...args: number[]): number {
    // O último argumento em Handlebars helpers é sempre o objeto options
    // Opcionalmente, pode-se filtrar ou apenas somar os primeiros N argumentos
    const options = args.pop(); // Remove o objeto options do array, se presente
    let total = 0;
    for (const num of args) {
        if (typeof num === 'number') {
            total += num;
        }
    }
    return total;
}