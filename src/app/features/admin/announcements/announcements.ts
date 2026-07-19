import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LucidePlus, LucideTrash2 } from '@lucide/angular';
import { AnnouncementBanner } from '../../../shared/components/announcement-banner/announcement-banner';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { AnnouncementsService } from '../../../services/announcements.service';
import { Announcement } from '../../../models';
import { AnnouncementFormDialog } from './announcement-form-dialog/announcement-form-dialog';

@Component({
  selector: 'app-announcements',
  imports: [AnnouncementBanner, EmptyState, LucidePlus, LucideTrash2],
  templateUrl: './announcements.html',
  styleUrl: './announcements.scss',
})
export class Announcements {
  private readonly announcementsService = inject(AnnouncementsService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly announcements = this.announcementsService.announcements;

  openAddDialog(): void {
    this.dialog
      .open(AnnouncementFormDialog, { width: '560px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const announcement: Announcement = {
            id: `ann-${Date.now()}`,
            createdAt: new Date().toISOString().slice(0, 10),
            ...result,
          };
          this.announcementsService.add(announcement);
        }
      });
  }

  deleteAnnouncement(announcement: Announcement): void {
    this.confirmDialog
      .confirm({
        title: 'حذف الإعلان',
        message: `هل تريد حذف إعلان "${announcement.title}"؟`,
        confirmText: 'حذف',
        danger: true,
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.announcementsService.remove(announcement.id);
        }
      });
  }
}
