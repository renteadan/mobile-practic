import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonItem, IonList, IonLabel } from '@ionic/react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Quiz } from '../dto/Quiz';
import Service from '../service';
import './Home.css';

interface LoginPageProps extends RouteComponentProps { }
interface LoginPageState {
  quizez: Quiz[];
  loading: boolean;
}

interface CountQ {
  correct: number;
  wrong: number;
}

class Professor extends React.Component<LoginPageProps, LoginPageState> {
  service: Service;
  constructor(props: LoginPageProps) {
    super(props);
    this.state = {
      quizez: [],
      loading: true
    }
    this.service = new Service();
  }

  countQuestions(quizez: Quiz[]): Record<number, CountQ> {
    const q: Record<number, CountQ> = {};
    quizez.forEach(quiz => {
      if (!quiz.answer)
        return;
      quiz.answer.forEach(ans => {
        const id = ans.id;
        if (q[id]) {
          if (ans.isCorrect)
            q[id].correct++;
          else
            q[id].wrong++;
        } else {
          if (ans.isCorrect) {
            q[id] = {
              correct: 1,
              wrong: 0
            }
            } else {
              q[id] = {
                correct: 0,
                wrong: 1
              };
            }
          }
      })
    });
    return q;
  }

  generate(quizez: Quiz[]) {
    const a = this.countQuestions(quizez);
    const res = [];
    for (const key in a) {
      const val: CountQ = a[key];
      res.push(
        <IonItem key={key}>
          <IonLabel>
            {'id'} {key}
          </IonLabel>
          <IonLabel>
            {'correct'} {val.correct}
          </IonLabel>
          <IonLabel>
           {'wrong'} {val.wrong}
          </IonLabel>
        </IonItem>)
    }
    return res;
  }

  async componentDidMount() {
    const response = await this.service.getQuizez();
    this.setState({
      quizez: response,
      loading: false
    });
  }

  render() {
    const { quizez, loading } = this.state;
      return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
              <IonTitle>Professor</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
            </IonHeader>
            <div className="container">
              {!loading && (<IonList>{this.generate(quizez)}</IonList>)}
              {loading && (<IonLabel>
                Loading...
              </IonLabel>)}
            </div>
      </IonContent>
    </IonPage>
  );
  }
};

export default withRouter(Professor);
