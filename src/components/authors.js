import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import convert from 'xml-js';
import dateFormat from 'dateformat';

const Authors = () => {
	const { name } = useParams();
	const [authorsArticles, setAuthorsArticles] = useState([]);
	const [start, setStart] = useState(0);
	const [noResults, setNoResults] = useState(false);

	useEffect(() => {
		fetch(`http://export.arxiv.org/api/query?search_query=au:"${name}"&max_results=10&sortOrder=descending&sortBy=lastUpdatedDate&start=${start}`)
		.then(results => results.text())
		.then(articles => {
			const xml = convert.xml2js(articles, {compact: true, spaces: 2});
			if(xml.feed.entry.length) {
				setAuthorsArticles(prev => [...prev, ...xml.feed.entry]);
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
			<h2>{name} <span className='label'>Author's Articles</span></h2>
			{authorsArticles && <ul className='articles-list'>
				{authorsArticles.map((article, i) => {
					let authorText = [];
					if(Array.isArray(article.author)) {
						authorText = article.author.filter(au => name !== au.name._text).map(a => a.name._text)
					}
					return <li key={`${article.id?._text}-${i}`}>
							<a className='title' href={article.id?._text} target="_blank">{article.title?._text}</a>
							<div className='authors'>Co-Authors: {authorText.map((author, i) => <a key={`${author}-1`} href={`/authors/${author}`} className='author'>{author}</a>)}</div>
							<span className='date'>Updated: {dateFormat(article.updated._text, 'mmmm dd, yyyy')}</span>
						</li>
				})}
			</ul>}
			{!authorsArticles.length && 'Sorry, no articles found for this author'}
			{(!noResults && authorsArticles.length >= 10) && <div className='loadmore'><button className='loadmore' onClick={loadMore}>Load More</button></div>}
		</div>
	)
}

export default Authors;