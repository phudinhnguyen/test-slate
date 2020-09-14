import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactDOM from "react-dom"
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate, useEditor } from 'slate-react'
import { Editor, Transforms, createEditor, Node } from 'slate'
import { withHistory } from 'slate-history';
import "./index.scss"

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

const LIST_TYPES = [ 'numbered-list', 'bulleted-list' ]

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

const RichTextExample = () => {
    const [ value, setValue ] = useState(deserialize(""))
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])


    const BlockOption = ({ format, icon }) => {
        return (
            <div className={`option ${isBlockActive(editor, format) && "active"}`} onMouseDown={event => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}>
                <span>{icon}</span>
            </div>
        )
    }

    const MarkOption = ({ format, icon }) => {
        return (
            <div className={`option ${isMarkActive(editor, format) && "active"}`} onMouseDown={event => {
                event.preventDefault();
                toggleMark(editor, format);
            }}>
                <span>{icon}</span>
            </div>
        )
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

    return (
        <div className="chat-input">
            <Slate editor={editor} value={value} onChange={value => setValue(value)}>
                <Editable
                    className="editor"
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Send message to vc-team..."
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
                <MarkOption format="bold" icon={"B"} />
                <MarkOption format="italic" icon={"I"} />
                <MarkOption format="underline" icon={"U"} />
                <MarkOption format="code" icon="</>" />
                <BlockOption format="heading-one" icon="h1" />
                <BlockOption format="heading-two" icon="h2" />
                <BlockOption format="numbered-list" icon={<img src="https://img.icons8.com/fluent-systems-regular/24/000000/numbered-list.png" />} />
                <BlockOption format="bulleted-list" icon={<img src="https://img.icons8.com/ios-filled/24/000000/bulleted-list.png" />} />
            </div>
        </div>
    )
}


ReactDOM.render(<RichTextExample />, document.getElementById('root'));
