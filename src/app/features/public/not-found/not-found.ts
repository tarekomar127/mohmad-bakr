import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCompass } from '@lucide/angular';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, LucideCompass],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {}
