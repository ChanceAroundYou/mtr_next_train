import { useState, useEffect } from 'react';

import Header from './Header';
import Info from './Info';


const NextTrain = () => {
  document.title = 'MTR Next Train';
  const [tags, setTags] = useState([
    'EAL-UNI',
  ]);
  const [activeTag, setActiveTag] = useState('');

  useEffect(() => {
    const tags = ['EAL-UNI']
    const storedTags = localStorage.getItem('tags');
    if (storedTags && storedTags !== '[]') {
      const parsedTags = JSON.parse(storedTags);
      setTags(parsedTags);
      setActiveTag(parsedTags[0]);
    } else {
      setTags(tags);
      setActiveTag(tags[0]);
    }
  }, []);

  return (
    <div className='font-sans text-sm text-center text-white w-screen h-screen flex flex-col'>
      <Header tags={tags} activeTag={activeTag} setTags={setTags} setActiveTag={setActiveTag} />
      <Info activeTag={activeTag} />
    </div>
  );
};

export default NextTrain;