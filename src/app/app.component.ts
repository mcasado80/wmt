import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private translate: TranslateService,
    private titleService: Title,
    private metaService: Meta) {
    this.initializeTranslation();
  }

  initializeTranslation() {
    const browserLang = this.translate.getBrowserLang();
    const defaultLang = browserLang?.match(/en|es/) ? browserLang : 'es';

    this.translate.setDefaultLang(defaultLang);
    this.translate.use(defaultLang);

    this.translate.get('META.TITLE').subscribe((res: string) => {
      this.titleService.setTitle(res);
    });

    this.translate.get('META.DESCRIPTION').subscribe((res: string) => {
      this.metaService.updateTag({ name: 'description', content: res });
    });
  }
}
