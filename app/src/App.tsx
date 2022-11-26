import './App.css';
import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState, createContext } from 'react';
import { services } from '.';
import FormFilter from './components/FormFilter';
import PatientCard from './components/PatientCard';

export interface ICard {
  status: string,
  display: boolean,
  id: number,
  patient_name: string,
  created_date: string,
  arrhythmias:string[]
}
export type AppContent = {
  cardsDisplayed: ICard[], setCardsDisplayed:(c:ICard[]) => void
}
export const ContextApp = createContext<AppContent>({cardsDisplayed:[], setCardsDisplayed:() => {}});

function App() {
  const [cardsDisplayed, setCardsDisplayed] = useState<ICard[]>([]);

  useEffect(() => {
    services.app.getAllCards()
      .then(resp => resp.json())
      .then(data => {
        data.forEach((card: any) => card.display = true);
        setCardsDisplayed(data);
      });
  }, []);

  return (
    <ContextApp.Provider value={{ cardsDisplayed, setCardsDisplayed }}>
      <div className="App">
        <header className="App-header">
          <Row>
            <FormFilter />
          </Row>
        </header>
        <Container>
          <Row>
            <Col>
              <Card className="container-patients-card">
                <Card.Header as="h2">PENDING</Card.Header>
                <Card.Body>
                  {cardsDisplayed.map((card, i) => {
                    switch (card.status) {
                      case "PENDING":
                        if (card.display === true) {
                          return <PatientCard key={`card-id-${i}`} card={card} />
                        } else {
                          return <></>
                        }

                      default:
                        return <></>;
                    }
                  })}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="container-patients-card">
                <Card.Header as="h2">REJECTED</Card.Header>
                <Card.Body>
                  {cardsDisplayed.map((card, i) => {
                    switch (card.status) {
                      case "REJECTED":
                        if (card.display === true) {
                          return <PatientCard key={`card-id-${i}`} card={card} />
                        } else {
                          return <></>
                        }

                      default:
                        return <></>;
                    }
                  })}

                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="container-patients-card">
                <Card.Header as="h2">DONE</Card.Header>
                <Card.Body>
                  {cardsDisplayed.map((card, i) => {
                    switch (card.status) {
                      case "DONE":
                        if (card.display === true) {
                          return <PatientCard key={`card-id-${i}`} card={card} />
                        } else {
                          return <></>
                        }

                      default:
                        return <></>;
                    }
                  })}

                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </ContextApp.Provider>
  );
}

export default App;
