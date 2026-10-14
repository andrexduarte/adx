import {
  Component,
  afterNextRender,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import type { Editor } from '@tiptap/core';
@Component({
  selector: 'app-rich-editor',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './rich-editor.html',
  styleUrl: './rich-editor.scss',
})
export class RichEditor {
  readonly value = input('');
  readonly disabled = input(false);
  readonly changed = output<string>();
  readonly editor = signal<Editor | null>(null);
  readonly linkOpen = signal(false);
  readonly linkValue = signal('');
  readonly linkError = signal('');
  private readonly version = signal(0);
  private readonly surface = viewChild.required<ElementRef<HTMLElement>>('surface');
  private readonly destroyRef = inject(DestroyRef);
  constructor() {
    afterNextRender(async () => {
      const [{ Editor }, { default: StarterKit }, { default: Image }] = await Promise.all([
        import('@tiptap/core'),
        import('@tiptap/starter-kit'),
        import('@tiptap/extension-image'),
      ]);
      if (this.destroyRef.destroyed) return;
      this.editor.set(
        new Editor({
          element: this.surface().nativeElement,
          extensions: [
            StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }),
            Image.extend({
              addAttributes() {
                return {
                  ...this.parent?.(),
                  storagePath: {
                    default: null,
                    parseHTML: (element) => element.getAttribute('data-storage-path'),
                    renderHTML: (attributes) =>
                      attributes['storagePath']
                        ? { 'data-storage-path': attributes['storagePath'] }
                        : {},
                  },
                };
              },
            }).configure({ allowBase64: true }),
          ],
          content: this.value() || '<p></p>',
          editorProps: {
            attributes: {
              role: 'textbox',
              'aria-label': 'Corpo do texto',
              'aria-multiline': 'true',
            },
          },
          onUpdate: ({ editor }) => {
            this.changed.emit(editor.getHTML());
            this.version.update((v) => v + 1);
          },
          onSelectionUpdate: () => this.version.update((v) => v + 1),
        }),
      );
    });
    effect(() => {
      const value = this.value();
      const editor = this.editor();
      if (editor && editor.getHTML() !== value)
        editor.commands.setContent(value || '<p></p>', { emitUpdate: false });
    });
    effect(() => this.editor()?.setEditable(!this.disabled(), false));
    this.destroyRef.onDestroy(() => this.editor()?.destroy());
  }
  isActive(name: string) {
    this.version();
    return this.editor()?.isActive(name) || false;
  }
  insertImage(src: string, alt: string) {
    this.editor()?.chain().focus().setImage({ src, alt }).run();
  }
  imageAlt() {
    this.version();
    return this.editor()?.getAttributes('image')['alt'] || '';
  }
  setImageAlt(event: Event) {
    this.editor()?.commands.updateAttributes('image', {
      alt: (event.target as HTMLInputElement).value,
    });
  }
  toggleLink() {
    this.linkValue.set(this.editor()?.getAttributes('link')['href'] || '');
    this.linkError.set('');
    this.linkOpen.update((open) => !open);
  }
  applyLink(value: string) {
    try {
      const url = new URL(value.trim());
      if (!['https:', 'http:', 'mailto:'].includes(url.protocol) || url.username || url.password)
        throw new Error();
      this.editor()
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url.href, rel: 'noopener noreferrer' })
        .run();
      this.linkOpen.set(false);
    } catch {
      this.linkError.set('Use um endereço que comece com https://, http:// ou mailto:.');
    }
  }
  removeLink() {
    this.editor()?.chain().focus().extendMarkRange('link').unsetLink().run();
    this.linkOpen.set(false);
  }
  command(command: string) {
    const chain = this.editor()?.chain().focus();
    if (!chain) return;
    switch (command) {
      case 'bold':
        chain.toggleBold().run();
        break;
      case 'italic':
        chain.toggleItalic().run();
        break;
      case 'heading':
        chain.toggleHeading({ level: 2 }).run();
        break;
      case 'list':
        chain.toggleBulletList().run();
        break;
      case 'quote':
        chain.toggleBlockquote().run();
        break;
      case 'code':
        chain.toggleCodeBlock().run();
        break;
      case 'undo':
        chain.undo().run();
        break;
      case 'redo':
        chain.redo().run();
    }
  }
}
