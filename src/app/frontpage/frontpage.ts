import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.html',
  styleUrls: ['./frontpage.css']
})
export class Frontpage {
  
  constructor(private router: Router) {}

  // Navigation Functions
goToHome() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

goToAbout() {
    this.router.navigate(['/about']);

}


// Social Media Functions
openFacebook() {
  window.open('https://www.facebook.com/', '_blank');
}

openInstagram() {
  window.open('https://www.instagram.com/', '_blank');
}

openYoutube() {
  window.open('https://www.youtube.com/', '_blank');
}
  
  goToRegister() {
    this.router.navigate(['/register']);
  }
  
  goToLogin() {
    this.router.navigate(['/login']);
  }
}