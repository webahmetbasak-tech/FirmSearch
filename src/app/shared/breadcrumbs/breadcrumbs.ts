import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
export interface BreadcrumbItem { label: string; path?: string; }
@Component({
  selector: 'app-breadcrumbs', imports: [RouterLink], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<nav class="breadcrumbs" aria-label="İçerik yolu"><ol>@for (item of items(); track item.label; let last = $last) {<li>@if (item.path && !last) {<a [routerLink]="item.path">{{ item.label }}</a>} @else {<span [attr.aria-current]="last ? 'page' : null">{{ item.label }}</span>}</li>}</ol></nav>`,
})
export class Breadcrumbs { readonly items = input.required<readonly BreadcrumbItem[]>(); }
