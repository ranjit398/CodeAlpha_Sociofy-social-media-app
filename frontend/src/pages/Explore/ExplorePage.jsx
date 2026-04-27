import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/MainLayout';
import Avatar from '../../components/ui/Avatar';

const NEWS_DATA = [
  {
    id: 1,
    category: 'AI',
    title: 'GPT-5 Rumors Intensify as OpenAI Schedules Keynote',
    desc: 'The next generation of language models might be closer than we think, with promises of reasoning capabilities.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    tag: 'Trending'
  },
  {
    id: 2,
    category: 'Sports',
    title: 'Underdog Victory: Local Team Wins Championship',
    desc: 'In a stunning upset, the Lions secured their first title in over a decade after a dramatic final minute.',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800',
    tag: 'Live'
  },
  {
    id: 3,
    category: 'Tech',
    title: 'New Quantum Processor Breaks Computational Records',
    desc: 'Researchers have unveiled a 1,000-qubit processor that can solve complex problems in seconds.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    tag: 'Innovation'
  },
  {
    id: 4,
    category: 'Entertainment',
    title: 'Blockbuster Sequel Shatters Box Office Records',
    desc: 'The latest entry in the galactic saga has become the fastest film to reach $1B globally.',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
    tag: 'Popular'
  }
];

const CATEGORIES = ['All', 'Entertainment', 'Sports', 'Tech', 'AI'];

const ExplorePage = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % NEWS_DATA.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredNews = activeCategory === 'All' 
    ? NEWS_DATA 
    : NEWS_DATA.filter(n => n.category === activeCategory);

  return (
    <Layout activePage="explore">
      <div className="explore-container animate-fade-in">
        
        {/* News Slider */}
        <div className="trending-slider">
          {NEWS_DATA.map((item, index) => (
            <div key={item.id} className={`slide ${index === activeSlide ? 'active' : ''}`}>
              <img src={item.image} alt={item.title} className="slide-image" />
              <div className="slide-content">
                <span className="slide-tag">{item.tag}</span>
                <h2 className="slide-title">{item.title}</h2>
                <p className="slide-desc">{item.desc}</p>
              </div>
            </div>
          ))}
          <div className="slider-nav">
            {NEWS_DATA.map((_, index) => (
              <div 
                key={index} 
                className={`slider-dot ${index === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="news-categories">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Trending List */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold font-display px-2">What's Happening</h3>
          {filteredNews.map((item, index) => (
            <div key={item.id} className="trending-item">
              <div className="trending-rank">{index + 1}</div>
              <div className="trending-content">
                <div className="trending-category">{item.category}</div>
                <h4 className="trending-title">{item.title}</h4>
                <div className="trending-meta">Trending in your region</div>
              </div>
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image} alt="thumb" className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
};

export default ExplorePage;
