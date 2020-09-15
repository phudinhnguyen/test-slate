import React from 'react';
import { Editor, Transforms } from 'slate';
import { useSlate } from "slate-react";
import { LIST_TYPES } from "./config";

export const ElementOption = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <div className={`option ${isElementHasFormat(editor, format) && "active"}`} onMouseDown={event => {
            event.preventDefault()
            changeElementFormat(editor, format)
        }}>
            <span>{icon}</span>
        </div>
    )
}

export const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        default:
            return <span {...attributes}>{children}</span>
    }
}

export const isElementHasFormat = (editor, format) => {
    const [ match ] = Editor.nodes(editor, {
        match: n => n.type === format,
    })

    return !!match
}

export const changeElementFormat = (editor, format) => {
    const isActive = isElementHasFormat(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: n => LIST_TYPES.includes(n.type),
        split: true,
    })

    Transforms.setNodes(editor, {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    })

    if (!isActive && isList) {
        const element = { type: format, children: [] }
        Transforms.wrapNodes(editor, element)
    }
}