import { Component, OnInit, NgZone, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { UserService } from '../app/shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public latitude2: number;
  public longitude2: number;

  delivery: object;

  pickup: object;

  service_id: string = "e6f9a0b7-8f03-431f-a3da-7fbc914bbb72"

  priceForm: FormGroup;

  pickupError = '';
  deliveryError = '';
  errorMessage = '';

  deliveryFee: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  @ViewChild("searches")
  public searchesElementRef: ElementRef;

  constructor(private fb: FormBuilder, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private userService: UserService) {}

  ngOnInit() {
    //set google maps defaults
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    this.deliveryFee = 0.00;

    // build the data model for our signIn form
    this.buildPriceForm();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let input = this.searchElementRef.nativeElement;
      let input2 = this.searchesElementRef.nativeElement;

      let autocomplete = new google.maps.places.Autocomplete((input), {
        types: ["address"],
        componentRestrictions: {country: "ng"}
      });

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();

          return this.pickup = {
            lat: this.latitude,
            lng: this.longitude
          }
        });
      });

      let autocomplete2 = new google.maps.places.Autocomplete((input2), {
        types: ["address"],
        componentRestrictions: {country: "ng"}
      });

      autocomplete2.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place2: google.maps.places.PlaceResult = autocomplete2.getPlace();

          //verify result
          if (place2.geometry === undefined || place2.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude2 = place2.geometry.location.lat();
          this.longitude2 = place2.geometry.location.lng();

          return this.delivery = {
            lat: this.latitude2,
            lng: this.longitude2
          };
        });
      });
    });
  }

  // build the initial signin form
  buildPriceForm () {
    // build the form
    this.priceForm = this.fb.group({
      pickup: ['', [Validators.required]],
      delivery: ['', [Validators.required]]
    });

    // watch for changes and validate
    this.priceForm.valueChanges.subscribe(data => this.validatePriceForm());

  }

  // validate the entire signIn form
  validatePriceForm() {
    let pickup = this.priceForm.get('pickup');
    let delivery = this.priceForm.get('delivery');
    this.pickupError = '';
    this.deliveryError = '';

    if (pickup.invalid && pickup.dirty) {
      if (pickup.errors['required']) {
        this.pickupError = "Pickup Address is required";
      }
    }

    if (delivery.invalid && delivery.dirty) {
      if (delivery.errors['required']) {
        this.deliveryError = "Delivery Address is required";
      }
    }
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }
  }

  getPrice() {
    console.log("haha");
    this.errorMessage = '';
    const requestBody = {
      delivery: this.delivery,
      pickup: this.pickup,
      service_id: this.service_id
    }
    this.userService.getPrice(requestBody)
    .subscribe(
      data => {
      this.deliveryFee = data.delivery_fee;
      console.log(this.deliveryFee)
    },
      err => {
        this.errorMessage = err.message;
        console.log(err.message);
        this.clearMessages();
      }
    );
  }

  // clearmessage class to remove messages (error)
  clearMessages() {
    setTimeout(() =>{
      this.errorMessage = '';
    }, 10000);
  }
}
