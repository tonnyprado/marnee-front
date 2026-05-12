import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Storage as StorageIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import adminService from '../../services/adminApi';

const RAGManagement = () => {
  // State
  const [ragStatus, setRagStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Dialogs
  const [populateDialogOpen, setPopulateDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  // Operations
  const [operating, setOperating] = useState(false);

  // Load RAG status
  const loadRagStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getRagStatus();

      if (response.success) {
        setRagStatus(response.rag);
      } else {
        setError('Failed to load RAG status');
      }
    } catch (err) {
      setError(err.message || 'Error loading RAG status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRagStatus();
  }, []);

  // Populate knowledge
  const handlePopulateKnowledge = async (reset = false) => {
    try {
      setOperating(true);
      setError(null);
      setSuccess(null);

      const response = await adminService.populateRagKnowledge(reset);

      if (response.success) {
        setSuccess(`RAG knowledge populated successfully! ${response.total_documents} documents indexed.`);
        setPopulateDialogOpen(false);
        loadRagStatus(); // Reload status
      } else {
        setError('Failed to populate RAG knowledge');
      }
    } catch (err) {
      setError(err.message || 'Error populating RAG knowledge');
    } finally {
      setOperating(false);
    }
  };

  // Search RAG
  const handleSearch = async () => {
    try {
      setSearching(true);
      setError(null);

      const response = await adminService.searchRag(searchQuery, null, 10);

      if (response.success) {
        setSearchResults(response);
      } else {
        setError('Search failed');
      }
    } catch (err) {
      setError(err.message || 'Error searching RAG');
    } finally {
      setSearching(false);
    }
  };

  // Delete collection
  const handleDeleteCollection = async () => {
    if (!selectedCollection) return;

    try {
      setOperating(true);
      setError(null);
      setSuccess(null);

      const response = await adminService.resetRagCollection(selectedCollection);

      if (response.success) {
        setSuccess(`Collection "${selectedCollection}" reset successfully`);
        setDeleteDialogOpen(false);
        setSelectedCollection(null);
        loadRagStatus();
      } else {
        setError('Failed to reset collection');
      }
    } catch (err) {
      setError(err.message || 'Error resetting collection');
    } finally {
      setOperating(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'success';
      case 'empty':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <CheckCircleIcon color="success" />;
      case 'empty':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  // Render collection card
  const renderCollectionCard = (name, info) => {
    return (
      <Grid item xs={12} sm={6} md={4} key={name}>
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6" fontSize="0.95rem" fontWeight={600}>
                {name.replace(/_/g, ' ').toUpperCase()}
              </Typography>
              {getStatusIcon(info.status)}
            </Box>

            <Box mb={2}>
              <Chip
                label={info.status}
                color={getStatusColor(info.status)}
                size="small"
              />
              <Typography variant="h4" mt={1}>
                {info.count}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                documents
              </Typography>
            </Box>

            <Tooltip title="Reset this collection (DANGER!)">
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  setSelectedCollection(name);
                  setDeleteDialogOpen(true);
                }}
                disabled={info.count === 0}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!ragStatus) {
    return (
      <Alert severity="error">
        RAG system not available. Install dependencies: pip install chromadb sentence-transformers
      </Alert>
    );
  }

  if (!ragStatus.available) {
    return (
      <Card>
        <CardContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            RAG Service Not Available
          </Alert>
          <Typography variant="body2" color="textSecondary" paragraph>
            Reason: {ragStatus.reason || 'Unknown'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Install dependencies: <code>pip install chromadb sentence-transformers</code>
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          RAG Management
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            startIcon={<SearchIcon />}
            variant="outlined"
            onClick={() => setSearchDialogOpen(true)}
          >
            Search
          </Button>
          <Button
            startIcon={<CloudUploadIcon />}
            variant="contained"
            onClick={() => setPopulateDialogOpen(true)}
          >
            Populate Knowledge
          </Button>
          <IconButton onClick={loadRagStatus} title="Refresh">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Overview */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Total Documents
              </Typography>
              <Typography variant="h3" fontWeight={700}>
                {ragStatus.total_documents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Embedding Model
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {ragStatus.embedding_model}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Storage Location
              </Typography>
              <Typography variant="body2" fontFamily="monospace">
                {ragStatus.persist_directory}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Collections */}
      <Typography variant="h5" fontWeight={700} mb={2}>
        Collections
      </Typography>

      {/* Static Knowledge */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <StorageIcon />
            <Typography variant="h6">Static Knowledge</Typography>
            <Chip
              size="small"
              label={Object.entries(ragStatus.collections || {})
                .filter(([name]) => ['script_library', 'step_instructions', 'platform_logic', 'marnee_rules'].includes(name))
                .reduce((sum, [, info]) => sum + info.count, 0)}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {Object.entries(ragStatus.collections || {})
              .filter(([name]) => ['script_library', 'step_instructions', 'platform_logic', 'marnee_rules'].includes(name))
              .map(([name, info]) => renderCollectionCard(name, info))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* User Data */}
      <Accordion defaultExpanded sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <StorageIcon />
            <Typography variant="h6">User Data</Typography>
            <Chip
              size="small"
              label={Object.entries(ragStatus.collections || {})
                .filter(([name]) => !['script_library', 'step_instructions', 'platform_logic', 'marnee_rules'].includes(name))
                .reduce((sum, [, info]) => sum + info.count, 0)}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {Object.entries(ragStatus.collections || {})
              .filter(([name]) => !['script_library', 'step_instructions', 'platform_logic', 'marnee_rules'].includes(name))
              .map(([name, info]) => renderCollectionCard(name, info))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Populate Dialog */}
      <Dialog open={populateDialogOpen} onClose={() => setPopulateDialogOpen(false)}>
        <DialogTitle>Populate RAG Knowledge</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            This will populate the RAG system with static knowledge:
          </Typography>
          <ul>
            <li>43 reference scripts</li>
            <li>7 step-by-step instructions</li>
            <li>Platform recommendation logic</li>
            <li>Core Marnee behavioral rules</li>
          </ul>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This operation may take a few seconds. You can choose to reset existing data or append.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPopulateDialogOpen(false)} disabled={operating}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handlePopulateKnowledge(true)}
            disabled={operating}
          >
            Reset & Populate
          </Button>
          <Button
            variant="contained"
            onClick={() => handlePopulateKnowledge(false)}
            disabled={operating}
          >
            {operating ? <CircularProgress size={24} /> : 'Populate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Search Dialog */}
      <Dialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Search RAG Knowledge</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Search Query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            margin="normal"
            placeholder="e.g., Instagram hooks, content pillars..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />

          {searching && <LinearProgress sx={{ mt: 2 }} />}

          {searchResults && (
            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom>
                Found {searchResults.total_found} results for "{searchResults.query}"
              </Typography>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Collection</TableCell>
                      <TableCell>Content</TableCell>
                      <TableCell>Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchResults.results.map((result, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Chip label={result.collection} size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontFamily="monospace">
                            {result.content}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={result.score ? result.score.toFixed(3) : 'N/A'}
                            size="small"
                            color={result.score > 0.8 ? 'success' : result.score > 0.6 ? 'primary' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchDialogOpen(false)}>Close</Button>
          <Button variant="contained" onClick={handleSearch} disabled={!searchQuery || searching}>
            Search
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Collection Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Reset Collection</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>DANGER!</strong> This action cannot be undone.
          </Alert>
          <Typography variant="body2">
            Are you sure you want to reset the collection <strong>{selectedCollection}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={2}>
            All data in this collection will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={operating}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteCollection}
            disabled={operating}
          >
            {operating ? <CircularProgress size={24} /> : 'Reset Collection'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RAGManagement;
