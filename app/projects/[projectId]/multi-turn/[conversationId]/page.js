'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Chip,
  TextField,
  Rating,
  Grid,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ConversationDetailPage({ params }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { projectId, conversationId } = params;

  // 状态管理
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 编辑状态
  const [editData, setEditData] = useState({
    score: 0,
    tags: '',
    note: '',
    confirmed: false
  });

  // 对话消息解析
  const [messages, setMessages] = useState([]);

  // 获取对话数据集详情
  const fetchConversation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/dataset-conversations/${conversationId}`);

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('对话数据集不存在');
          router.push(`/projects/${projectId}/multi-turn`);
          return;
        }
        throw new Error('获取数据失败');
      }

      const data = await response.json();
      setConversation(data);

      // 解析对话消息
      try {
        const rawMessages = JSON.parse(data.rawMessages || '[]');
        setMessages(rawMessages);
      } catch (error) {
        console.error('解析对话消息失败:', error);
        setMessages([]);
      }

      // 设置编辑数据
      setEditData({
        score: data.score || 0,
        tags: data.tags || '',
        note: data.note || '',
        confirmed: data.confirmed || false
      });
    } catch (error) {
      console.error('获取对话详情失败:', error);
      toast.error(error.message || '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 保存修改
  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/projects/${projectId}/dataset-conversations/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        throw new Error('保存失败');
      }

      const updatedData = await response.json();
      setConversation({ ...conversation, ...editData });
      setEditMode(false);
      toast.success('保存成功');
    } catch (error) {
      console.error('保存失败:', error);
      toast.error(error.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 删除对话数据集
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/dataset-conversations/${conversationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      toast.success('删除成功');
      router.push(`/projects/${projectId}/multi-turn`);
    } catch (error) {
      console.error('删除失败:', error);
      toast.error(error.message || '删除失败');
    }
  };

  // 获取角色显示名称
  const getRoleDisplay = role => {
    switch (role) {
      case 'system':
        return { name: '系统', color: 'default' };
      case 'user':
        return { name: conversation?.roleA || '用户', color: 'primary' };
      case 'assistant':
        return { name: conversation?.roleB || '助手', color: 'secondary' };
      default:
        return { name: role, color: 'default' };
    }
  };

  // 页面初始化
  useEffect(() => {
    fetchConversation();
  }, [projectId, conversationId]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={40} />
      </Container>
    );
  }

  if (!conversation) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">对话数据集不存在</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 顶部操作栏 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => router.push(`/projects/${projectId}/multi-turn`)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            多轮对话详情
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {editMode ? (
            <>
              <Button onClick={() => setEditMode(false)}>取消</Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '保存中...' : '保存'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditMode(true)}>
                编辑
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                删除
              </Button>
              {/* TODO: 添加左右翻页按钮 */}
              <IconButton disabled>
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton disabled>
                <NavigateNextIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* 左侧：多轮对话展示 */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              对话内容
            </Typography>

            <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
              {messages.map((message, index) => {
                const roleInfo = getRoleDisplay(message.role);
                return (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={roleInfo.name}
                        size="small"
                        color={roleInfo.color}
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        第 {Math.floor(index / 2) + 1} 轮
                      </Typography>
                    </Box>
                    <Card variant="outlined" sx={{ mb: 1 }}>
                      <CardContent sx={{ py: 2 }}>
                        <Typography
                          variant="body2"
                          component="pre"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            fontFamily: 'inherit'
                          }}
                        >
                          {message.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>

        {/* 右侧：元数据和设置 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              基本信息
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                首轮问题
              </Typography>
              <Typography variant="body2">{conversation.question}</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                对话场景
              </Typography>
              <Chip
                label={conversation.scenario || '未设置'}
                size="small"
                variant="outlined"
                color={conversation.scenario ? 'primary' : 'default'}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                对话轮数
              </Typography>
              <Typography variant="body2">
                {conversation.turnCount} / {conversation.maxTurns}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                使用模型
              </Typography>
              <Chip label={conversation.model} size="small" variant="outlined" color="info" />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 评分 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                质量评分
              </Typography>
              {editMode ? (
                <Rating
                  value={editData.score}
                  onChange={(event, newValue) => {
                    setEditData({ ...editData, score: newValue });
                  }}
                  max={5}
                  precision={0.5}
                />
              ) : (
                <Rating value={conversation.score} readOnly max={5} precision={0.5} />
              )}
            </Box>

            {/* 自定义标签 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                自定义标签
              </Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  size="small"
                  value={editData.tags}
                  onChange={e => setEditData({ ...editData, tags: e.target.value })}
                  placeholder="输入标签，用空格分隔"
                />
              ) : (
                <Typography variant="body2">{conversation.tags || '无标签'}</Typography>
              )}
            </Box>

            {/* 备注 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                备注
              </Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  value={editData.note}
                  onChange={e => setEditData({ ...editData, note: e.target.value })}
                  placeholder="添加备注信息"
                />
              ) : (
                <Typography variant="body2">{conversation.note || '无备注'}</Typography>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                AI 质量评估
              </Typography>
              <Typography variant="body2">{conversation.aiEvaluation || '暂未评估'}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                创建时间
              </Typography>
              <Typography variant="body2">{new Date(conversation.createAt).toLocaleString()}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>确定要删除这个多轮对话数据集吗？此操作不可恢复。</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button color="error" onClick={handleDelete}>
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
