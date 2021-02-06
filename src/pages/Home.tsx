import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Service from '../service';
import './Home.css';

interface LoginPageProps extends RouteComponentProps { }
interface LoginPageState {
  username: string;
}

class Home extends React.Component<LoginPageProps, LoginPageState> {
  service: Service;
  constructor(props: LoginPageProps) {
    super(props);
    this.state = {
      username: ''
    }
    this.service = new Service();
  }

  async login() {
    try {
      const name = this.state.username;
    const response = await this.service.login(name);
    const { role } = response;
    if (role === 'professor') {
      this.props.history.push('/professor');
    } else if (role === 'student') {
      await this.service.setName(name);
      this.props.history.push('/student');
    }
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }

  render() {
      return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
              <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
            </IonHeader>
            <div className="container">
              <IonInput
                style={{
                  border: '2px solid black',
                  width: '200px',
                  marginTop: '20px',
                  marginLeft: '20px'
                }}
                required
                id="username"
                name="username"
                autocomplete="username"
                value={this.state.username}
                onIonChange={(e: any) => {
                  this.setState({
                    username: e.target.value
                  })
                }}
              />
              <IonButton onClick={() => this.login()}>
                Login
              </IonButton>
            </div>
      </IonContent>
    </IonPage>
  );
  }
};

export default withRouter(Home);
