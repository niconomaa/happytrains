import { Component, OnInit, OnDestroy } from '@angular/core';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription';

import gql from 'graphql-tag';

import 'rxjs/add/operator/toPromise';

const AllTrainlinesQuery = gql`
  query allTrainlines {
    Trainrider(id: "ciwa3s1p43k740132t9n201b9") {
      rides(filter: {id: "ciwag0r024gnj01329sfvz3tt"}) {
        trainlines {
          name
          id
        }
        date
      }
      id
      username
      hearts
    }
  }
`;

@Component({
  selector: 'feed',
  template: `
    <div class="banner"><i class="fa fa-bars" aria-hidden="true"></i>Connection feedback </div>
    <div class="info-bar">
      <span>{{ride?.date.substr(0, 10)}}</span>
      <span>{{trainrider?.username}}</span>
      <span>{{hearts}} <img class="heart" src="../assets/heart.png"></span>
    </div>
    <div class="row" *ngIf="showAll">
      <div class="outermost" *ngFor="let trainline of allTrainlines; let i=index" [ngClass]="{'expanded': trainline.isFeedbackExpanded}">
        <div class="outer-container" *ngIf="expandedArray[i]">
          <a (click)="toggleFeedback(trainline)" class="inner-container pa3 no-underline">
            <img [src]="trainline.imageUrl">
            <span class="expand-feedback">
                Feedback 
                <i *ngIf="!trainline.isFeedbackExpanded" class="fa fa-chevron-down" aria-hidden="true"></i>
                <i *ngIf="trainline.isFeedbackExpanded" class="fa fa-chevron-up" aria-hidden="true"></i>
            </span>
          </a>
          <div class="feedback-box" *ngIf="trainline.isFeedbackExpanded">
            <div *ngIf="!trainline.showTextarea" class="topic-buttons">
              <button (click)="setTopic('Crowdedness', trainline)">Crowdedness</button>
              <button (click)="setTopic('Cleanliness', trainline)">Cleanliness</button>
              <button (click)="setTopic('Staff', trainline)">Staff</button>
              <button (click)="setTopic('Safety', trainline)">Safety</button>
              <button (click)="setTopic('Other', trainline)">Other</button>
            </div>
            <div *ngIf="!!trainline.showTextarea" class="feedback-text">
              <textarea placeholder="Feedback" [(ngModel)]="text" name="text"></textarea>
              <button (click)="sendAnswer(trainline, i)">
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="outermost everything-fine">
          <div class="outer-container">
              <a (click)="sendDefaultAnswerAll()" class="inner-container pa3 no-underline">
                  <span>Everything is great!</span>
                  <i class="fa fa-check" aria-hidden="true"></i>
              </a>
          </div>
      </div>
    </div>
    <p class="reward">Earn <img class="heart" src="../assets/heart.png"> for letting us know whether you are enjoying the ride!</p>
  `,
  host: {'style': 'text-align: center' }
})

export class FeedComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  allTrainlines: any;
  ride: any;
  trainrider: any;
  allTrainlinesSub: Subscription;
  allTrainlinesObs: any;
  topic: string;
  text: string;
  hearts: number;
  showAll: boolean = true;
  expandedArray: any = [true, true, true, true, true, true, true, true];

  constructor(
      private apollo: Angular2Apollo
  ) {}

  toggleFeedback(trainline) {

    if (!trainline.isFeedbackExpanded) {
      this.allTrainlines.forEach((otherTrainline) => {otherTrainline.isFeedbackExpanded = false});
    }
    trainline.isFeedbackExpanded = !trainline.isFeedbackExpanded;
  }

  setTopic(topic, trainline) {
    this.topic = topic;
    trainline.showTextarea = true;
  }

  sendDefaultAnswerAll(): void {
    this.allTrainlines.forEach ((trainline) => {
      this.sendDefaultAnswer(trainline);
      this.showAll = false;
    })
  }

  sendDefaultAnswer(trainline): void {
    this.topic = 'Other';
    this.text = 'Everything is great!';
    this.sendAnswer(trainline, 1);
  }

  sendAnswer(trainline, index): void {

    this.expandedArray[index] = false;

    this.toggleFeedback(trainline);

    this.apollo.mutate({
      mutation: gql`
          mutation ($topic: ANSWER_TOPIC!, $text: String!, $trainlineId: ID){
              createAnswer(topic: $topic, text: $text, trainlineId: $trainlineId) {
                  id
              }
          }
      `,
      variables: {
        topic: this.topic,
        text: this.text,
        trainlineId: trainline.id,
      },
    })
        .toPromise()
        .then(() => {
          this.topic = '';
          this.text = '';
        });

    this.hearts = this.hearts + this.countWords(this.text);

    this.apollo.mutate({
      mutation: gql`
          mutation ($id: ID!, $hearts: Int){
            updateTrainrider(id: $id, hearts: $hearts) {
              id
            }
          }
      `,
      variables: {
        id: this.trainrider.id,
        hearts: this.hearts,
      },
    })
        .toPromise()
        .then(() => {this.allTrainlinesObs.refetch()});
  }

  countWords(s){
    if(s === 'Everything is great!') {return 1;}
    s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
    s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
    s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
    return s.split(' ').length;
  }

  ngOnInit() {
    this.allTrainlinesObs = this.apollo.watchQuery({
      query: AllTrainlinesQuery
    });

    this.allTrainlinesSub = this.allTrainlinesObs.subscribe(({data, loading}) => {
      this.trainrider = data.Trainrider;
      this.ride = this.trainrider.rides[0];
      this.hearts = this.trainrider.hearts;
      this.allTrainlines = this.ride.trainlines.reverse();
      this.loading = loading;
      this.allTrainlines.forEach (function(trainline) {
        trainline.isFeedbackExpanded = false;
        trainline.imageUrl = "../assets/Berlin_" + trainline.name + ".svg.png";
        trainline.showTextarea = false;
        trainline.showTrainline = true;
      });
    });
  }

  ngOnDestroy() {
    this.allTrainlinesSub.unsubscribe();
  }
}
