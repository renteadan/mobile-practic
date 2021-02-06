import { IonButton, IonContent, IonHeader, IonInput, IonLabel, IonPage, IonTitle, IonToolbar, IonItem } from '@ionic/react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Answer, Quiz } from '../dto/Quiz';
import Service from '../service';
import './Home.css';

interface StudentPageProps extends RouteComponentProps {}
interface StudentPageState {
  name: string;
  quiz?: Quiz;
  ind: number;
  answers: Answer[];
  currentAnswer: string;
  answered: Quiz[];
  loading: boolean;
}

class Student extends React.Component<StudentPageProps, StudentPageState> {
  service: Service;
  constructor(props: StudentPageProps) {
    super(props);
    this.service = new Service();
    this.state = {
      name: '',
      ind: 0,
      answers: [],
      currentAnswer: '',
      answered: [],
      loading: true,
    };
  }

  addAnswer() {
    const { ind, quiz, answers, currentAnswer} = this.state;
    const question = quiz?.question[ind];
    if (!question)
      return;
    answers.push({
      id: question.id,
      text: currentAnswer
    });
    this.setState({
      answers,
      ind: ind + 1,
      currentAnswer: ''
    });
  }

  generate(quizez: Quiz[]) {
    return quizez.map(quiz => {
      return (
        <div>
        <IonItem key={quiz.id}>
        <IonLabel>
          {'questions'} {quiz.question.map(q => `${q.id} `)}
        </IonLabel>
        <IonLabel>
          {'correct'} {quiz.answer? quiz.answer.filter(a => a.isCorrect).length : 0}
        </IonLabel>
        <IonLabel>
          {'wrong'} {quiz.answer? quiz.answer.filter(a => !a.isCorrect).length : 0}
        </IonLabel>
      </IonItem>
        </div>
      )
    });
  }

  async done() {
    const { answers, quiz, ind, currentAnswer } = this.state;
    const question = quiz?.question[ind];
    if (!question)
      return;
    answers.push({
      id: question.id,
      text: currentAnswer
    });
    const id = quiz?.id;
    if (!id)
      return;
    await this.service.sendAnsers(answers, id);
    window.location.reload();
  }

  async componentDidMount() {
    const name = await this.service.getName();
    const quiz = await this.service.startQuiz(name);
    const answered = await this.service.getQuiz(name);
    this.setState({
      name,
      quiz,
      answered,
      loading: false
    });
  }

  render() {
    const { name, quiz, ind, currentAnswer, answered, loading } = this.state;
      return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
              <IonTitle>Student { name }</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
            </IonHeader>
            <div className="container">
              {!loading && (quiz && (
                <div style={{
                  margin: '20px'
                }}>
                <IonLabel>
                  {quiz.question[ind].text}
                </IonLabel>
                  <IonInput
                    style={{
                      border: '2px solid black',
                      width: '200px'
                    }}
                    placeholder="Your answer"
                    value={currentAnswer}
                    onIonChange={(e: any) => {
                      this.setState({
                        currentAnswer: e.target.value
                      })
                    }}
                  >
                  </IonInput>
                  {ind < quiz.question.length-1 && (
                    <IonButton onClick={e => this.addAnswer()}>
                      Next
                    </IonButton>)}
                  {ind === quiz.question.length-1 && (
                  <IonButton onClick={e => this.done()}>
                    Done
                  </IonButton>
                  )}
                </div>
              ))}
              {this.generate(answered)}
              {loading && (
                <IonLabel>
                  Loading...
                </IonLabel>
              )}
            </div>
      </IonContent>
    </IonPage>
  );
  }
};

export default withRouter(Student);
