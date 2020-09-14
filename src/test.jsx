import React, { useCallback, useMemo, useState } from 'react';
import ReactDOM from "react-dom"
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { Editor, Transforms, createEditor, Node } from 'slate'
import { withHistory } from 'slate-history'
import "./index.scss"

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

const LIST_TYPES = [ 'numbered-list', 'bulleted-list' ]

const RichTextExample = () => {
    const [ value, setValue ] = useState(deserialize(""))
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])


    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    return (
        <div className="chat-input">
            <Slate editor={editor} value={value} onChange={value => setValue(value)}>
                <Editable
                    className="editor"
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Enter some rich text…"
                    spellCheck
                    autoFocus
                    onKeyDown={event => {
                        for (const hotkey in HOTKEYS) {
                            if (isHotkey(hotkey, event)) {
                                event.preventDefault()
                                const mark = HOTKEYS[ hotkey ]
                                toggleMark(editor, mark)
                            }
                        }
                    }}
                />
            </Slate>
            <div className="tool-bar">
                <div className="option">
                    <b>B</b>
                </div>
                <div className="option">
                    <i>I</i>
                </div>
                <div className="option">
                    <u>U</u>
                </div>
            </div>
        </div>
    )
}

const serialize = value => {
    return (
        value
            .map(n => Node.string(n))
            .join('\n')
    )
}

const deserialize = string => {
    return string.split('\n').map(line => {
        return {
            children: [ { text: line } ],
        }
    })
}

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: n => LIST_TYPES.includes(n.type),
        split: true,
    })

    Transforms.setNodes(editor, {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    })

    if (!isActive && isList) {
        const block = { type: format, children: [] }
        Transforms.wrapNodes(editor, block)
    }
}

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isBlockActive = (editor, format) => {
    const [ match ] = Editor.nodes(editor, {
        match: n => n.type === format,
    })

    return !!match
}

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[ format ] === true : false
}

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
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
            return <p {...attributes}>{children}</p>
    }
}

const Leaf = ({ attributes, children, leaf }) => {
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

const BlockButton = ({ format, icon }) => {
    const editor = useSlate()
    return (
        <button
            active={isBlockActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            <span>O</span>
        </button>
    )
}

const MarkButton = ({ format, icon }) => {
    const editor = useSlate()
    return (
        <button
            // active={isMarkActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            <span>O</span>
        </button>
    )
}

ReactDOM.render(<RichTextExample />, document.getElementById('root'));
