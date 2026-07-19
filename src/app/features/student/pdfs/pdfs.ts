import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PdfCard } from '../../../shared/components/pdf-card/pdf-card';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Modal } from '../../../shared/components/modal/modal';
import { PdfsService } from '../../../services/pdfs.service';
import { PdfFile } from '../../../models';
import { resolveMediaUrl } from '../../../core/utils/media-url.util';

@Component({
  selector: 'app-student-pdfs',
  imports: [PdfCard, EmptyState, Modal],
  templateUrl: './pdfs.html',
  styleUrl: './pdfs.scss',
})
export class StudentPdfs {
  private readonly pdfsService = inject(PdfsService);

  readonly pdfs = toSignal(this.pdfsService.getAll({ pageSize: 100 }).pipe(map((res) => res.items)), {
    initialValue: [] as PdfFile[],
  });
  readonly viewingPdf = signal<PdfFile | null>(null);

  view(pdf: PdfFile): void {
    this.viewingPdf.set(pdf);
  }

  closeView(): void {
    this.viewingPdf.set(null);
  }

  download(pdf: PdfFile): void {
    window.open(resolveMediaUrl(pdf.fileUrl), '_blank');
  }
}
