import { useState } from 'react';
import mtr_name from './dict';

const lang = 'cn';
const [mtr_line, mtr_sta] = mtr_name[lang];

const Header = ({ tags, activeTag, setTags, setActiveTag }) => {
  // const [line, station] = activeTag.split('-');
  const click_tag = tag => (e) => {
    e.stopPropagation();
    setActiveTag(tag);
  }

  const remove_tag = (e) => {
    e.stopPropagation();
    const newTags = tags.filter(t => t !== activeTag);
    const newTag = tags.length > 0 ? tags[0] : '';
    setActiveTag(newTag);
    setTags(newTags);
    localStorage.setItem('tags', JSON.stringify(newTags));
  }

  return <div className="bg-primary-400 h-12 flex flex-row items-end justify-start">
    {
      tags.map(tag => (
        <Tag tag={tag} key={tag} activeTag={activeTag}
          click_tag={click_tag(tag)} remove_tag={remove_tag}
        />)
      )
    }
    <AddButton tags={tags} setTags={setTags} setActiveTag={setActiveTag} />
  </div>
}

const Tag = ({ tag, activeTag, click_tag, remove_tag }) => {
  const [tagLine, tagStation] = tag.split('-');
  const line_name = mtr_line[tagLine];
  const station_name = mtr_sta[tagLine][tagStation];

  return (
    <button 
      className={`relative text-xs rounded-t-lg w-[4.5rem] h-10 mt-2 ml-2 pt-2 ${tag === activeTag ? 'bg-primary-700' : 'bg-primary-500'}`}
      key={tagStation} onClick={click_tag}>
      {line_name}
      <br />
      {station_name}
      <span className="absolute top-[1px] right-[4px]" onClick={remove_tag}>x</span>
    </button>
  )
}

const AddButton = ({ tags, setTags, setActiveTag }) => {
  const [showPopup, setShowPopup] = useState(false);


  const addTag = newTag => {
    if (tags.includes(newTag)) {
      return
    }
    const newTags = [...tags, newTag];
    setTags(newTags);
    setActiveTag(newTag);
    localStorage.setItem('tags', JSON.stringify(newTags));
  }

  return <>
    <button className="relative rounded-t-lg w-10 h-10 mt-2 ml-2 pt-2 bg-primary-500" onClick={() => setShowPopup(true)}>
      <span className='text-xl'>+</span>
    </button>
    {showPopup && <Popup addTag={addTag} setShowPopup={setShowPopup} />}
  </>
};

const Popup = ({ addTag, setShowPopup }) => {
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedStation, setSelectedStation] = useState('');

  const add_click = () => {
    if (selectedLine && selectedStation) {
      const newTag = `${selectedLine}-${selectedStation}`;
      addTag(newTag);
      setShowPopup(false);
    }
  };

  return (
    <div className="flex items-center justify-center z-10 absolute w-screen h-screen top-0 left-0">
      <div className="h-64 w-64 rounded-lg absolute flex z-20 flex-col justify-center items-center bg-primary-800">
        <div className='text-lg'>新增站点</div>
        <select
          className='w-40 mt-4 text-black' value={selectedLine}
          onChange={(e) => setSelectedLine(e.target.value)}
        >
          <option value=''>-</option>
          {
            Object.keys(mtr_line).map(line => (
              <option key={line} value={line}>
                {mtr_line[line]}
              </option>
            ))
          }
        </select>
        <select
          className='w-40 mt-4 text-black' value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
        >
          <option value=''>-</option>
          {
            selectedLine ?
              Object.keys(mtr_sta[selectedLine])
                .map(station => (
                  <option key={station} value={station}>
                    {mtr_sta[selectedLine][station]}
                  </option>
                ))
              : null
          }
        </select>
        <button className='mt-4 text-xs' onClick={add_click}>新增</button>
        <button className='mt-4 text-xs' onClick={() => setShowPopup(false)}>取消</button>
      </div>
      <div className="bg-black opacity-70 z-10 w-full h-full" onClick={() => setShowPopup(false)}></div>
    </div>
  )
}

export default Header