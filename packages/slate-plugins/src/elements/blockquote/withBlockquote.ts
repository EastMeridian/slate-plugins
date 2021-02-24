import { ReactEditor } from 'slate-react';
import { Node, NodeEntry, Path } from 'slate';
import {  insertEmptyElement, setDefaults } from '../../common';
import { DEFAULTS_BLOCKQUOTE } from './defaults';
import { DEFAULTS_PARAGRAPH } from '../paragraph';

export const withBlockquote = () => <T extends ReactEditor>(editor: T) => {
  const { normalizeNode } = editor;
  const { blockquote, p } = setDefaults({}, { ...DEFAULTS_BLOCKQUOTE, ...DEFAULTS_PARAGRAPH });

  editor.normalizeNode = (entry: NodeEntry<Node>) => {
    const [node, path] = entry;
    if (node.type === blockquote.type) {
      const firstChild: Node = (node.children as Node[])?.[0];
      const firstChildPath: Path = path.concat([0]);      
      if (!firstChild || firstChild.type !== p.type) {
        insertEmptyElement(editor, p.type, { at: firstChildPath });
      }
    }
    normalizeNode([node, path]);
  }


  return editor;
};
