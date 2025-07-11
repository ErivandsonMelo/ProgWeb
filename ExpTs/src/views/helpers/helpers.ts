// src/views/helpers/helpers.ts
// Add equality helper for comparisons in Handlebars templates
export function eq(arg1: any, arg2: any, options: Handlebars.HelperOptions) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
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
    return new options.handlebars.SafeString(result);
}