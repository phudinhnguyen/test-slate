import { Text } from "slate";

export const generateNodeToHtml = node => {
    if (Text.isText(node)) {
        return generateLeafToHtml(node);
    }

    const children = node.children.map(n => {
        return generateNodeToHtml(n)
    }).join('');

    return generateElementToHtml(node.type, children);
}

export const convertStringToNode = string => {
    return string.split('\n').map(line => {
        return {
            children: [ { text: line } ],
        }
    })
}

export const generateElementToHtml = (type, children) => {
    switch (type) {
        case 'bulleted-list':
            return `<ul>${children}</ul>`
        case 'heading-one':
            return `<h1>${children}</h1>`
        case 'heading-two':
            return `<h2>${children}</h2>`
        case 'list-item':
            return `<li>${children}</li>`
        case 'numbered-list':
            return `<ol>${children}</ol>`
        default:
            return `<span>${children}</span>`
    }
}

export const generateLeafToHtml = (node) => {
    if (!node) return;

    let children = node.text;

    if (node.bold) {
        children = `<strong>${children}</strong>`
    }

    if (node.code) {
        children = `<code>${children}</code>`
    }

    if (node.italic) {
        children = `<em>${children}</em>`
    }

    if (node.underline) {
        children = `<u>${children}</u>`
    }

    return children
}