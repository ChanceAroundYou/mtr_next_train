import { useState, useEffect } from 'react';

import Header from './Header';
import Info from './Info';


const NextTrain = () => {
  document.title = 'MTR Next Train';
  const initialTags = [
    'EAL-UNI',
  ];
  const [tags, setTags] = useState(initialTags);
  const [activeTag, setActiveTag] = useState('');

  useEffect(() => {
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
    <div className='font-sans text-sm text-center text-white w-screen h-screen flex flex-col'>
      <Header tags={tags} activeTag={activeTag} setTags={setTags} setActiveTag={setActiveTag} />
      <Info activeTag={activeTag} />
    </div>
  );
};

export default NextTrain;