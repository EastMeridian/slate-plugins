/** @jsx jsx */

import { Editor } from 'slate';
import { withReact } from 'slate-react';
import { jsx } from '../../__test-utils__/jsx';
import { withInlineVoid } from '../../common/plugins/inline-void/withInlineVoid';
import { ELEMENT_LINK } from '../link/defaults';
import { withBlockquote } from './index';

describe('normalizeBlockquote', () => {
  it('should insert a p', () => {
    const input = ((
      <editor>
        <hblockquote>tes<cursor /></hblockquote>
      </editor>
    ) as any) as Editor;

    const expected = ((
      <editor>
        <blockquote><hp>test</hp></blockquote>
      </editor>
    ) as any) as Editor;

    const editor = withBlockquote()(
      withInlineVoid({ inlineTypes: [ELEMENT_LINK] })(withReact(input))
    );

    editor.insertText('t');

    expect(editor.children).toEqual(expected.children);
  });
});
