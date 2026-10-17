import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PersonalProject } from './project-data';
import { TechnologyMap } from '../arena-story/technology-map';

@Component({
  selector: 'app-project-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TechnologyMap],
  template: `
    @if (mode() === 'tools') {
      <app-technology-map [kind]="project().id" [progress]="progress()" />
    } @else {
      <div class="code-workbench"><aside><span>NO PROJETO</span>@for (file of project().files; track file) { <div [class.selected]="file === project().source"><i aria-hidden="true">{{ file.endsWith('/') ? '▱' : '‹›' }}</i>{{ file }}</div> }</aside><div class="code-file"><header>{{ project().source }}<span>trecho do código</span></header><pre tabindex="0" aria-label="Trecho de código do projeto"><code>{{ project().code }}</code></pre></div></div>
      <p class="decision">{{ project().decision }}</p>
    }
  `,
  styleUrl: './project-details.scss',
})
export class ProjectDetails {
  readonly project = input.required<PersonalProject>();
  readonly mode = input.required<'tools' | 'code'>();
  readonly progress = input(1);
}
