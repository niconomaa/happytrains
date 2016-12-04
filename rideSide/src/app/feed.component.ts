import { Component, OnInit, OnDestroy } from '@angular/core';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription';

import gql from 'graphql-tag';

import 'rxjs/add/operator/toPromise';

const AllTrainlinesQuery = gql`
  query allTrainlines {
    Ride(id: "ciw9xa2ci2sp40132fytik39j") {
      trainlines {
        name
      }
      date
    }
  }
`;

@Component({
  selector: 'feed',
  template: `
    <div class="banner"><i class="fa fa-bars" aria-hidden="true"></i>Connection feedback</div>
    <div class="outer-container ma1 pa1" *ngFor="let trainline of allTrainlines">
      <a (click)="toggleFeedback(trainline)" class="inner-container bg-black-05 pa2 no-underline">
        <img [src]="trainline.imageUrl">
        <span class="expand-feedback">
            Feedback 
            <i *ngIf="!trainline.isFeedbackExpanded" class="fa fa-chevron-down" aria-hidden="true"></i>
            <i *ngIf="trainline.isFeedbackExpanded" class="fa fa-chevron-up" aria-hidden="true"></i>
        </span>
      </a>
      <div class="feedback-box" *ngIf="trainline.isFeedbackExpanded">
        <div class="topic-radios">
          <p>I want to give feedback concerning</p>
          <label for="topic1"><input id="topic1" type="radio" [(ngModel)]=topic value=Crowdedness> Crowdedness</label>
          <label for="topic2"><input id="topic2" type="radio" [(ngModel)]=topic value=Cleanliness> Cleanliness</label>
          <label for="topic3"><input id="topic3" type="radio" [(ngModel)]=topic value=General> General</label>
        </div>
        <div class="feedback-text">
          <textarea placeholder="Feedback" [(ngModel)]="text" name="text"></textarea>
          <button (click)="sendAnswer(trainline)">
            Send Feedback
          </button>
        </div>
      </div>
    </div>
    <p class="reward">Earn a <img class="heart" src="http://berlinspiriert.de/wp-content/uploads/2015/12/bvg-logo.jpg"> for letting us know whether you are enjoying the ride!</p>
  `,
  host: {'style': 'text-align: center' }
})

export class FeedComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  allTrainlines: any;
  allTrainlinesSub: Subscription;
  topic: string;
  text: string;

  constructor(
      private apollo: Angular2Apollo
  ) {}

  handleDelete(id: string) {
    this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          deleteTrainline(id: $id) {
            id
          }
        }
      `,
      variables: {
        id: id,
      },
    }).toPromise();
  }

  toggleFeedback(trainline) {
    if (!trainline.isFeedbackExpanded) {
      this.allTrainlines.forEach((otherTrainline) => {otherTrainline.isFeedbackExpanded = false});
    }
    trainline.isFeedbackExpanded = !trainline.isFeedbackExpanded;
  }

  sendAnswer(trainline): void {

    this.toggleFeedback(trainline);

    console.log(trainline);
    console.log(this.topic);
    console.log(this.text);

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
        .then();

    this.topic = '';
    this.text = '';
  }

  ngOnInit() {
    this.allTrainlinesSub = this.apollo.watchQuery({
      query: AllTrainlinesQuery
    }).subscribe(({data, loading}) => {
      this.allTrainlines = data.Ride.trainlines.reverse();
      this.loading = loading;
      this.allTrainlines.forEach (function(trainline) {
        trainline.isFeedbackExpanded = false;
        trainline.imageUrl = "../assets/Berlin_" + trainline.name + ".svg.png";
      });
    });
  }

  ngOnDestroy() {
    this.allTrainlinesSub.unsubscribe();
  }
}
