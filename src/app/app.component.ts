import { Component, OnDestroy, OnInit } from '@angular/core';
import { clear } from './utils/memo.decorator';
import { clearIntervals, intervals } from './utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    intervals.set(
      'clearExpiredMemos',
      window.setInterval(() => clear('expired'), 60000),
    );
  }

  ngOnDestroy(): void {
    clearIntervals('all');
  }
}
