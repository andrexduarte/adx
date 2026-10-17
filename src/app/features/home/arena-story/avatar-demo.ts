import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { AvatarClassSelector } from './avatar-class-selector';
import { phase } from './story-timing';

interface AvatarDemoState {
  classIndex: 0 | 1;
  avatarIndex: 0 | 1;
  activeClass: 0 | 1;
  currentImage: string;
  groupOpen: boolean;
  detailsVisible: boolean;
  saved: boolean;
  classChanged: boolean;
  closed: boolean;
}

@Component({
  selector: 'app-avatar-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarClassSelector],
  templateUrl: './avatar-demo.html',
  styleUrl: './avatar-demo.scss',
})
export class AvatarDemo {
  readonly progress = input(0);
  // Content and images from change-avatar-modal/v2; the demo account has level 1.
  readonly classes = [
    {
      name: 'Analista Gráfico', preview: 'preview-analista-grafico.jpg',
      description: 'Especialista em análise técnica e padrões gráficos, focado em identificar tendências e pontos de entrada através do estudo de gráficos.',
      features: ['📈 Domínio de análise técnica', '🔍 Identificação de padrões gráficos', '⚖️ Estratégias baseadas em indicadores', '🛡️ Gestão de risco técnico'],
      avatars: ['analista1', 'analista2'], locked: 'analista2-1',
    },
    {
      name: 'Sniper', preview: 'preview-sniper.jpg',
      description: 'Trader de precisão cirúrgica, especialista em operações de alta assertividade com foco em poucos setups de alta probabilidade.',
      features: ['🎯 Operações de alta precisão', '🔎 Seleção rigorosa de setups', '💪 Disciplina extrema na execução', '💎 Foco em qualidade vs quantidade'],
      avatars: ['sniper1-1', 'sniper1-2'], locked: 'sniper2-1',
    },
  ] as const;
  readonly images = this.classes.flatMap<string>(item => item.avatars);
  private readonly manual = signal<{ at: number; state: AvatarDemoState } | null>(null);
  private readonly manualState = computed(() => {
    const manual = this.manual();
    return manual?.at === this.progress() ? manual.state : null;
  });
  readonly state = computed<AvatarDemoState>(() => this.manualState() ?? {
    classIndex: this.progress() < .22 ? 0 : 1,
    avatarIndex: this.progress() < .58 ? 0 : 1,
    activeClass: this.progress() < .94 ? 0 : 1,
    currentImage: this.progress() < .94 ? 'analista1' : 'sniper1-2',
    groupOpen: this.progress() >= .42 && this.progress() < .83,
    detailsVisible: this.progress() >= .22,
    saved: this.progress() >= .94,
    classChanged: this.progress() >= .94,
    closed: false,
  });
  readonly selectedClass = computed(() => this.classes[this.state().classIndex]);
  readonly selectedImage = computed(() => this.selectedClass().avatars[this.state().avatarIndex]);
  readonly canConfirm = computed(() => this.selectedImage() !== this.state().currentImage);
  readonly saveMessage = computed(() => this.state().classChanged
    ? `Avatar e classe "${this.classes[this.state().activeClass].name}" atualizados com sucesso!`
    : 'Avatar atualizado com sucesso!');
  private update(change: Partial<AvatarDemoState>) {
    this.manual.set({ at: this.progress(), state: { ...this.state(), ...change } });
  }
  chooseClass(index: number) {
    this.update({ classIndex: index === 0 ? 0 : 1, avatarIndex: 0, groupOpen: false, detailsVisible: true, saved: false });
  }
  chooseAvatar(index: number) {
    this.update({ avatarIndex: index === 0 ? 0 : 1, saved: false });
  }
  toggleGroup() { this.update({ groupOpen: !this.state().groupOpen }); }
  back() { this.update({ detailsVisible: false, groupOpen: false }); }
  close() { this.update({ closed: true }); }
  reopen() { this.update({ closed: false }); }
  confirm() {
    if (!this.canConfirm()) return;
    this.update({
      classChanged: this.state().classIndex !== this.state().activeClass,
      activeClass: this.state().classIndex,
      currentImage: this.selectedImage(),
      groupOpen: false,
      saved: true,
    });
  }
  imageOpacity(image: string) {
    if (this.manualState()) return image === this.selectedImage() ? 1 : 0;
    if (image === 'analista1') return 1 - phase(this.progress(), .22, .28);
    if (image === 'sniper1-1') return phase(this.progress(), .22, .28) * (1 - phase(this.progress(), .58, .64));
    return image === 'sniper1-2' ? phase(this.progress(), .58, .64) : 0;
  }
}
