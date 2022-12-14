import "./App.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState, createContext, Fragment } from "react";
import { services } from ".";
import FormFilter from "./components/FormFilter";
import PatientCard from "./components/PatientCard";

export interface ICard {
  status: string;
  display: boolean;
  id: number;
  patient_name: string;
  created_date: string;
  arrhythmias: string[];
}
export type AppContent = {
  cardsDisplayed: ICard[];
  setCardsDisplayed: (c: ICard[]) => void;
};
export const ContextApp = createContext<AppContent>({
  cardsDisplayed: [],
  setCardsDisplayed: () => {},
});

function App() {
  const [cardsDisplayed, setCardsDisplayed] = useState<ICard[]>([]);
  const [pendingCards, setPendingCard] = useState<ICard[]>([]);
  const [rejectedCards, setRejectedCards] = useState<ICard[]>([]);
  const [doneCards, setDoneCards] = useState<ICard[]>([]);

  const listStatus: string[] = ["PENDING", "REJECTED", "DONE"];

  useEffect(() => {
    services.app
      .getAllCards()
      .then((resp) => resp.json())
      .then((data) => {
        setCardsDisplayed(data.map((card:any) => ({...data, display : true})));
      });
  }, []);

  useEffect(() => {
    let pendingCards: ICard[] = [];
    let rejectedCards: ICard[] = [];
    let doneCards: ICard[] = [];
    cardsDisplayed.forEach((card: ICard) => {
      switch (card.status) {
        case "PENDING":
          pendingCards.push(card);
          break;
        case "REJECTED":
          rejectedCards.push(card);
          break;
        case "DONE":
          doneCards.push(card);
          break;
        default:
          break;
      }
    });
    setPendingCard(pendingCards);
    setRejectedCards(rejectedCards);
    setDoneCards(doneCards);
  }, [cardsDisplayed]);

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
            {listStatus.map((status, i) => {
              return (
                <Col key={`status-${i}`}>
                  <Card className="container-patients-card">
                    <Card.Header as="h2">{status}</Card.Header>
                    <Card.Body>
                      {status === "PENDING" &&
                        pendingCards.map((card, i) => {
                          return (
                            <PatientCard key={`card-id-${i}`} card={card} />
                          );
                        })}
                      {status === "REJECTED" &&
                        rejectedCards.map((card, i) => {
                          return (
                            <PatientCard key={`card-id-${i}`} card={card} />
                          );
                        })}
                      {status === "DONE" &&
                        doneCards.map((card, i) => {
                          return (
                            <PatientCard key={`card-id-${i}`} card={card} />
                          );
                        })}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    </ContextApp.Provider>
  );
}

export default App;
