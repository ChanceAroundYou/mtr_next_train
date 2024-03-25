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

        const update_time = result['curr_time'];
        const up = Object.keys(result).includes('UP') ? result.UP : [];
        const down = Object.keys(result).includes('DOWN') ? result.DOWN : [];
        const train_data = {};
        for (const train of [...up, ...down]) {
          const { ttnt, dest } = train;
          const dest_name = mtr_sta[line][dest];
          const tm = parseFloat(ttnt);
          if (!train_data[dest_name]) {
            train_data[dest_name] = [tm];
          } else {
            train_data[dest_name] = [...train_data[dest_name], tm].sort((a,b) => a-b);
          }
        }
        console.log(train_data)
        return [train_data, update_time]
      } else {
        return [undefined, undefined];
      }
    })
    .catch(error => {
      console.error('Error:', error);
      return [undefined, undefined];
    });
}


const Info = ({ activeTag }) => {
  const [trainData, setTrainData] = useState(undefined);
  const [lastUpdate, setLastUpdate] = useState(undefined);
  const [line, station] = activeTag ? activeTag.split('-') : ['', ''];
  const line_name = line ? mtr_line[line] : '';
  const station_name = station ? mtr_sta[line][station] : '';

  const refresh = (line, station) => {
    if (line && station) {
      get_next_train(line, station)
        .then(([data, update_time]) => {
          setTrainData(data)
          setLastUpdate(update_time)
        })
    }
  }
  useEffect(() => {
    refresh(line, station);
    return () => { 
        setTrainData(undefined);
        setLastUpdate(undefined);
    }
  }, [line, station]);

  return <div className="bg-primary-700 h-full  w-full flex flex-col items-center justify-center relative">
  {/* return <div className="Station-info"> */}
    <div className='rounded-lg absolute top-6 right-6 text-xs bg-primary-500 w-20 h-8 py-2' onClick={() => refresh(line, station)} >刷新</div>
    {lastUpdate && <p className='text-xs text-primary-500 absolute top-16 right-6'>{`最后更新: ${lastUpdate.slice(-8)}`}</p>}
    <div className='text-3xl mb-4'>
      {line_name} - {station_name}
    </div>
    {
      trainData ?
        Object.entries(trainData).map(([dest_name, times]) => {
          return <div className='mt-4' key={dest_name}>{dest_name}: {
            times.slice(0,2).map(time => (
            <span className='text-primary-500 first:text-white'>{time}分钟 </span>
            ))
          }</div>
        })
        
        : <p>Loading...</p>
    }
  </div>
}

export default Info;