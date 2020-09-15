import React from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';

export const LeafOption = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <div className={`option ${isLeafHasFormat(editor, format) && "active"}`} onMouseDown={event => {
            event.preventDefault();
            changeLeafFormat(editor, format);
        }}>
            <span>{icon}</span>
        </div>
    )
}

export const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

export const isLeafHasFormat = (editor, format) => {
    const styles = Editor.marks(editor);
    return styles ? styles[ format ] === true : false;
}

export const changeLeafFormat = (editor, format) => {
    const isActive = isLeafHasFormat(editor, format)
    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}