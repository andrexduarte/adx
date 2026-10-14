import { Component, computed, signal, viewChild, ElementRef } from '@angular/core';
import { Entry } from '../../../core/content/models';
@Component({
  selector: 'app-story-viewer',
  templateUrl: './story-viewer.html',
  styleUrl: './story-viewer.scss',
})
export class StoryViewer {
  readonly selected = signal<Entry | null>(null);
  readonly index = signal(0);
  readonly image = computed(() => this.selected()?.images[this.index()]);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('viewer');
  open(story: Entry) {
    if (!story.images.length) return;
    this.selected.set(story);
    this.index.set(0);
    this.dialog().nativeElement.showModal();
  }
  close() {
    this.dialog().nativeElement.close();
    this.selected.set(null);
  }
  next() {
    const story = this.selected();
    if (story && this.index() < story.images.length - 1) this.index.update((i) => i + 1);
  }
  previous() {
    if (this.index() > 0) this.index.update((i) => i - 1);
  }
  backdrop(event: MouseEvent) {
    if (event.target === this.dialog().nativeElement) this.close();
  }
}
