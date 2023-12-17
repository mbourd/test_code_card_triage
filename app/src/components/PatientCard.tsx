import { useCallback, useContext, useState } from 'react';
import {
  Card,
  Button,
  Row,
  Col,
  Nav,
  Tabs,
  Tab,
  ListGroup,
} from 'react-bootstrap';
import { ContextApp } from '../App';
import { ICard } from '../App';

interface IOwnProps {
  card: ICard;
}

const PatientCard: React.FC<IOwnProps> = ({ card }) => {
  const contextAppValue = useContext(ContextApp);

  const cardsDisplayed = contextAppValue.cardsDisplayed;
  const setCardsDisplayed = contextAppValue.setCardsDisplayed;

  const onClickDone = useCallback(
    (card: ICard) => {
      cardsDisplayed[cardsDisplayed.indexOf(card)].status = 'DONE';
      setCardsDisplayed([...cardsDisplayed]);
    },
    [cardsDisplayed, setCardsDisplayed],
  );

  const onClickReject = useCallback(
    (card: ICard) => {
      cardsDisplayed[cardsDisplayed.indexOf(card)].status = 'REJECTED';
      setCardsDisplayed([...cardsDisplayed]);
    },
    [cardsDisplayed, setCardsDisplayed],
  );

  const show = () => {
    if (card.display) {
      return (
        <Card className='patient-card'>
          <Card.Header>
            <Tabs defaultActiveKey='first'>
              <Tab
                eventKey='first'
                title='Patient'
              >
                <Card.Body>
                  <Card.Title>
                    <Row>
                      <Col>{card.patient_name}</Col>
                      <Col></Col>
                      <Col>
                        {new Date(card.created_date).toLocaleDateString()}
                      </Col>
                    </Row>
                  </Card.Title>
                </Card.Body>
              </Tab>
              <Tab
                eventKey='second'
                title='Arrhythmias'
              >
                <Card.Body>
                  <ListGroup>
                    {card.arrhythmias.map((v: string, i: number) => {
                      return (
                        <ListGroup.Item key={`arrhythmia-${i}`}>
                          {v}
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Card.Body>
              </Tab>
            </Tabs>
          </Card.Header>
          <Card.Footer>
            <Row>
              <Col>
                {card.status !== 'REJECTED' && (
                  <Button
                    variant='danger'
                    onClick={() => onClickReject(card)}
                  >
                    REJECT
                  </Button>
                )}
              </Col>
              <Col>
                {card.status !== 'DONE' && (
                  <Button
                    variant='success'
                    onClick={() => onClickDone(card)}
                  >
                    DONE
                  </Button>
                )}
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      );
    }

    return <></>;
  };

  return show();
};

export default PatientCard;
