import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Search from './pages/Search';
import AskAI from './pages/AskAI';
import ItemReader from './pages/ItemReader';
import MediaViewer from './pages/MediaViewer';
import StoryBuilder from './pages/StoryBuilder';
import Timeline from './pages/Timeline';
import Display from './pages/Display';
import { KioskProvider } from './KioskContext';
import { CollectionProvider } from './CollectionContext';
import CollectionTray from './components/CollectionTray';

function App() {
  const { i18n } = useTranslation();

  return (
    <CollectionProvider>
    <BrowserRouter>
      <KioskProvider>
      <CollectionTray />
      {/* Global Language Switcher */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {['en', 'hi', 'mr'].map(lang => (
          <button 
            key={lang}
            onClick={() => i18n.changeLanguage(lang)}
            className={`px-2 py-1 text-xs uppercase rounded font-bold ${i18n.language === lang ? 'bg-yellow-500 text-black' : 'bg-black bg-opacity-50 text-white hover:bg-opacity-80'}`}
          >
            {lang}
          </button>
        ))}
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/collections/:type" element={<div className="p-8">Collections Page (To do)</div>} />
        <Route path="/item/:id" element={<ItemReader />} />
        <Route path="/media/:id" element={<MediaViewer />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/display" element={<Display />} />
        <Route path="/constitution" element={<div className="p-8">Constitution Page (To do)</div>} />
        <Route path="/ask" element={<AskAI />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/story" element={<StoryBuilder />} />
      </Routes>
    </KioskProvider>
    </BrowserRouter>
    </CollectionProvider>
  );
}

export default App;





