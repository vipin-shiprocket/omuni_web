import { Component, OnInit } from '@angular/core';
import { clear } from './utils/memo.decorator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    setInterval(() => clear('expired'), 60000);
  }
}
