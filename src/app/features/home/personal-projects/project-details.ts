import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PersonalProject } from './project-data';

@Component({
  selector: 'app-project-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (mode() === 'tools') {
      <div class="tool-map"><div class="tool-hub"><span aria-hidden="true">↗</span><strong>{{ project().name }}</strong><small>da ideia à interface</small></div>
        @for (tool of project().tools; track tool.name) {
          <div class="tool" [style.opacity]=".25 + .75 * progress()"><b aria-hidden="true">{{ tool.mark }}</b><strong>{{ tool.name }}</strong><span>{{ tool.use }}</span></div>
        }
      </div>
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
