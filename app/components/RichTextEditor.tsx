"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Code from '@tiptap/extension-code';
import { useState } from 'react';
import { Editor } from '@tiptap/core';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const MenuButton = ({ 
    onClick, 
    isActive, 
    title, 
    children 
  }: { 
    onClick: () => void; 
    isActive: boolean; 
    title: string; 
    children: React.ReactNode; 
  }) => (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-md transition-all duration-200 ${
        isActive 
          ? 'bg-gray-200 !text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="border-b border-gray-200 p-4 bg-white rounded-t-lg">
      <div className="flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12.6 18H6V2h4.32c1.97 0 3.68.9 3.68 2.88 0 1.04-.52 1.92-1.28 2.4.76.48 1.28 1.36 1.28 2.4 0 1.98-1.71 2.88-3.68 2.88H6V18h6.6zM8.4 6.4h2.4c.8 0 1.44-.4 1.44-1.12 0-.72-.64-1.12-1.44-1.12H8.4v2.24zm0 5.6h2.4c.8 0 1.44-.4 1.44-1.12 0-.72-.64-1.12-1.44-1.12H8.4v2.24z"/>
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 2h8v2h-2.5l-3 12h2.5v2H2v-2h2.5l3-12H5V2h3z"/>
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 10h14v2H3v-2zm2-4h10v2H5V6zm0 8h10v2H5v-2z"/>
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 17h14v2H3v-2zm2-4h10v2H5v-2zm0-4h10v2H5V9zm0-4h10v2H5V5z"/>
            </svg>
          </MenuButton>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <span className="font-bold text-sm">H1</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <span className="font-bold text-sm">H2</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <span className="font-bold text-sm">H3</span>
          </MenuButton>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4h2v2H3V4zm0 5h2v2H3V9zm0 5h2v2H3v-2zm4-9h12v2H7V5zm0 5h12v2H7v-2zm0 5h12v2H7v-2z"/>
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4h2v2H3V4zm0 5h2v2H3V9zm0 5h2v2H3v-2zm4-9h12v2H7V5zm0 5h12v2H7v-2zm0 5h12v2H7v-2z"/>
            </svg>
          </MenuButton>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4h14v2H3V4zm0 5h10v2H3V9zm0 5h12v2H3v-2z"/>
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4h14v2H3V4zm2 5h10v2H5V9zm1 5h8v2H6v-2z"/>
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4h14v2H3V4zm4 5h10v2H7V9zm2 5h10v2H9v-2z"/>
            </svg>
          </MenuButton>
        </div>

        {/* Special Elements */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote Block"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4h2v2H3V4zm0 5h2v2H3V9zm0 5h2v2H3v-2zm4-9h12v2H7V5zm0 5h12v2H7v-2zm0 5h12v2H7v-2z"/>
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4h2v2H3V4zm0 5h2v2H3V9zm0 5h2v2H3v-2zm4-9h12v2H7V5zm0 5h12v2H7v-2zm0 5h12v2H7v-2z"/>
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4h2v2H3V4zm0 5h2v2H3V9zm0 5h2v2H3v-2zm4-9h12v2H7V5zm0 5h12v2H7v-2zm0 5h12v2H7v-2z"/>
            </svg>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            isActive={false}
            title="Horizontal Rule"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 10h14v2H3v-2z"/>
            </svg>
          </MenuButton>
        </div>

        {/* Links and Images */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => setShowLinkInput(!showLinkInput)}
            isActive={editor.isActive('link')}
            title="Add Link"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414-1.414l-3-3z"/>
              <path d="M10.293 12.707a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414z"/>
            </svg>
          </MenuButton>
          <MenuButton
            onClick={addImage}
            isActive={false}
            title="Add Image"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
            </svg>
          </MenuButton>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900"
            />
            <button
              onClick={setLink}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setShowLinkInput(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight,
      CodeBlock,
      Blockquote,
      HorizontalRule,
      ListItem,
      OrderedList,
      BulletList,
      Heading,
      Paragraph,
      Bold,
      Italic,
      Strike,
      Code,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none p-4 min-h-[400px] prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-gray-900 prose-a:underline hover:prose-a:text-black prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:bg-gray-100 prose-blockquote:py-2 prose-blockquote:px-4 prose-img:rounded-lg prose-img:shadow-lg',
      },
    },
  });

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
} 