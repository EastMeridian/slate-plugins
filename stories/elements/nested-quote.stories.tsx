import 'prismjs/themes/prism.css';
import React, { useMemo, useState } from 'react';
import { boolean } from '@storybook/addon-knobs';
import { CodeBlock } from '@styled-icons/boxicons-regular/CodeBlock';
import {
  FormatQuote,
  FormatListBulleted
} from '@styled-icons/material';
import {
  BlockquotePlugin,
  EditablePlugins,
  HeadingPlugin,
  HeadingToolbar,
  ListPlugin,
  SoftBreakPlugin,
  pipe,
  SlateDocument,
  SlatePlugin,
  ToolbarElement,
  withList,
  withBlockquote,
  ToolbarList
} from '@udecode/slate-plugins';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import { options } from '../config/initialValues';

export default {
  title: 'Elements/Nested Quote',
};

const initialValue = [
  {
    type: options.blockquote.type,
    children: [
      { type: options.p.type, children: [{ text: 'Salut list' }] },
    ],
  },
  {
    type: options.ul.type,
    children: [
      {
        type: options.li.type,
        children: [
          { type: options.p.type, children: [{ text: 'Bulleted list' }] },
          {
            type: options.ul.type,
            children: [
              {
                type: options.li.type,
                children: [
                  {
                    type: options.p.type,
                    children: [{ text: 'support' }],
                  },
                ],
              },
              {
                type: options.li.type,
                children: [
                  {
                    type: options.p.type,
                    children: [{ text: 'nesting' }],
                  },
                  {
                    type: options.ul.type,
                    children: [
                      {
                        type: options.li.type,
                        children: [
                          {
                            type: options.p.type,
                            children: [{ text: 'limitless' }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const plugins: SlatePlugin[] = [ListPlugin(options), BlockquotePlugin({...options}), SoftBreakPlugin({
  rules: [
    {
      hotkey: 'enter',
      query: {
        allow: [options.code_block.type, options.blockquote.type],
      },
    },
  ]
})
];

const withPlugins = [withReact, withHistory, withList(options), withBlockquote()] as const;

export const Example = () => {
  if (boolean('HeadingPlugin', true)) plugins.push(HeadingPlugin(options));

  const createReactEditor = () => () => {
    const [value, setValue] = useState(initialValue);
    console.log('REACT EDITOR VALUE', value);
    const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

    return (
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          setValue(newValue as SlateDocument);
        }}
      >
        <HeadingToolbar>
          <ToolbarElement
            type={options.blockquote.type}
            icon={<FormatQuote />}
          />
          <ToolbarList
            {...options}
            typeList={options.ul.type}
            icon={<FormatListBulleted />}
          />
        </HeadingToolbar>
        <EditablePlugins
          plugins={plugins}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
        />
      </Slate>
    );
  };

  const Editor = createReactEditor();

  return <Editor />;
};
