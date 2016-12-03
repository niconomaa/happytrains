import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2Apollo } from 'angular2-apollo';

import gql from 'graphql-tag';

@Component({
  selector: 'new-answer',
  template: `
    <div>
      <input
        type="text"
        class="form-control"
        id="descriptionInput"
        placeholder="Topic"
        [(ngModel)]=topic
        name="topic"
        required
      />
      <input
        type="text"
        class=""
        id="urlInput"
        placeholder="Answer"
        [(ngModel)]="text"
        name="text"
      />
      <button 
        (click)="sendAnswer()"
      >
        Send Answer
      </button>
    </div>
  `
})
export class NewAnswerComponent {
  topic: string;
  text: string;

  constructor(
      private router: Router,
      private apollo: Angular2Apollo
  ) { }

  sendAnswer(): void {

    this.apollo.mutate({
      mutation: gql`
          mutation ($topic: ANSWER_TOPIC!, $text: String!){
              createAnswer(topic: $topic, text: $text) {
                  id
              }
          }
      `,
      variables: {
        topic: this.topic,
        text: this.text,
      },
    })
        .toPromise()
        .then(() => {
          this.router.navigate(['/']);
        });
  }
}
