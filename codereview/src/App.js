import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cards, setCards] = useState([]);
  const pendingCards = cards.filter((card) => card.status === 'PENDING')
  const rejectedCards = cards.filter((card) => card.status === 'REJECTED')
  const doneCards = cards.filter((card) => card.status === 'DONE')

  useEffect(() => {
    fetch('http://localhost:3000/cards')
      .then(resp => resp.json())
      .then(data => {
        data.forEach((card) => card.display = true);
        setCards(data);
      })
  }, [])

  function doneCard(card) {
    for (let i = 0; i < cards.length; i++) {
      if (cards[i] === card) {
        cards[i].status = 'DONE';
      }
    }
    setCards([...cards])
  }

  function rejectCard(card) {
    for (let i = 0; i < cards.length; i++) {
      if (cards[i] === card) {
        cards[i].status = 'REJECTED';
      }
    }
    setCards([...cards])
  }

  function searchCards(value) {
    for (let i = 0; i < cards.length; i++) {
      cards[i].display = cards[i].patient_name.match(value)
    }
    setCards([...cards])
  }

  function filterArrhythmias(value) {
    for (let i = 0; i < cards.length; i++) {
      cards[i].display = cards[i].arrhythmias.find(name => name === value)
    }
    setCards([...cards])
  }

  return (
    <div class="app">
      <div>
        <h1 style={{ margin: 0, float: 'left', marginRight: '20px' }}>Patient triage app</h1>
        <div class="form">
          <input type="text" onChange={(evt) => searchCards(evt.target.value)} />
          <select onChange={(evt) => filterArrhythmias(evt.target.value)}>
            <option value="">--</option>
            <option value='Afib'>AFib</option>
            <option value='AV Block'>AV Block</option>
            <option value='Pause'>Pause</option>
            <option value='PSVC'>PSVC</option>
            <option value='PVC'>PVC</option>
          </select>
        </div>
      </div>
      <div class="cols">
        <div class="col">
          <p id="pending-title" align="center">PENDING</p>
          <hr />
          {pendingCards.map((card, idx) => (
            <div class="card" style={{ display: card.display ? 'block' : 'none' }}>
              <h2>{card.patient_name}</h2>
              <p>{card.arrhythmias.join(',')}</p>
              <cite>{new Date(card.creation_date).toLocaleString()}</cite>

              <div>
                <div class="btn" onClick={() => doneCard(card)}>DONE</div>
                <div class="btn" onClick={() => rejectCard(card)}>REJECT</div>
              </div>
            </div>
          ))}
        </div>
        <div class="col">
          <p id="rejected-title" align="center">REJECTED</p>
          <hr />
          {rejectedCards.map((card, idx) => (
            <div class="card" style={{ display: card.display ? 'block' : 'none' }}>
              <h2>{card.patient_name}</h2>
              <p>{card.arrhythmias.join(',')}</p>
              <cite>{new Date(card.created_date).toLocaleString()}</cite>

              <div>
                <div class="btn" onClick={() => doneCard(card)}>DONE</div>
              </div>
            </div>
          ))}
        </div>
        <div class="col">
          <p id="done-title" align="center">DONE</p>
          <hr />
          {doneCards.map((card, idx) => (
            <div class="card" style={{ display: card.display ? 'block' : 'none' }}>
              <h2>{card.patient_name}</h2>
              <p>{card.arrhythmias.join(',')}</p>
              <cite>{new Date(card.created_date).toLocaleString()}</cite>

              <div>
                <div class="btn" onClick={() => rejectCard(card)}>REJECT</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
