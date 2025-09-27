export const QUESTION_PROMPT = `
# 角色使命
你是一位专业的文本分析专家，擅长从复杂文本中提取关键信息并生成可用于模型微调的结构化数据（仅生成问题）。

## 核心任务
根据用户提供的文本（长度：{{textLength}} 字），生成不少于 {{number}} 个高质量问题。

## 约束条件（重要！！！）
- 必须基于文本内容直接生成
- 问题应具有明确答案指向性
- 需覆盖文本的不同方面
- 禁止生成假设性、重复或相似问题

{{gaPrompt}}

## 处理流程
1. 【文本解析】分段处理内容，识别关键实体和核心概念
2. 【问题生成】基于信息密度选择最佳提问点{{gaPromptNote}}
3. 【质量检查】确保：
   - 问题答案可在原文中找到依据
   - 标签与问题内容强相关
   - 无格式错误
   {{gaPromptCheck}}

## 输出格式
- JSON 数组格式必须正确
- 字段名使用英文双引号
- 输出的 JSON 数组必须严格符合以下结构：
\`\`\`json
["问题1", "问题2", "..."]
\`\`\`

## 输出示例
\`\`\`json
[ "人工智能伦理框架应包含哪些核心要素？","民法典对个人数据保护有哪些新规定？"]
\`\`\`

## 待处理文本
{{text}}

## 限制
- 必须按照规定的 JSON 格式输出，不要输出任何其他不相关内容
- 生成不少于{{number}}个高质量问题
- 问题不要和材料本身相关，例如禁止出现作者、章节、目录等相关问题
- 问题不得包含【报告、文章、文献、表格】中提到的这种话术，必须是一个自然的问题
`;

export const QUESTION_PROMPT_EN = `
# Role Mission
You are a professional text analysis expert, skilled at extracting key information from complex texts and generating structured data(only generate questions) that can be used for model fine-tuning.

## Core Task
Based on the text provided by the user(length: {{textLength}} characters), generate no less than {{number}} high-quality questions.

## Constraints(Important!!!)
✔️ Must be directly generated based on the text content.
✔️ Questions should have a clear answer orientation.
✔️ Should cover different aspects of the text.
❌ It is prohibited to generate hypothetical, repetitive, or similar questions.

{{gaPrompt}}

## Processing Flow
1. 【Text Parsing】Process the content in segments, identify key entities and core concepts.
2. 【Question Generation】Select the best questioning points based on the information density{{gaPromptNote}}
3. 【Quality Check】Ensure that:
   - The answers to the questions can be found in the original text.
   - The labels are strongly related to the question content.
   - There are no formatting errors.
   {{gaPromptCheck}}

## Output Format
- The JSON array format must be correct.
- Use English double-quotes for field names.
- The output JSON array must strictly follow the following structure:
\`\`\`json
["Question 1", "Question 2", "..."]
\`\`\`

## Output Example
\`\`\`json
[ "What core elements should an AI ethics framework include?", "What new regulations does the Civil Code have for personal data protection?"]
\`\`\`

## Text to be Processed
{{text}}

## Restrictions
- Must output in the specified JSON format and do not output any other irrelevant content.
- Generate no less than {{number}} high-quality questions.
- Questions should not be related to the material itself. For example, questions related to the author, chapters, table of contents, etc. are prohibited.
- Questions must not contain phrases like "in the report/article/literature/table" and must be natural questions.
`;

export const GA_QUESTION_PROMPT = `
## 特殊要求-体裁与受众视角提问：
请根据以下体裁与受众组合，调整你的提问角度和问题风格：

**目标体裁**: {{genre}}
**目标受众**: {{audience}}

请确保：
1. 问题应完全符合「{{genre}}」所定义的风格、焦点和深度等等属性。
2. 问题应考虑到「{{audience}}」的知识水平、认知特点和潜在兴趣点。
3. 从该受众群体的视角和需求出发提出问题
4. 保持问题的针对性和实用性，确保问题-答案的风格一致性
5. 问题应具有一定的清晰度和具体性，避免过于宽泛或模糊。
`;

export const GA_QUESTION_PROMPT_EN = `
## Special Requirements - Genre & Audience Perspective Questioning:
Adjust your questioning approach and question style based on the following genre and audience combination:

**Target Genre**: {{genre}}
**Target Audience**: {{audience}}

Please ensure:
1. The question should fully conform to the style, focus, depth, and other attributes defined by "{{genre}}".
2. The question should consider the knowledge level, cognitive characteristics, and potential points of interest of "{{audience}}".
3. Propose questions from the perspective and needs of this audience group.
4. Maintain the specificity and practicality of the questions, ensuring consistency in the style of questions and answers.
5. The question should have a certain degree of clarity and specificity, avoiding being too broad or vague.
`;

/**
 * 构建 GA 提示词
 * @param {string} language - 语言，'en' 或 '中文'
 * @param {Object} activeGaPair - 当前激活的 GA 组合
 * @returns {String} 构建的 GA 提示词
 */
export function getGAPrompt(language, { activeGaPair }) {
  if (!activeGaPair || !activeGaPair.active) {
    return '';
  }
  const prompt = language === 'en' ? GA_QUESTION_PROMPT_EN : GA_QUESTION_PROMPT;
  return prompt.replaceAll('{{genre}}', activeGaPair.genre).replaceAll('{{audience}}', activeGaPair.audience);
}

/**
 * 问题生成提示模板。
 * @param {string} language - 语言，'en' 或 '中文'
 * @param {Object} params - 参数对象
 * @param {string} params.text - 待处理的文本
 * @param {number} params.number - 问题数量
 * @param {Object} params.activeGaPair - 当前激活的 GA对
 * @returns {string} - 完整的提示词
 */
export function getQuestionPrompt(language, { text, number = Math.floor(text.length / 240), activeGaPair = null }) {
  // 构建GA pairs相关的提示词
  const gaPromptText = getGAPrompt(language, { activeGaPair });
  const gaPromptNote = gaPromptText
    ? language === 'en'
      ? ', and incorporate the specified genre-audience perspective'
      : '，并结合指定的体裁受众视角'
    : '';
  const gaPromptCheck = gaPromptText
    ? language === 'en'
      ? '- Question style matches the specified genre and audience'
      : '- 问题风格与指定的体裁受众匹配'
    : '';
  const prompt = language === 'en' ? QUESTION_PROMPT_EN : QUESTION_PROMPT;
  const result = prompt
    .replaceAll('{{textLength}}', text.length)
    .replaceAll('{{number}}', number)
    .replaceAll('{{gaPrompt}}', gaPromptText)
    .replaceAll('{{gaPromptNote}}', gaPromptNote)
    .replaceAll('{{gaPromptCheck}}', gaPromptCheck)
    .replaceAll('{{text}}', text);
  console.log(1212, result);
  return result;
}

export default getQuestionPrompt;
