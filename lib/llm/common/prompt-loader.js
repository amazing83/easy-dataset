import { getCustomPrompt } from '@/lib/db/custom-prompts';

/**
 * 获取提示词内容，优先使用项目自定义的，否则使用默认的
 * @param {string} projectId 项目ID
 * @param {string} promptType 提示词类型 (如: question, answer等)
 * @param {string} promptKey 提示词键名 (如: QUESTION_PROMPT, QUESTION_PROMPT_EN等)
 * @param {string} language 语言 (zh-CN, en)
 * @param {string} defaultContent 默认提示词内容
 * @returns {Promise<string>} 提示词内容
 */
export async function getPromptContent(projectId, promptType, promptKey, language, defaultContent) {
  try {
    if (!projectId) {
      return defaultContent;
    }

    const customPrompt = await getCustomPrompt(projectId, promptType, promptKey, language);

    if (customPrompt && customPrompt.isActive && customPrompt.content) {
      return customPrompt.content;
    }

    return defaultContent;
  } catch (error) {
    console.error('获取提示词内容失败:', error);
    return defaultContent;
  }
}

/**
 * 根据语言获取对应的提示词键名
 * @param {string} language 语言
 * @param {string} baseKey 基础键名
 * @returns {string} 完整的提示词键名
 */
export function getPromptKey(language, baseKey) {
  if (language === 'en') {
    return `${baseKey}_EN`;
  }
  return baseKey;
}

/**
 * 根据提示词键名获取对应的语言
 * @param {string} promptKey 提示词键名
 * @returns {string} 语言
 */
export function getLanguageFromKey(promptKey) {
  return promptKey.endsWith('_EN') ? 'en' : 'zh-CN';
}
