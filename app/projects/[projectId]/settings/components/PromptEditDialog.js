import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';

/**
 * 提示词编辑对话框组件
 */
const PromptEditDialog = ({
  open,
  title,
  promptType,
  promptKey,
  content,
  loading,
  onClose,
  onSave,
  onRestore,
  onContentChange
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{title || '编辑提示词'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            提示词类型: {promptType} | 键名: {promptKey}
          </Typography>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={20}
          value={content}
          onChange={e => onContentChange(e.target.value)}
          placeholder="请输入自定义提示词内容..."
          sx={{
            mb: 2,
            '& .MuiInputBase-input': {
              fontFamily: 'monospace'
            }
          }}
        />

        <Box display="flex" gap={1}>
          <Button startIcon={<RestoreIcon />} onClick={onRestore} size="small" variant="outlined">
            恢复默认内容
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={onSave} variant="contained" disabled={loading} startIcon={<SaveIcon />}>
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromptEditDialog;
