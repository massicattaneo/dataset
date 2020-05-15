export default async function (target, errors) {
    const { field, error } = errors[0];
    const element = target[field];
    Object.assign(error, { placeholder: element.getAttribute('data-placeholder') });
    element.focus();
    return Promise.reject(error);
}