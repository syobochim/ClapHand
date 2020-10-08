import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState({ emoji: "👏", event: "", owner: "" })
  const eventId = new URL(window.location).searchParams.get("id")

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://kogh98ozya.execute-api.ap-northeast-1.amazonaws.com/production/claps?id=${encodeURIComponent(eventId)}`)
      if (!response.ok) {
        console.error(response);
      } else {
        const resJson = await response.json()
        console.log(resJson)
        setData({ emoji: resJson.emoji , event: resJson.event, owner: resJson.owner})
      }
    };
    fetchData();
  }, [])

  const clickHandler = async () => {
    const response = await fetch(`https://kogh98ozya.execute-api.ap-northeast-1.amazonaws.com/production/claps?id=${encodeURIComponent(eventId)}`, {
      method: 'PUT'
    })
    if (!response.ok) {
      console.error(response);
    } else {
      const resJson = await response.json()
      console.log('clap! : ' + resJson)
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p className="eventName">
          {data.event}
        </p>
        <p className="eventOwner">
          {data.owner}
        </p>
        <p>
          {eventId}
        </p>
        <p id="emoji" onClick={clickHandler}>
          {data.emoji}
        </p>
      </header>
    </div>
  );
}

export default App;
