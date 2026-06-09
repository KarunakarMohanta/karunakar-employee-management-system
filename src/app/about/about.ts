import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About {

  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/frontpage']);
  }

  goToAbout() {
    // Already on about page
  }


  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  openFacebook() {
    window.open('https://www.facebook.com/', '_blank');
  }

  openInstagram() {
    window.open('https://www.instagram.com/', '_blank');
  }

  openYoutube() {
    window.open('https://www.youtube.com/', '_blank');
  }
}