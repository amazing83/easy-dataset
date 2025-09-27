import React from 'react';
import { Card, CardContent, Box, Typography, Chip, Button, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactMarkdown from 'react-markdown';

import 'github-markdown-css/github-markdown-light.css';

/**
 * 右侧提示词详情展示组件
 */
const PromptDetail = ({
  currentPromptConfig,
  selectedPrompt,
  promptContent,
  isCustomized,
  onEditClick,
  onDeleteClick
}) => {
  if (!currentPromptConfig) {
    return <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>请在左侧选择一个提示词</Box>;
  }

  const handleEditClick = () => {
    onEditClick();
  };

  const handleDeleteClick = () => {
    onDeleteClick();
  };

  return (
    <Card>
      <CardContent>
        {/* 标题、描述与操作区域 */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6">{currentPromptConfig.name}</Typography>
              {isCustomized(selectedPrompt) && <Chip label="已自定义" color="primary" size="small" />}
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Button startIcon={<EditIcon />} variant="contained" size="small" onClick={handleEditClick}>
                编辑提示词
              </Button>

              {isCustomized(selectedPrompt) && (
                <Button startIcon={<DeleteIcon />} color="error" size="small" onClick={handleDeleteClick}>
                  恢复默认
                </Button>
              )}
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {currentPromptConfig.description}
          </Typography>
        </Box>

        {/* Markdown 渲染提示词内容 */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            overflow: 'auto'
          }}
        >
          <div className="markdown-body">
            <ReactMarkdown>{promptContent}</ReactMarkdown>
          </div>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default PromptDetail;
