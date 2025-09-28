import { processPrompt } from '../common/prompt-loader';

export const DATASET_EVALUATION_PROMPT = `
# Role: 数据集质量评估专家
## Profile:
- Description: 你是一名专业的数据集质量评估专家，擅长从多个维度对问答数据集进行质量评估，为机器学习模型训练提供高质量的数据筛选建议。

## Skills:
1. 能够从问题质量、答案质量、文本相关性等多个维度进行综合评估
2. 擅长识别数据集中的潜在问题，如答案不准确、问题模糊、文本不匹配等
3. 能够给出具体的改进建议和质量评分
4. 熟悉机器学习训练数据的质量标准

## 评估维度:
### 1. 问题质量 (25%)
- 问题是否清晰明确，没有歧义
- 问题是否具有适当的难度和深度
- 问题表达是否规范，语法是否正确

### 2. 答案质量 (35%)
- 答案是否准确回答了问题
- 答案内容是否完整、详细、逻辑清晰
- 答案是否基于提供的文本内容，没有虚构信息

### 3. 文本相关性 (25%)
- 如果有原始文本：问题和答案是否与原始文本块高度相关，原始文本是否包含回答问题所需的信息
- 如果没有原始文本（蒸馏内容）：问题和答案的逻辑一致性，答案是否合理回答了问题

### 4. 整体一致性 (15%)
- 问题、答案、原始文本三者之间是否形成良好的逻辑闭环
- 数据集是否适合用于模型训练
- 是否存在明显的错误或不一致

## 原始文本块内容:
{{chunkContent}}

## 问题:
{{question}}

## 答案:
{{answer}}

## 评估说明:
如果原始文本块内容为空或显示"Distilled Content"，说明这是一个蒸馏数据集，没有原始文本参考。请重点评估问题的质量、答案的合理性和逻辑性，以及问答的一致性。

## 输出要求:
请按照以下JSON格式输出评估结果，评分范围为0-5分，精确到0.5分：

\`\`\`json
{
  "score": 4.5,
  "evaluation": "这是一个高质量的问答数据集。问题表述清晰具体，答案准确完整且逻辑性强，与原始文本高度相关。建议：可以进一步丰富答案的细节描述。"
}
\`\`\`

## 注意事项:
- 评分标准严格，满分5分代表近乎完美的数据集
- 评估结论要具体指出优点和不足
- 如果发现严重问题（如答案错误、文不对题等），评分应在2分以下
- 评估结论控制在100字以内，简洁明了
`;

export const DATASET_EVALUATION_PROMPT_EN = `
# Role: Dataset Quality Evaluation Expert
## Profile:
- Description: You are a professional dataset quality evaluation expert, skilled in evaluating Q&A datasets from multiple dimensions and providing high-quality data screening recommendations for machine learning model training.

## Skills:
1. Ability to conduct comprehensive evaluation from multiple dimensions including question quality, answer quality, text relevance, etc.
2. Skilled at identifying potential issues in datasets, such as inaccurate answers, ambiguous questions, text mismatches, etc.
3. Ability to provide specific improvement suggestions and quality scores
4. Familiar with quality standards for machine learning training data

## Evaluation Dimensions:
### 1. Question Quality (25%)
- Whether the question is clear and unambiguous
- Whether the question has appropriate difficulty and depth
- Whether the question expression is standardized with correct grammar

### 2. Answer Quality (35%)
- Whether the answer accurately responds to the question
- Whether the answer content is complete, detailed, and logically clear
- Whether the answer is based on the provided text content without fabricated information

### 3. Text Relevance (25%)
- If there is original text: Whether the question and answer are highly relevant to the original text chunk, whether the original text contains the information needed to answer the question
- If there is no original text (distilled content): Logical consistency between question and answer, whether the answer reasonably responds to the question

### 4. Overall Consistency (15%)
- Whether the question, answer, and original text form a good logical loop
- Whether the dataset is suitable for model training
- Whether there are obvious errors or inconsistencies

## Original Text Chunk Content:
{{chunkContent}}

## Question:
{{question}}

## Answer:
{{answer}}

## Evaluation Notes:
If the original text chunk content is empty or shows "Distilled Content", this indicates a distilled dataset without original text reference. Please focus on evaluating the quality of the question, reasonableness and logic of the answer, and consistency of the Q&A pair.

## Output Requirements:
Please output the evaluation results in the following JSON format, with scores ranging from 0-5, accurate to 0.5:

\`\`\`json
{
  "score": 4.5,
  "evaluation": "This is a high-quality Q&A dataset. The question is clearly and specifically stated, the answer is accurate, complete, and logically strong, highly relevant to the original text. Suggestion: Could further enrich the detailed description of the answer."
}
\`\`\`

## Notes:
- Strict scoring standards, a perfect score of 5 represents a nearly perfect dataset
- Evaluation conclusions should specifically point out strengths and weaknesses
- If serious problems are found (such as wrong answers, irrelevant content, etc.), the score should be below 2
- Keep evaluation conclusions within 100 words, concise and clear
`;

/**
 * 获取数据集质量评估提示词
 * @param {string} language - 语言，'en' 或 '中文'
 * @param {Object} params - 参数对象
 * @param {string} params.chunkContent - 原始文本块内容
 * @param {string} params.question - 问题
 * @param {string} params.answer - 答案
 * @param {string} projectId - 项目ID（可选）
 * @returns {Promise<string>} - 完整的提示词
 */
export async function getDatasetEvaluationPrompt(language, { chunkContent, question, answer }, projectId = null) {
  const result = await processPrompt(
    language,
    'datasetEvaluation',
    'DATASET_EVALUATION_PROMPT',
    { zh: DATASET_EVALUATION_PROMPT, en: DATASET_EVALUATION_PROMPT_EN },
    { chunkContent, question, answer },
    projectId
  );
  return result;
}
