import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
	const { loading, data: userData} = useQuery(QUERY_ME);
	const [removeBook] = useMutation(REMOVE_BOOK);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!userData) {
		return <div>You must be logged in to view saved books!</div>
	}

	const handleDeleteBook = async (bookId) => {
		try {
			// Remove book from user info
			await removeBook({ variables: { bookId }});
			// Removes book from localstorage upon success of removal from user info
			removeBookId(bookId);
		} catch {
			console.error(err);
		}	
	};

	console.log(userData);

	return (
		<>
		<Jumbotron fluid className='text-light bg-dark'>
			<Container>
				<h1>Viewing saved books!</h1>
			</Container>
		</Jumbotron>
		<Container>
			<h2>
				{userData.savedBooks.length
					? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
					: 'You have no saved books!'}
			</h2>
			<CardColumns>
				{userData.savedBooks.map((book) => {
					return (
						<Card key={book.bookId} border='dark'>
							{book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
							<Card.Body>
								<Card.Title>{book.title}</Card.Title>
								<p className='small'>Authors: {book.authors}</p>
								<Card.Text>{book.description}</Card.Text>
								<Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
									Delete this Book!
								</Button>
							</Card.Body>
						</Card>
					);
				})}
			</CardColumns>
		</Container>
		</>
	);
};

export default SavedBooks;
