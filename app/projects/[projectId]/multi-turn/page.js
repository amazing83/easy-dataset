'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function MultiTurnDatasetPage({ params }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { projectId } = params;

  // 状态管理
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // 筛选条件
  const [filters, setFilters] = useState({
    roleA: '',
    roleB: '',
    scenario: '',
    scoreMin: '',
    scoreMax: '',
    confirmed: ''
  });

  // 获取多轮对话数据集列表
  const fetchConversations = async (newPage = page) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: newPage + 1,
        pageSize: rowsPerPage
      });

      if (searchKeyword) params.append('keyword', searchKeyword);
      if (filters.roleA) params.append('roleA', filters.roleA);
      if (filters.roleB) params.append('roleB', filters.roleB);
      if (filters.scenario) params.append('scenario', filters.scenario);
      if (filters.scoreMin) params.append('scoreMin', filters.scoreMin);
      if (filters.scoreMax) params.append('scoreMax', filters.scoreMax);
      if (filters.confirmed) params.append('confirmed', filters.confirmed);

      const response = await fetch(`/api/projects/${projectId}/dataset-conversations?${params.toString()}`);
      if (!response.ok) {
        throw new Error(t('datasets.fetchDataFailed'));
      }

      const data = await response.json();
      setConversations(data.data || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('获取多轮对话数据集失败:', error);
      toast.error(error.message || t('datasets.fetchDataFailed'));
    } finally {
      setLoading(false);
    }
  };

  // 导出数据集
  const handleExport = async () => {
    try {
      setExportLoading(true);
      const response = await fetch(`/api/projects/${projectId}/dataset-conversations/export`);

      if (!response.ok) {
        throw new Error(t('datasets.exportFailed'));
      }

      const data = await response.json();

      // 创建下载链接
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `multi-turn-conversations-${projectId}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(t('datasets.exportSuccess'));
    } catch (error) {
      console.error('导出失败:', error);
      toast.error(error.message || t('datasets.exportFailed'));
    } finally {
      setExportLoading(false);
    }
  };

  // 删除对话数据集
  const handleDelete = async conversationId => {
    if (!confirm(t('datasets.confirmDeleteConversation'))) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/dataset-conversations/${conversationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(t('datasets.deleteFailed'));
      }

      toast.success(t('datasets.deleteSuccess'));
      fetchConversations();
    } catch (error) {
      console.error('删除失败:', error);
      toast.error(error.message || t('datasets.deleteFailed'));
    }
  };

  // 查看详情
  const handleView = conversationId => {
    router.push(`/projects/${projectId}/multi-turn/${conversationId}`);
  };

  // 应用筛选
  const applyFilters = () => {
    setPage(0);
    setFilterDialogOpen(false);
    fetchConversations(0);
  };

  // 重置筛选
  const resetFilters = () => {
    setFilters({
      roleA: '',
      roleB: '',
      scenario: '',
      scoreMin: '',
      scoreMax: '',
      confirmed: ''
    });
    setSearchKeyword('');
    setPage(0);
    fetchConversations(0);
  };

  // 页面初始化
  useEffect(() => {
    fetchConversations();
  }, [projectId, page, rowsPerPage]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder={t('datasets.searchPlaceholder')}
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && fetchConversations(0)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 300 }}
          />

          <Button variant="outlined" startIcon={<FilterIcon />} onClick={() => setFilterDialogOpen(true)}>
            {t('datasets.moreFilters')}
          </Button>

          <Button
            variant="outlined"
            startIcon={exportLoading ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={handleExport}
            disabled={exportLoading}
          >
            {exportLoading ? t('datasets.exporting') : t('exportDialog.export')}
          </Button>
        </Box>
      </Paper>

      {/* 数据表格 */}
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>{t('datasets.firstQuestion')}</TableCell>
              <TableCell>{t('datasets.conversationScenario')}</TableCell>
              <TableCell>{t('datasets.conversationRounds')}</TableCell>
              <TableCell>{t('datasets.modelUsed')}</TableCell>
              <TableCell>{t('datasets.rating')}</TableCell>
              <TableCell>{t('datasets.createTime')}</TableCell>
              <TableCell align="center">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : conversations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Typography variant="body1" color="text.secondary">
                    {t('datasets.noConversations')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              conversations.map(conversation => (
                <TableRow key={conversation.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300 }}>
                      {conversation.question}
                    </Typography>
                    {conversation.confirmed && (
                      <Chip
                        label={t('datasets.confirmed')}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ mt: 0.5, fontSize: '0.7rem' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={conversation.scenario || t('datasets.notSet')}
                      size="small"
                      variant="outlined"
                      color={conversation.scenario ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {conversation.turnCount}/{conversation.maxTurns}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={conversation.model} size="small" variant="outlined" color="info" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={conversation.score > 0 ? `${conversation.score}/5` : t('datasets.notRated')}
                      size="small"
                      variant="outlined"
                      color={conversation.score > 3 ? 'success' : conversation.score > 0 ? 'warning' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{new Date(conversation.createAt).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={t('datasets.viewDetails')}>
                      <IconButton size="small" color="primary" onClick={() => handleView(conversation.id)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton size="small" color="error" onClick={() => handleDelete(conversation.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={event => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage={t('datasets.rowsPerPage')}
        />
      </TableContainer>

      {/* 筛选对话框 */}
      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('common.filterConditions')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label={t('settings.multiTurnRoleA')}
              value={filters.roleA}
              onChange={e => setFilters({ ...filters, roleA: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('settings.multiTurnRoleB')}
              value={filters.roleB}
              onChange={e => setFilters({ ...filters, roleB: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('datasets.conversationScenario')}
              value={filters.scenario}
              onChange={e => setFilters({ ...filters, scenario: e.target.value })}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label={t('datasets.minScore')}
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                value={filters.scoreMin}
                onChange={e => setFilters({ ...filters, scoreMin: e.target.value })}
                fullWidth
              />
              <TextField
                label={t('datasets.maxScore')}
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                value={filters.scoreMax}
                onChange={e => setFilters({ ...filters, scoreMax: e.target.value })}
                fullWidth
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>{t('datasets.filterConfirmationStatus')}</InputLabel>
              <Select
                value={filters.confirmed}
                onChange={e => setFilters({ ...filters, confirmed: e.target.value })}
                label={t('datasets.filterConfirmationStatus')}
              >
                <MenuItem value="">{t('datasetSquare.categories.all')}</MenuItem>
                <MenuItem value="true">{t('datasets.confirmed')}</MenuItem>
                <MenuItem value="false">{t('datasets.unconfirmed')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetFilters}>{t('datasets.resetFilters')}</Button>
          <Button onClick={() => setFilterDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={applyFilters}>
            {t('datasets.applyFilters')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
