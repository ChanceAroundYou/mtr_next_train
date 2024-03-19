import './App.css';
import { useState, useEffect } from 'react';
import mtr_name from './dict';


const lang = 'cn';
const next_train_url = 'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php';
const [mtr_line, mtr_sta] = mtr_name[lang];

const get_next_train = (line, station) => {
  const url = `${next_train_url}?line=${line}&sta=${station}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === 1 && data.message === 'successful') {
        const result = data.data[`${line}-${station}`];
        const up = Object.keys(result).includes('UP') ? result.UP : [];
        const down = Object.keys(result).includes('DOWN') ? result.DOWN : [];
        const train_data = {};
        for (const train of [...up, ...down]) {
          const { ttnt, dest } = train;
          const dest_name = mtr_sta[line][dest];
          const tm = parseFloat(ttnt);
          if (!train_data[dest_name]) {
            train_data[dest_name] = tm;
          } else if (tm < train_data[dest_name]) {
            train_data[dest_name] = tm;
          }
        }
        return train_data
      } else {
        return undefined;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      return undefined;
    });
}

const NextTrain = () => {
  document.title = 'MTR Next Train';
  const initialTags = [
    'EAL-UNI',
  ];
  const [tags, setTags] = useState(initialTags);
  const [activeTag, setActiveTag] = useState('');

  useEffect(() => {
    // localStorage.setItem('tags', JSON.stringify([]));
    const storedTags = localStorage.getItem('tags');
    if (storedTags && storedTags !== '[]') {
      const parsedTags = JSON.parse(storedTags);
      setTags(parsedTags);
      setActiveTag(parsedTags[0]);
    } else {
      setTags(initialTags);
      setActiveTag(initialTags[0]);
    }
  }, []);

  return (
    <>
      <StationSelector tags={tags} activeTag={activeTag} setTags={setTags} setActiveTag={setActiveTag} />
      <StationInfo activeTag={activeTag} />
    </>
  );
};

const StationSelector = ({ tags, activeTag, setActiveTag, setTags }) => {
  // const [line, station] = activeTag.split('-');
  return <div className="Station-selector">
        {tags.map(tag => {
          const [tagLine, tagStation] = tag.split('-');
          const tag_click = (e) => {
            e.stopPropagation();
            setActiveTag(tag);
          };
          const remove_click = (e) => {
            e.stopPropagation();
            const newTags = tags.filter(t => t !== tag);
            const newTag = tag === activeTag ? (newTags.length > 0 ? newTags[0] : '') : activeTag
            setActiveTag(newTag);
            setTags(newTags);
            localStorage.setItem('tags', JSON.stringify(newTags));
          };
          const line_name = mtr_line[tagLine];
          const station_name = mtr_sta[tagLine][tagStation];
          return (
            <button className={`Station-tag${tag===activeTag ? ' active-tag' : ''}`} key={tagStation} onClick={tag_click}>
              {line_name}<br />
              {station_name}
              <span className="Close-button" onClick={remove_click}>x</span>
            </button>
          );
        })}
        <StationAddButton tags={tags} setTags={setTags} setActiveTag={setActiveTag} />
      </div>
}

const StationAddButton = ({ tags, setTags, setActiveTag }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedStation, setSelectedStation] = useState('');

  const addTag = newTag => {
    if (tags.includes(newTag)) {
      return
    }
    const newTags = [...tags, newTag];
    setTags(newTags);
    setActiveTag(newTag);
    localStorage.setItem('tags', JSON.stringify(newTags));
  }

  const add_click = () => {
    if (selectedLine && selectedStation) {
      const newTag = `${selectedLine}-${selectedStation}`;
      addTag(newTag);
      setShowPopup(false);
    }
  };

  return (
    <>
      <button className="Station-tag add-tag" onClick={() => setShowPopup(true)}>
        <span>+</span>
      </button>
      {showPopup && (
        <div className="Popup">
          <div className="Popup-content">
            <h2>新增站点</h2>
            <select className='Station-add-selector' value={selectedLine} onChange={(e) => setSelectedLine(e.target.value)}>
              <option value=''>-</option>
              {
                Object.keys(mtr_line).map((line) => (
                  <option key={line} value={line}>
                    {mtr_line[line]}
                  </option>
                ))
              }
            </select>
            <select className='Station-add-selector' value={selectedStation} onChange={(e) => setSelectedStation(e.target.value)}>
               <option value=''>-</option>
               {selectedLine ? Object.keys(mtr_sta[selectedLine]).map((station) => (
                <option key={station} value={station}>
                  {mtr_sta[selectedLine][station]}
                </option>
              )) : null
              }
            </select>
            <button className='Station-add-button' onClick={add_click}>新增</button>
            <button className='Station-add-button' onClick={() => setShowPopup(false)}>取消</button>
          </div>
          <div className="Popup-overlay" onClick={() => setShowPopup(false)}></div>
        </div>
      )}
    </>
  );
};

const StationInfo = ({ activeTag }) => {
  const [trainData, setTrainData] = useState(undefined);
  const [line, station] = activeTag ? activeTag.split('-') : ['', ''];
  const line_name = line ? mtr_line[line] : '';
  const station_name = station ? mtr_sta[line][station] : '';

  const refresh = (line, station) => {
    if (line && station) {
      get_next_train(line, station)
        .then(data => {
          setTrainData(data)
        })
    }
  }
  useEffect(() => {
    refresh(line, station);
  }, [line, station]);

  return <div className="Station-info">
    <div className='refresh' onClick={() => refresh(line, station)} >刷新</div>
    <h1>{line_name} - {station_name}</h1>
    <h4>下一班:</h4>
    {
      trainData ?
        Object.entries(trainData).map(([dest_name, time]) => {
          return <p key={dest_name}>{dest_name}: {time}分钟</p>
        })
        : <p>Loading...</p>
    }
  </div>
}


export default function App() {
  return (
    <div className="App">
      <NextTrain />
    </div>
  );
}

