import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import logoImage from '../../assets/libQualityLogo.svg';
import { Title, SubTitle, Form, Repositories, Error } from './styles';

interface IRepository {
  fullName: string;
  ownerAvatarUrl: string;
  language: string;
  htmlURL: string;
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<IRepository[]>(() => {
    const storageRepositories = localStorage.getItem(
      '@LibQuality:repositories',
    );
    if (storageRepositories) {
      return JSON.parse(storageRepositories);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@LibQuality:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newRepo) {
      setInputError('Type a OWNER/REPOSITORY');
      return;
    }
    try {
      const response = await api.post(`/repositories`, {
        repoName: newRepo,
      });
      const { repository } = response.data;
      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (error) {
      setInputError("Sorry... We can't find this repository.");
    }
  }

  return (
    <>
      <img src={logoImage} alt="Lib Quality" />
      <Title>LibQuality</Title>
      <SubTitle>
        This is a simple tool to compare quality of diferent open source
        libraries available in GitHub
      </SubTitle>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Type repository name. Ex: facebook/react"
        />
        <button type="submit">Search</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map(repository => (
          <Link
            key={repository.fullName}
            to={`/repository/${repository.fullName}`}
          >
            <img src={repository.ownerAvatarUrl} alt={repository.fullName} />
            <div>
              <strong>{repository.fullName}</strong>
              <p>
                {repository.language}
                {'  ||  '}
                {repository.htmlURL}
              </p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
