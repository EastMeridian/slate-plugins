import { ReactEditor } from 'slate-react';
import { Node, Path, Transforms } from 'slate';
import { getAbove, insertEmptyElement, setDefaults } from '../../common';
import { DEFAULTS_BLOCKQUOTE } from './defaults';
import { someNode } from '../../common/queries/someNode';
import { DEFAULTS_PARAGRAPH } from '../paragraph';
import { match } from '../../../common/utils/match';

export const withBlockquote = () => <T extends ReactEditor>(editor: T) => {
  const { insertData, insertText, normalizeNode } = editor;
  const { blockquote, p } = setDefaults({}, { ...DEFAULTS_BLOCKQUOTE, ...DEFAULTS_PARAGRAPH });

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain');
    if (text) {
      if (someNode(editor, { match: { type: blockquote.type } })) {
        const current = getAbove(editor);
        Transforms.insertNodes(
          editor,
          {
            type: p.type,
            children: [{ type: p.type, children: [{ text: '' }] }],
          },
          { at: Path.next(current?.[1] as Path), select: true }
        )
        return insertData(data);
      }
    }

    insertData(data);
  };

  editor.normalizeNode = (entry) => {
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
