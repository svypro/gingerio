import React, { useEffect, useState } from 'react';
import convert from 'xml-js';
import dateFormat from 'dateformat';

const Articles = () => {
	const [articles, setArticles] = useState([]);
	const [start, setStart] = useState(0);
	const [noResults, setNoResults] = useState(false);

	useEffect(() => {
		fetch(`http://export.arxiv.org/api/query?search_query=all:psychiatry+OR+all:therapy+OR+all:"machine learning"+OR+all:"data science"&max_results=10&sortOrder=descending&sortBy=lastUpdatedDate&start=${start}`)
		.then(results => results.text())
		.then(articles => {
			const xml = convert.xml2js(articles, {compact: true, spaces: 2});
			if(xml.feed.entry.length) {
				setArticles(prev => [...prev, ...xml.feed.entry]);
			} else {
				setNoResults(true);
			}
		})
		.catch(err => console.log(err));
	}, [start])

	const loadMore = () => {
		setStart(prevState => prevState + 1);
	}

	return (

		<div>
			<h2>Articles</h2>
			<ul className='articles-list'>
				{articles && articles.map((article, i) => {
					let authorText = [];
					if(Array.isArray(article.author)) {
						article.author.map(au => authorText.push(au.name._text))
					} else {
						authorText.push(article.author?.name?._text)
					}
					return <li key={`${article.id?._text}-${i}`}>
							<a className='title' href={article.id?._text} target="_blank">{article.title?._text}</a>
							<div className='authors'>{authorText.map((author, i) => <a key={`${author}-1`} href={`/authors/${author}`} className='author'>{author}</a>)}</div>
							<span className='date'>Updated: {dateFormat(article.updated._text, 'mmmm dd, yyyy')}</span>
						</li>
				})}
			</ul>
			{(!noResults && articles.length >= 10) && <div className='loadmore'><button className='loadmore' onClick={loadMore}>Load More</button></div>}
		</div>
	)
}

export default Articles;