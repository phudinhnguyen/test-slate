import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactDOM from "react-dom";

import { Editable, withReact, useSlate, Slate, useEditor } from 'slate-react'
import { Editor, Transforms, createEditor, Node, Text } from 'slate'
import { withHistory } from 'slate-history';

import { generateNodeToHtml, convertStringToNode } from './generateToHtml';
import { ElementOption, Element } from './handleElement';
import { LeafOption, Leaf, changeLeafFormat } from './handleLeaf';

import isHotkey from 'is-hotkey'
import { HOTKEYS } from './config';

import "./index.scss";

const RichTextExample = () => {
    const [ value, setValue ] = useState(convertStringToNode(""))
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    useEffect(() => {
        const html = generateNodeToHtml(value[ 0 ]);
        console.log(html);
    }, [ value ])

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
                                changeLeafFormat(editor, mark)
                            }
                        }
                    }}
                />
                <div className="tool-bar">
                    <LeafOption format="bold" icon={"B"} />
                    <LeafOption format="italic" icon={"I"} />
                    <LeafOption format="underline" icon={"U"} />
                    <LeafOption format="code" icon="</>" />
                    <ElementOption format="heading-one" icon="h1" />
                    <ElementOption format="heading-two" icon="h2" />
                    <ElementOption format="numbered-list" icon={<img src="https://img.icons8.com/fluent-systems-regular/24/000000/numbered-list.png" />} />
                    <ElementOption format="bulleted-list" icon={<img src="https://img.icons8.com/ios-filled/24/000000/bulleted-list.png" />} />
                </div>
            </Slate>
        </div>
    )
}


ReactDOM.render(<RichTextExample />, document.getElementById('root'));
