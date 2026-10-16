import { Component, inject, computed } from '@angular/core';
import { ContentStore } from '../../core/content/content-store';
import { Seo } from '../../core/seo/seo';
import { Timeline } from '../timeline/timeline';
import { InterfaceWorkshop } from './interface-workshop/interface-workshop';
import { ArenaStory } from './arena-story/arena-story';
import { ProjectStory } from './personal-projects/project-story';
import { PERSONAL_PROJECTS } from './personal-projects/project-data';

@Component({
  imports: [Timeline, InterfaceWorkshop, ArenaStory, ProjectStory],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly projects = PERSONAL_PROJECTS;
  private readonly content = inject(ContentStore);
  readonly hasJourney = computed(() => this.content.entries().some(
    (entry) => entry.kind === 'moment' && entry.status === 'published' && entry.slug !== 'agora',
  ));
  constructor() {
    inject(Seo).set('André Duarte',
      'Desenvolvedor Front-end. Angular, TypeScript e RxJS. Interfaces acessíveis, performáticas e código sustentável.');
  }
}
