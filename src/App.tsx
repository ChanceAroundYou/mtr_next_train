import { useEffect, useState } from 'react';
import NextTrain from './NextTrain';
import usePWAInstall from './hooks/usePWAInstall';

export default function App() {
  const { installPromptEvent, handleInstall } = usePWAInstall();
  const [ visitCount, setVisitCount ] = useState();

  useEffect(() => {
    // 更安全的外部脚本加载方式
    // const loadScript = () => {
    //   const script = document.createElement('script');
    //   script.src = 'https://finicounter.eu.org/finicounter.js';
    //   script.async = true
    //   // script.crossOrigin = '';
    //   // script.setAttribute('referrerpolicy', 'origin');
    //   // document.head.setAttribute('data-referrer', 'https://aws.xiaokubao.space/');
    //   document.body.appendChild(script);
      
    //   return () => {
    //     document.body.removeChild(script);
    //     // document.head.removeAttribute('data-referrer');
    //   };
    // };
    const loadScript = () => {
      const host = 'aws.xiaokubao.space';
      const url = `https://finicounter.eu.org/counter?host=${host}`
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('网络错误');
          }
          return response.json();
        })
        .then(result => {
          setVisitCount(result.views);
        })
    };

    const timer = setTimeout(loadScript, 1000); // 延迟1秒加载
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="App">
      {installPromptEvent && (
        <button 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 p-3 z-50 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
          onClick={handleInstall}
        >
          添加到桌面
        </button>
      )}
      <NextTrain />
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500">
        累计访问用户数：{visitCount || '加载中...'}
      </div>
    </div>
  );
}
