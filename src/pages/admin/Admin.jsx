import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from "./styles.module.css";
import { url } from '../../shared/api/vars';

const Admin = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [newCollection, setNewCollection] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [newDrop, setNewDrop] = useState({
    name: '',
    color: '#ffffff',
    key: ''
  });
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/collections`);
      setCollections(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch collections');
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCollectionDetails = useCallback(async (title) => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/collections/by-title/${title}`);
      setSelectedCollection(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch collection details');
      console.error('Error fetching collection details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollection.title || !newCollection.description || !newCollection.tags) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const tagsArray = newCollection.tags.split(',').map(tag => tag.trim());
      await axios.post(`${url}/api/collections`, {
        ...newCollection,
        tags: tagsArray
      });
      setNewCollection({ title: '', description: '', tags: '' });
      setSuccess('Collection created successfully');
      setError(null);
      fetchCollections();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create collection');
      console.error('Error creating collection:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleAddDrop = async (e) => {
    e.preventDefault();
    if (!selectedCollection) {
      setError('Please select a collection first');
      return;
    }
    if (!audioFile) {
      setError('Please select an audio file');
      return;
    }
    if (!newDrop.name || !newDrop.key) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('name', newDrop.name);
    formData.append('color', newDrop.color);
    formData.append('key', newDrop.key);

    try {
      await axios.post(
        `${url}/api/collections/${selectedCollection._id}/drops`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setNewDrop({ name: '', color: '#ffffff', key: '' });
      setAudioFile(null);
      setSuccess('Drop added successfully');
      setError(null);
      fetchCollectionDetails(selectedCollection.title);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add drop');
      console.error('Error adding drop:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleDeleteDrop = async (dropId) => {
    if (!selectedCollection || !dropId) return;

    setLoading(true);
    try {
      await axios.delete(
        `${url}/api/collections/${selectedCollection._id}/drops/${dropId}`
      );
      setSuccess('Drop deleted successfully');
      setError(null);
      fetchCollectionDetails(selectedCollection.title);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete drop');
      console.error('Error deleting drop:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.message}>
        {error && (
          <div className={styles.notification}>
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        {success && (
          <div className={styles.notification}>
            {success}
            <button onClick={() => setSuccess(null)}>×</button>
          </div>
        )}
      </div>
      <div className={styles.but}>
        <div className={styles.sidebar}>
          <h2>Collections</h2>
          {loading && collections.length === 0 ? (
            <div>Loading...</div>
          ) : (
            <ul className={styles.collectionList}>
              {collections.map((collection) => (
                <li
                  key={collection}
                  onClick={() => fetchCollectionDetails(collection)}
                  className={selectedCollection?.title === collection ? styles.active : ''}
                >
                  {collection}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.mainContent}>
          <div className={styles.section}>
            <h2>Create New Collection</h2>
            <form onSubmit={handleCreateCollection} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Title:</label>
                <input
                  type="text"
                  value={newCollection.title}
                  onChange={(e) => setNewCollection({ ...newCollection, title: e.target.value })}
                  required
                  minLength="3"
                  maxLength="100"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                  required
                  minLength="10"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tags (comma separated):</label>
                <input
                  type="text"
                  value={newCollection.tags}
                  onChange={(e) => setNewCollection({ ...newCollection, tags: e.target.value })}
                  required
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Collection'}
              </button>
            </form>
          </div>

          {selectedCollection && (
            <div className={styles.section}>
              <h2>Manage Drops in: {selectedCollection.title}</h2>

              <form onSubmit={handleAddDrop} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={newDrop.name}
                    onChange={(e) => setNewDrop({ ...newDrop, name: e.target.value })}
                    required
                    minLength="2"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Color:</label>
                  <input
                    type="color"
                    value={newDrop.color}
                    onChange={(e) => setNewDrop({ ...newDrop, color: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Key:</label>
                  <input
                    type="text"
                    value={newDrop.key}
                    onChange={(e) => setNewDrop({ ...newDrop, key: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Audio File:</label>
                  <input
                    type="file"
                    accept=".mp3,.wav,.ogg"
                    onChange={(e) => setAudioFile(e.target.files[0])}
                    required
                  />
                  {audioFile && (
                    <div>Selected: {audioFile.name} ({(audioFile.size / 1024).toFixed(2)} KB)</div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || !audioFile}
                >
                  {loading ? 'Adding...' : 'Add Drop'}
                </button>
              </form>

              <div className={styles.dropsList}>
                <h3>Current Drops</h3>
                {loading && selectedCollection.drops?.length === 0 ? (
                  <div>Loading drops...</div>
                ) : selectedCollection.drops?.length > 0 ? (
                  <ul>
                    {selectedCollection.drops.map((drop) => (
                      <li key={drop._id} className={styles.dropItem}>
                        <div
                          className={styles.colorPreview}
                          style={{ backgroundColor: drop.color }}
                          title={drop.color}
                        />
                        <span className={styles.dropName}>{drop.name}</span>
                        <span className={styles.dropKey}>(Key: {drop.key})</span>
                        <audio
                          src={`${url}${drop.src}`}
                          controls
                          className={styles.audioPlayer}
                        />
                        <button
                          onClick={() => handleDeleteDrop(drop._id)}
                          disabled={loading}
                          className={styles.deleteButton}
                          title="Delete drop"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No drops in this collection yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;