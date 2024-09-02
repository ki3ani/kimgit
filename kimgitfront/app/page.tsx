"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Issue {
  id: number;
  title: string;
  description: string;
}

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [updateId, setUpdateId] = useState<number | null>(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/issues/');
      setIssues(response.data);
      console.log('Read:', response.data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  const createIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/issues/', { title, description });
      console.log('Create:', response.data);
      setTitle('');
      setDescription('');
      fetchIssues();
    } catch (error) {
      console.error('Error creating issue:', error);
    }
  };

  const updateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updateId === null) return;
    try {
      const response = await axios.put(`http://localhost:8000/api/issues/${updateId}/`, { title, description });
      console.log('Update:', response.data);
      setTitle('');
      setDescription('');
      setUpdateId(null);
      fetchIssues();
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };

  const deleteIssue = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/issues/${id}/`);
      console.log('Delete:', response.data);
      fetchIssues();
    } catch (error) {
      console.error('Error deleting issue:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Issues</h1>
      <form onSubmit={updateId !== null ? updateIssue : createIssue} className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="border p-2 mr-2 dark:bg-gray-800 dark:text-white"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="border p-2 mr-2 dark:bg-gray-800 dark:text-white"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {updateId !== null ? 'Update Issue' : 'Create Issue'}
        </button>
      </form>
      <ul>
        {issues.map((issue) => (
          <li key={issue.id} className="mb-2 dark:text-white">
            {issue.title} - {issue.description}
            <button
              onClick={() => {
                setTitle(issue.title);
                setDescription(issue.description);
                setUpdateId(issue.id);
              }}
              className="bg-yellow-500 text-white p-1 rounded ml-2"
            >
              Edit
            </button>
            <button
              onClick={() => deleteIssue(issue.id)}
              className="bg-red-500 text-white p-1 rounded ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}