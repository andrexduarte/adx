import { Component, inject, viewChild, afterNextRender } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ContentStore } from '../../core/content/content-store';
import { Entry } from '../../core/content/models';
import { Seo } from '../../core/seo/seo';
import { StoryViewer } from './story-viewer/story-viewer';
@Component({
  imports: [NgOptimizedImage, StoryViewer],
  templateUrl: './stories.html',
  styleUrl: './stories.scss',
})
export class Stories {
  readonly content = inject(ContentStore);
  private readonly viewer = viewChild.required(StoryViewer);
  constructor() {
    inject(Seo).set(
      'Fora da tela',
      'Pequenos registros de cavalos, cerrado e histórias pelo caminho.',
      '/stories',
    );
    const route = inject(ActivatedRoute);
    afterNextRender(() => {
      const slug = route.snapshot.queryParamMap.get('story');
      const story = this.content.stories().find((s) => s.slug === slug);
      if (story) this.open(story);
    });
  }

  open(story: Entry) {
    this.viewer().open(story);
  }
}
